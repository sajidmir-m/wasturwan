"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, Lock, AlertCircle, User, CheckCircle, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { registerAdmin } from "@/lib/actions/auth"

export default function AdminRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const result = await registerAdmin(email, password, name)
      
      if (result.success) {
        setSuccess(true)
        setRegisteredEmail(email) // Store the email for display
        // Don't auto-redirect, let user click the button
      } else {
        // Show detailed error message
        let errorMsg = result.error || "Registration failed. Please try again."
        if (result.code === 'USER_EXISTS') {
          errorMsg += " Click 'Back to Login' to sign in instead."
        }
        setError(errorMsg)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
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
            <CardTitle className="text-3xl font-serif font-bold">Create Admin Account</CardTitle>
            <p className="text-blue-100 mt-2">Wasturwan Travels</p>
          </CardHeader>
          <CardContent className="p-8">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Account Created Successfully!</h3>
                <p className="text-slate-600">
                  Your admin account has been created. You can now login with your credentials.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {registeredEmail && (
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono text-xs">
                      {registeredEmail}
                    </span>
                  )}
                </p>
                <div className="pt-4">
                  <Link href="/admin/login">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 rounded-xl font-semibold">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleRegister} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" /> Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

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
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" /> Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Creating Account..." : "Create Admin Account"}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Link href="/admin/login">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

