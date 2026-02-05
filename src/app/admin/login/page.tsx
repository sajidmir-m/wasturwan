"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, Lock, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import Link from "next/link"
import { checkUserRole } from "@/lib/actions/auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Step 1: Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please check your credentials.")
        setLoading(false)
        return
      }

      if (!data?.user) {
        setError("Failed to authenticate. Please try again.")
        setLoading(false)
        return
      }

      // Step 2: Wait for session cookies to be set
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Step 3: Try to check role using client-side first (faster)
      let roleCheck
      try {
        // First try client-side query (if RLS allows)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', data.user.id)
          .maybeSingle()

        if (!userError && userData) {
          const role = userData.role?.toString().toLowerCase().trim()
          roleCheck = {
            success: true,
            user: userData,
            isAdmin: role === 'admin',
            exists: true
          }
        } else {
          // Fallback to server action
          roleCheck = await checkUserRole(data.user.id)
        }
      } catch (actionError: any) {
        // If both fail, try server action as last resort
        try {
          roleCheck = await checkUserRole(data.user.id)
        } catch (finalError: any) {
          console.error('All role check methods failed:', finalError)
          await supabase.auth.signOut()
          setError(
            "Failed to verify admin access. This might be due to:\n" +
            "1. Database not set up (run supabase/schema.sql)\n" +
            "2. Your user record doesn't exist in the database\n" +
            "3. Network connection issue\n\n" +
            "Please check /admin/test-connection for details."
          )
            setLoading(false)
            return
          }
        }

      // Step 4: Process role check result
      // Validate response structure
      if (!roleCheck || typeof roleCheck !== 'object') {
        await supabase.auth.signOut()
        setError("Invalid response from server. Please check your database connection.")
        setLoading(false)
        return
      }

      // Log for debugging
      console.log('Role check result:', roleCheck)
      
      if (!roleCheck.success) {
        await supabase.auth.signOut()
        const errorMsg = roleCheck.error || "Failed to verify admin access."
        setError(
          `${errorMsg}\n\n` +
          "Your user record might not exist. Please:\n" +
          "1. Go to Supabase Dashboard → SQL Editor\n" +
          "2. Run: INSERT INTO public.users (id, email, role) VALUES ('" + 
          data.user.id + "', '" + email + "', 'admin');"
        )
        setLoading(false)
        return
      }

      if (!roleCheck.isAdmin) {
          await supabase.auth.signOut()
        const currentRole = roleCheck.user?.role || 'not set'
        setError(
          `Access denied. Your current role is: "${currentRole}". Admin role required.\n\n` +
          `To fix, run this SQL in Supabase:\n` +
          `UPDATE public.users SET role = 'admin' WHERE id = '${data.user.id}';`
        )
          setLoading(false)
          return
        }

      // Success - redirect to admin dashboard
        router.push('/admin')
        router.refresh()
    } catch (err: any) {
      console.error('Login form error:', err)
      const errorMsg = err?.message || err?.toString() || "An error occurred."
      setError(`${errorMsg} Please try again or check your connection.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif font-bold">Admin Login</CardTitle>
            <p className="text-blue-100 mt-2">Wasturwan Travels</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm whitespace-pre-line">{error}</div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" /> Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@wasturwantravels.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-center text-slate-600 mb-4">
                Don't have an account?
              </p>
              <Link href="/admin/register">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-blue-200 hover:bg-blue-50 text-sm text-blue-700 font-semibold"
                >
                  Create Admin Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

