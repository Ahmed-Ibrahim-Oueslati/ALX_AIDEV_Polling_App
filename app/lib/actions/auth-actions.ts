'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

import { z } from 'zod';
import { logSecurityEvent, updateUserLoginMetadata } from './security-actions';

// Zod schema for login credentials
const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

/**
 * Handles user login by authenticating with Supabase.
 *
 * This server action takes user credentials, attempts to sign them in using
 * Supabase Auth, and returns an object indicating success or failure.
 *
 * @param {LoginFormData} data - An object containing the user's email and password.
 * @returns {Promise<{ error: string | null }>} A promise that resolves to an object
 * with an `error` property. If login is successful, `error` is `null`.
 * Otherwise, it contains an error message.
 */
export async function login(data: LoginFormData, metadata: { userAgent: string, ipAddress: string }) {
  const supabase = await createClient();

  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    await logSecurityEvent('invalid_credentials_format', { email: data.email, ipAddress: metadata.ipAddress });
    return { error: validation.error.flatten().fieldErrors };
  }

  const { email, password } = validation.data;

  // Rate limiting check would be implemented here in a real application

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      await logSecurityEvent('invalid_login_attempt', { email, ipAddress: metadata.ipAddress, userAgent: metadata.userAgent });
      return { error: 'Invalid email or password' };
    }

    if (!authData.user) {
      return { error: 'Authentication failed' };
    }

    await logSecurityEvent('successful_login', {
      userId: authData.user.id,
      email: authData.user.email,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    await updateUserLoginMetadata(authData.user.id, {
      lastLoginAt: new Date(),
      lastLoginIP: metadata.ipAddress,
      lastUserAgent: metadata.userAgent,
    });

    return { error: null };

  } catch (error) {
    console.error('Unexpected error in login:', error);
    await logSecurityEvent('authentication_system_error', { email, ipAddress: metadata.ipAddress, error: (error as Error).message });
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Registers a new user with Supabase.
 *
 * This server action creates a new user account using the provided email,
 * password, and name. The user's name is stored in the `user_metadata`.
 *
 * @param {RegisterFormData} data - An object containing the new user's name, email, and password.
 * @returns {Promise<{ error: string | null }>} A promise that resolves to an object
 * with an `error` property. If registration is successful, `error` is `null`.
 * Otherwise, it contains an error message (e.g., "User already registered").
 *
 * @example
 * ```typescript
 * const result = await register({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
 * if (result.error) {
 *   console.error('Registration failed:', result.error);
 * } else {
 *   console.log('Registration successful!');
 * }
 * ```
 *
 * @see {@link https://supabase.com/docs/reference/javascript/auth-signup}
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  // Attempt to sign up a new user
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      // Store additional user data
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    // Return a structured error response
    return { error: error.message };
  }

  // On success, return with no error
  return { error: null };
}

/**
 * Logs out the currently authenticated user.
 *
 * This server action signs the user out of their current session by invalidating
 * their session token in Supabase.
 *
 * @returns {Promise<{ error: string | null }>} A promise that resolves to an object
 * with an `error` property. If logout is successful, `error` is `null`.
 *
 * @example
 * ```typescript
 * await logout();
 * // User is now logged out.
 * ```
 *
 * @see {@link https://supabase.com/docs/reference/javascript/auth-signout}
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Retrieves the currently authenticated user's data.
 *
 * This function fetches the user object from the current session.
 * It's useful for server-side checks to determine if a user is logged in
 * and to access their properties (e.g., ID, email).
 *
 * @returns {Promise<User | null>} A promise that resolves to the `User` object
 * if a user is authenticated, or `null` otherwise.
 *
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('Current user:', user.email);
 * } else {
 *   console.log('No user is logged in.');
 * }
 * ```
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Retrieves the current authentication session.
 *
 * This function fetches the session object, which includes the access token,
 * refresh token, and user data. It's useful for more advanced session management
 * on the server side.
 *
 * @returns {Promise<Session | null>} A promise that resolves to the `Session` object
 * if a session exists, or `null` otherwise.
 *
 * @example
 * ```typescript
 * const session = await getSession();
 * if (session) {
 *   console.log('Session is active.');
 * } else {
 *   console.log('No active session.');
 * }
 * ```
 */
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}
