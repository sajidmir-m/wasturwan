"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, Search, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/places", label: "Places" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide navbar entirely on admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-3",
          scrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto rounded-2xl transition-all duration-300 backdrop-blur-xl border shadow-lg",
            scrolled
              ? "bg-white/95 py-2.5 px-5 border-slate-200/60"
              : "bg-white/70 py-3.5 px-7 border-slate-200/40"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo inside navbar panel - square icon + wordmark */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-2xl overflow-hidden bg-white shadow-lg group-hover:scale-105 transition-transform border border-slate-200">
                <Image
                  src="/log.jpeg"
                  alt="Wasturwan Travels"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <span className="hidden sm:inline-block text-base md:text-lg font-serif font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Wasturwan<span className="text-blue-600"> Travels</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs md:text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200 uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <a
                href="tel:+917006594976"
                className="hidden lg:inline-flex"
                aria-label="Call Wasturwan Travels at +91 7006594976"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white transition-all duration-300 px-3 h-9 text-xs md:text-sm flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </a>
              <a
                href="https://wa.me/917006594976"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp with Wasturwan Travels"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-300 px-3 h-9 text-xs md:text-sm flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>
              <Link href="/book">
                <Button 
                  className="rounded-full bg-slate-900 text-white hover:bg-blue-700 transition-all duration-300 px-5 h-10 text-xs md:text-sm shadow-md hover:shadow-lg hover:scale-105"
                >
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
          <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative w-10 h-10 overflow-hidden bg-white border border-slate-200">
                      <Image
                        src="/log.jpeg"
                        alt="Wasturwan Travels"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="text-xl font-serif font-bold text-slate-900">
                      Wasturwan<span className="text-blue-600"> Travels</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col p-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                    className="text-lg font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-3 rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
                <div className="pt-6 border-t border-slate-200 mt-4 space-y-3">
                  <a
                    href="tel:+917006594976"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full py-3 text-base rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Us
                    </Button>
                  </a>
                  <a
                    href="https://wa.me/917006594976"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full py-3 text-base rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <Link href="/book" onClick={() => setIsOpen(false)}>
                    <Button className="w-full py-4 text-lg rounded-xl bg-slate-900 hover:bg-blue-700 shadow-lg mt-1">
                      Plan Your Trip
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
