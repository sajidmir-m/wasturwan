"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, Search, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/cabs", label: "Cabs" },
  { href: "/places", label: "Places" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
      setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname?.startsWith("/admin") || pathname === "/intro") return null

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200 px-4 md:px-8 will-change-transform",
          scrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-200 will-change-transform",
            scrolled
              ? "bg-white/95 py-2.5 px-5 border-slate-200/60"
              : "bg-white/70 py-3.5 px-7 border-slate-200/40"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/home" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-200 group-hover:scale-105 transition">
                <Image
                  src="/log.jpeg"
                  alt="Wasturwan Travels"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <span className="hidden sm:inline-block text-lg font-serif font-bold text-slate-900">
                Wasturwan<span className="text-blue-600"> Travels</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50/50 transition uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2.5 hover:bg-slate-100 rounded-xl">
                <Search className="w-5 h-5 text-slate-600" />
              </button>

              {/* Call Button – Silver */}
              <a href="tel:+917006594976">
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-black border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition px-4 h-9 flex items-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </a>

              {/* WhatsApp stays same */}
              <a
                href="https://wa.me/917006594976"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 h-9 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>

              {/* Book Now – Silver */}
              <Link href="/book">
                <Button
                  className="rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-black border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition px-5 h-10 shadow-md hover:scale-105"
                >
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Redesigned */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-gradient-to-b from-white to-slate-50 shadow-2xl will-change-transform"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-lg">
                      <Image
                        src="/log.jpeg"
                        alt="Wasturwan Travels"
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold">Wasturwan</h3>
                      <p className="text-xs text-blue-100">Travels</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                        className={cn(
                          "block px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                          pathname === item.href
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-slate-700 hover:bg-slate-100"
                        )}
                  >
                    {item.label}
                  </Link>
                    </motion.div>
                ))}
                </div>

                {/* Quick Actions */}
                <div className="p-4 pt-6 border-t border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
                    Quick Actions
                  </p>
                  
                  <a
                    href="tel:+917006594976"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button className="w-full py-3.5 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 text-black border border-slate-300 hover:from-slate-300 hover:to-slate-200 shadow-md flex gap-2 justify-center items-center">
                      <Phone className="w-4 h-4" />
                      Call Us
                    </Button>
                  </a>

                  <a
                    href="https://wa.me/917006594976"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex gap-2 justify-center items-center">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>

                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button className="w-full py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      Book Your Trip
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
