"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-12 rounded-t-[4rem] mt-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-lg border border-white/20">
                <Image
                  src="/log.jpeg"
                  alt="Wasturwan Travels"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <span className="text-3xl font-serif font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                Wasturwan<span className="text-blue-400"> Travels</span>
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed max-w-sm text-base">
              Wasturwan Travels - your Kashmir tourism specialist. Your journey begins here, with curated experiences across Jammu &amp; Kashmir.
            </p>
            <div className="flex space-x-3">
              <Link 
                href="https://www.instagram.com/wasturwan_travels_?igsh=emJzNnY1YmNlY3F3" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 border border-white/10"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.facebook.com/share/1CEFBaqrvr/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 border border-white/10"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://wa.me/917006594976" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 border border-white/10"
              >
                <Phone className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6 font-serif text-white">Discover</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Journeys
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Travel Journal
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6 font-serif text-white">Destinations</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/places?place=Srinagar" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Srinagar
                </Link>
              </li>
              <li>
                <Link href="/places?place=Gulmarg" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Gulmarg
                </Link>
              </li>
              <li>
                <Link href="/places?place=Pahalgam" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Pahalgam
                </Link>
              </li>
              <li>
                <Link href="/places?place=Sonamarg" className="text-slate-300 hover:text-blue-400 transition-colors text-base">
                  Sonamarg
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 font-serif text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-base leading-relaxed">
                  Wasturwan Travels<br />
                  Ground Floor, Pahal Brein<br />
                  Nishat Road, Srinagar, J&amp;K<br />
                  PIN: 191121
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base">+91 70065 94976</span>
                  <span className="text-base">+91 70061 92778</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-base">wasturwantravels@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Wasturwan Travels. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
