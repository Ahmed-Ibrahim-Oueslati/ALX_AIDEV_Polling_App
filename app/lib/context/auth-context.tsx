'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context, providing session, user, and sign-out functionality.
 * @property {Session | null} session - The current user's session object, or null if not authenticated.
 * @property {User | null} user - The current user object, or null if not authenticated.
 * @property {() => void} signOut - A function to sign the user out.
 * @property {boolean} loading - A boolean indicating if the authentication state is currently being loaded.
 */
const AuthContext = createContext<{ 
  session: Session | null;
  user: User | null;
  signOut: () => void;
  loading: boolean;
}>({ 
  session: null, 
  user: null,
  signOut: () => {},
  loading: true,
});

/**
 * @component AuthProvider
 * @description Provides authentication context to its children components.
 * It manages the user's session and authentication state using Supabase.
 * @param {{ children: React.ReactNode }} { children } - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The authentication context provider.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Memoize the Supabase client to prevent re-creation on re-renders.
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    /**
     * @function getUser
     * @description Fetches the current user from Supabase and updates the state.
     * This is called on initial component mount to check for an existing session.
     */
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      }
      // Only update state if the component is still mounted.
      if (mounted) {
        setUser(data.user ?? null);
        setSession(null); // Session is handled by onAuthStateChange
        setLoading(false);
        console.log('AuthContext: Initial user loaded', data.user);
      }
    };

    getUser();

    // Listen for changes in the authentication state (sign-in, sign-out).
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log('AuthContext: Auth state changed', _event, session, session?.user);
    });

    // Cleanup function to unsubscribe from the auth listener when the component unmounts.
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * @function signOut
   * @description Signs the current user out of the application using Supabase.
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  console.log('AuthContext: user', user);
  return (
    <AuthContext.Provider value={{ session, user, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @hook useAuth
 * @description A custom hook to easily access the authentication context.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => useContext(AuthContext);
