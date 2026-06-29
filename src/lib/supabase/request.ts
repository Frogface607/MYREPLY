import type { NextRequest } from 'next/server';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createCookieClient } from './server';

function getBearerToken(request?: NextRequest) {
  const authorization = request?.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim() || null;
}

export async function createRequestClient(request?: NextRequest): Promise<SupabaseClient> {
  const token = getBearerToken(request);

  if (!token) {
    return createCookieClient();
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function getRequestUser(supabase: SupabaseClient, request?: NextRequest) {
  const token = getBearerToken(request);
  return token ? supabase.auth.getUser(token) : supabase.auth.getUser();
}
