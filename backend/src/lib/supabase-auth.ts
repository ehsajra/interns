import { supabaseAdmin } from './supabase';

/**
 * Supabase Auth Integration
 * 
 * Note: We'll migrate from custom JWT to Supabase Auth
 * For now, this provides helper functions to work with Supabase Auth
 */

export interface SupabaseUser {
  id: string;
  email: string;
  role?: string;
  email_confirmed_at?: string;
}

/**
 * Create a user in Supabase Auth
 */
export async function createSupabaseUser(
  email: string,
  password: string,
  metadata?: Record<string, any>
) {
  // Check if email confirmation is disabled (useful for testing)
  const disableEmailConfirmation = process.env.DISABLE_EMAIL_CONFIRMATION === 'true';
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: disableEmailConfirmation ? true : false, // Auto-confirm if disabled for testing
    user_metadata: metadata || {},
  });

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data.user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }

  return data.user;
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  updates: {
    email?: string;
    password?: string;
    metadata?: Record<string, any>;
  }
) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    updates
  );

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data.user;
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  return data;
}

/**
 * Verify token and get user
 */
export async function verifyToken(accessToken: string) {
  // Create a client with the access token
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error(`Invalid token: ${error?.message || 'User not found'}`);
  }

  return data.user;
}

