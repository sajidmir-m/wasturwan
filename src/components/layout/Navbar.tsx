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
  { href: "/", label: "Home" },
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
          scrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300",
            scrolled
              ? "bg-white/95 py-2.5 px-5 border-slate-200/60"
              : "bg-white/70 py-3.5 px-7 border-slate-200/40"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-serif font-bold">
                    Wasturwan<span className="text-blue-600"> Travels</span>
                  </span>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-6 border-t space-y-3">
                  {/* Mobile Call – Silver */}
                  <a href="tel:+917006594976">
                    <Button className="w-full py-3 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 text-black border border-slate-300 hover:from-slate-300 hover:to-slate-200 shadow-lg flex gap-2 justify-center">
                      <Phone className="w-4 h-4" />
                      Call Us
                    </Button>
                  </a>

                  <a
                    href="https://wa.me/917006594976"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex gap-2 justify-center">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>

                  {/* Mobile Book – Silver */}
                  <Link href="/book">
                    <Button className="w-full py-4 text-lg rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 text-black border border-slate-300 hover:from-slate-300 hover:to-slate-200 shadow-lg">
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
