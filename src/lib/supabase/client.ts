import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // In the browser, use direct string access or window object
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL:', supabaseUrl)
    console.error('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

