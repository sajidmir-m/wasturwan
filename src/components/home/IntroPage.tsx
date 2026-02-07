"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { MapPin, ArrowRight, Sparkles, Compass } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Place = {
  name: string
  region: string
  image: string
  description: string
}

const STATIC_PLACES: Place[] = [
  {
    name: "Srinagar",
    region: "Kashmir Valley",
    image: "/dal.png",
    description: "Shikara rides on Dal Lake, Mughal gardens, and heritage.",
  },
  {
    name: "Gulmarg",
    region: "Kashmir Valley",
    image: "/1767803609020.jpeg",
    description: "Snow-clad meadows, Gondola rides, and skiing.",
  },
  {
    name: "Pahalgam",
    region: "Kashmir Valley",
    image: "/1767803600176.jpeg",
    description: "Riverside valleys, Betaab Valley, and pony trails.",
  },
  {
    name: "Sonamarg",
    region: "Kashmir Valley",
    image: "/1767803650229.jpeg",
    description: "Golden meadows, glaciers, and trekking routes.",
  },
]

export default function IntroPage() {
  const router = useRouter()
  const [places, setPlaces] = useState<Place[]>(STATIC_PLACES)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const loadPlaces = async () => {
      if (isLoading) return
      setIsLoading(true)
      
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("places")
          .select("name, region, hero_image_url, short_description, status")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(4)

        if (error) throw error

        if (mounted && data && data.length > 0) {
          const mapped: Place[] = data.map((p) => ({
            name: p.name,
            region: p.region || "Kashmir Valley",
            image: p.hero_image_url || STATIC_PLACES[0].image,
            description: p.short_description?.substring(0, 60) + "..." || "Explore this beautiful destination.",
          }))
          setPlaces(mapped)
        }
      } catch (err) {
        console.error("Error loading places from Supabase", err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadPlaces()
    
    return () => {
      mounted = false
    }
  }, [])

  const containerVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }), [])

  const itemVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }), [])

  const handlePlaceClick = useCallback((placeName: string) => {
    router.push(`/places/${encodeURIComponent(placeName)}/activities`)
  }, [router])

  // Memoize places to prevent unnecessary re-renders
  const memoizedPlaces = useMemo(() => places, [places])

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-y-auto">
      {/* Animated Background Elements - Optimized with CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-white shadow-2xl border-2 border-white/20">
                  <Image
                    src="/log.jpeg"
                    alt="Wasturwan Travels"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
                    Wasturwan
                  </h1>
                  <p className="text-xl text-blue-300 font-medium">Travels</p>
                </div>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span className="text-blue-200 tracking-[0.15em] uppercase text-xs font-bold">
                  Your Journey Begins Here
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                Discover the Magic of
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Jammu & Kashmir
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Curated travel experiences across Kashmir Valley, Jammu, and Ladakh. 
                From serene lakes to snow-capped peaks, let us craft your perfect escape.
              </p>
            </motion.div>

            {/* Explore Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/home"
                onClick={() => {
                  // Clear the intro flag so user can see intro again if they clear sessionStorage
                  sessionStorage.setItem("hasVisited", "true")
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 group"
              >
                Explore Wasturwan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Places Cards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 sm:px-6 lg:px-8 pb-12"
        >
          <motion.div
            variants={itemVariants}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                Popular Destinations
              </h3>
              <p className="text-slate-400">Explore our most loved places</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {memoizedPlaces.map((place, index) => (
                <motion.div
                  key={`${place.name}-${index}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer will-change-transform"
                  onClick={() => handlePlaceClick(place.name)}
                >
                  <div className="relative h-32 md:h-40">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{place.region}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 md:p-3">
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                      {place.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-300 group-hover:text-blue-200 transition-colors">
                      <span>Explore</span>
                      <Compass className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

