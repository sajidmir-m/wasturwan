"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Star, Sparkles, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getJourneys } from "@/lib/actions/journeys"

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedPackages()
  }, [])

  const loadFeaturedPackages = async () => {
    setLoading(true)
    const { data, error } = await getJourneys()
    if (data) {
      // Get only featured and active packages, limit to 4
      const featured = data
        .filter((pkg: any) => pkg.featured === true && pkg.status === 'active')
        .slice(0, 4)
      setPackages(featured)
    } else {
      console.error("Failed to load featured packages:", error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <section className="py-28 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    )
  }

  if (packages.length === 0) {
    return null // Don't show section if no featured packages
  }
  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
                Curated Experiences
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight"
            >
              Journeys designed for the soul.
            </motion.h2>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory hide-scrollbar">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[280px] md:min-w-[340px] lg:min-w-[360px] snap-start"
              >
                <Link href={`/packages/${pkg.id}`} className="group block">
                  <div className="relative h-[430px] w-full overflow-hidden rounded-3xl shadow-xl border border-slate-200/50 group-hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={pkg.image || pkg.main_image_url || "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop"}
                      alt={pkg.title || "Package"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                    
                    {pkg.category && (
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full border border-white/50 shadow-lg">
                          {pkg.category}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs mb-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{pkg.days} Days / {pkg.nights} Nights</span>
                        </div>
                        {pkg.rating && (
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{pkg.rating}</span>
                          </div>
                        )}
                        {pkg.location && (
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.location
                              .split(",")
                              .map((tag: string) => tag.trim())
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 rounded-full bg-white/15 text-[10px] font-medium uppercase tracking-wide"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-snug">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <div>
                          <p className="text-white/80 text-sm font-medium">Starting from</p>
                          <p className="text-white text-2xl font-bold">₹{Number(pkg.price).toLocaleString()}</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
