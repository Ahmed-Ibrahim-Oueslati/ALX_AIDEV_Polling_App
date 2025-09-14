'use server';

import { createClient } from '@/lib/supabase/server';

type SecurityEvent = 'invalid_credentials_format' | 'rate_limit_exceeded' | 'invalid_login_attempt' | 'successful_login' | 'authentication_system_error';

interface SecurityEventPayload {
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  error?: string;
}

/**
 * @function logSecurityEvent
 * @description Logs a security-related event to the database for auditing and monitoring.
 * @param {SecurityEvent} event - The type of security event to log.
 * @param {SecurityEventPayload} payload - The data associated with the event.
 */
export async function logSecurityEvent(event: SecurityEvent, payload: SecurityEventPayload) {
  const supabase = await createClient();

  try {
    await supabase.from('security_logs').insert({
      event_type: event,
      payload: payload,
      ip_address: payload.ipAddress,
      user_id: payload.userId,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * @function updateUserLoginMetadata
 * @description Updates the user's last login timestamp and IP address.
 * @param {string} userId - The ID of the user to update.
 * @param {{ lastLoginAt: Date, lastLoginIP: string, lastUserAgent: string }} metadata - The metadata to update.
 */
export async function updateUserLoginMetadata(userId: string, metadata: { lastLoginAt: Date, lastLoginIP: string, lastUserAgent: string }) {
  const supabase = await createClient();

  try {
    await supabase
      .from('users')
      .update({
        last_login_at: metadata.lastLoginAt.toISOString(),
        last_login_ip: metadata.lastLoginIP,
        last_user_agent: metadata.lastUserAgent,
      })
      .eq('id', userId);
  } catch (error) {
    console.error('Failed to update user login metadata:', error);
  }
}
