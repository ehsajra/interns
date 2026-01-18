import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  role: 'INTERN' | 'GUIDE' | 'ADMIN';
  profile?: any;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: User;
}

export const getAccessToken = async (): Promise<string | null> => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export const getUser = async (): Promise<User | null> => {
  const supabase = createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  
  if (!supabaseUser) return null;

  // Get user profile from our API
  try {
    const token = await getAccessToken();
    if (!token) return null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (error) {
    console.error('Failed to get user profile:', error);
  }

  return null;
};

export const clearAuth = async (): Promise<void> => {
  const supabase = createClient();
  await supabase.auth.signOut();
};

