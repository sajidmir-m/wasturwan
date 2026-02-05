"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calendar, MessageSquare, Settings, LogOut, Briefcase, Mail, Sparkles, Database, Car } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/journeys", label: "Journeys", icon: Package },
  { href: "/admin/places", label: "Places", icon: Database },
  { href: "/admin/cabs", label: "Cabs", icon: Car },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/contacts", label: "Contact Inquiries", icon: Mail },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen border-r border-slate-700/50">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">Wasturwan Admin</h1>
            <p className="text-xs text-slate-400">Control Panel</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30" 
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mr-3 transition-transform",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@wasturwantravels.com</p>
          </div>
        </div>
        <form action="/admin/logout" method="post">
          <button type="submit" className="flex items-center w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
        </button>
        </form>
      </div>
    </div>
  )
}
