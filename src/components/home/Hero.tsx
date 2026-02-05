"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white tracking-[0.15em] uppercase text-xs font-bold">
                Discover the Paradise
              </span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] drop-shadow-2xl">
                Kashmir, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white italic font-normal">
                  Unveiled.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Experience the timeless beauty of the valley. From the serene Dal Lake to the snow-capped peaks of Gulmarg, let us curate your perfect escape.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages">
                <Button 
                  size="lg" 
                  className="group bg-white hover:bg-blue-600 text-slate-900 hover:text-white rounded-full px-8 py-7 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore Journeys 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-7 text-lg font-medium border-2 border-white/80 hover:border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                  Plan Your Trip
                </Button>
              </Link>
            </div>

            {/* Stats/Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 grid grid-cols-3 gap-8 border-t border-white/20"
            >
              <div>
                <p className="text-4xl font-serif font-bold text-white drop-shadow-lg">5k+</p>
                <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Happy Travelers</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-white drop-shadow-lg">50+</p>
                <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Destinations</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-white drop-shadow-lg">24/7</p>
                <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Support</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
