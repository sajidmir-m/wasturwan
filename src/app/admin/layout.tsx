import AdminSidebar from "@/components/admin/AdminSidebar"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
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


