import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client with session management for authenticated/admin operations.
 * Uses cookies and session handling for admin panel and authenticated users.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // Refresh the session to ensure it's up to date
  try {
    await supabase.auth.getSession()
  } catch (error) {
    // Ignore session errors in server actions
  }

  return supabase
}

/**
 * Creates an anonymous-only Supabase client for public operations (e.g., bookings, contacts).
 * 
 * This client:
 * - Does NOT use cookies or session management
 * - Does NOT persist or refresh auth tokens
 * - Always operates as an anonymous user
 * - Bypasses stale/corrupted auth sessions that can cause RLS failures
 * 
 * Use this for public-facing operations that should work regardless of browser auth state.
 */
export function createAnonymousClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  // Create a direct Supabase client without SSR cookie handling
  // This ensures it always operates as anonymous, regardless of browser state
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}


