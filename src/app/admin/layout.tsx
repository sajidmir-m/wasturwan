"use client"

import AdminSidebar from "@/components/admin/AdminSidebar"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) return

    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      // Check if user has admin role
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (!userData || userData.role !== "admin") {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [pathname, isLoginPage, router])

  // Don't render sidebar/layout for login page
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-slate-950 text-slate-50 w-full md:w-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}


