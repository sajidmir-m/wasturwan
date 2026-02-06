"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Check if user is admin
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (userData && userData.role === "admin") {
            router.push("/admin")
            return
          }
        }
      } catch (err) {
        // Ignore errors, just show login page
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || "Invalid email or password")
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Login failed. Please try again.")
        setLoading(false)
        return
      }

      // Wait a moment for session to propagate to cookies
      await new Promise(resolve => setTimeout(resolve, 500))

      // Always call the API route to ensure user exists and has admin role
      // This handles both creation and role updates
      let userCreated = false
      let retryCount = 0
      const maxRetries = 3

      while (!userCreated && retryCount < maxRetries) {
        try {
          const createUserRes = await fetch("/api/admin/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          })

          if (createUserRes.ok) {
            const result = await createUserRes.json()
            
            // Verify the user was created/updated with admin role
            if (result.user && result.user.role === "admin") {
              userCreated = true
              // Success - redirect to admin dashboard
              router.push("/admin")
              router.refresh()
              return
            } else {
              await supabase.auth.signOut()
              setError("Failed to grant admin access. User created but role verification failed.")
              setLoading(false)
              return
            }
          } else {
            const errorData = await createUserRes.json().catch(() => ({ error: "Unknown error" }))
            console.error(`Attempt ${retryCount + 1} failed:`, errorData)
            
            // If 401 and we haven't exhausted retries, wait and retry
            if (createUserRes.status === 401 && retryCount < maxRetries - 1) {
              retryCount++
              await new Promise(resolve => setTimeout(resolve, 500))
              continue
            } else {
              setError(`Error setting up admin account: ${errorData.error || "Unknown error"}. Please try again.`)
              setLoading(false)
              return
            }
          }
        } catch (fetchError: any) {
          console.error(`Network error on attempt ${retryCount + 1}:`, fetchError)
          if (retryCount < maxRetries - 1) {
            retryCount++
            await new Promise(resolve => setTimeout(resolve, 500))
            continue
          } else {
            setError("Network error. Please check your connection and try again.")
            setLoading(false)
            return
          }
        }
      }

      // If we get here, all retries failed
      setError("Failed to set up admin account after multiple attempts. Please contact support.")
      setLoading(false)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Wasturwan Admin</h1>
            <p className="text-slate-300">Sign in to access the admin panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              ← Back to website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

