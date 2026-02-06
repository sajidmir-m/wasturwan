import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import dns from 'node:dns'

// Force IPv4 for Supabase connection stability in Node 18+ environments (prevents fetch failed / ECONNRESET)
try {
  if (dns && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first')
  }
} catch (e) {
  // Ignore if not supported
}

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
 * - Uses a completely isolated client instance
 * 
 * Use this for public-facing operations that should work regardless of browser auth state.
 */
export function createAnonymousClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  // Create a completely fresh Supabase client instance
  // This ensures no shared state, cookies, or auth sessions are used
  // Each call to this function creates a brand new client
  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: () => null, // Always return null - no stored sessions
        setItem: () => {}, // No-op - don't store anything
        removeItem: () => {}, // No-op
      },
    },
    db: {
      schema: 'public',
    },
    global: {
      // Explicitly set headers to ensure anonymous access
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    },
  })

  // Don't check or clear sessions - just return the client
  // The storage always returns null, so no session can exist
  return client
}
