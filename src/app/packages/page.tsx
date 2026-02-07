"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

type Package = {
  id: string
  title: string
  location: string | null
  category: string | null
  price: number
  days: number
  nights: number
  duration: string | null
  description: string | null
  image: string
  featured?: boolean
}

const FALLBACK_IMAGES: Record<string, string> = {
  "Kashmir Winter Wonderland": "/1767803609020.jpeg",
  "Gulmarg Adventure Escape": "/1767803600176.jpeg",
  "Classic Kashmir Tour": "/1767803650229.jpeg",
  "Honeymoon Special Kashmir": "/dal.png",
  "Gurez Valley Expedition": "/1767803728726.jpeg",
  "Quick Kashmir Getaway": "/1767803735796.jpeg",
  "Kashmir & Ladakh Combo": "/Lehladakh.jpeg",
}

export default function PackagesPage() {
  const searchParams = useSearchParams()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const filterPlace = searchParams.get("place")

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const supabase = createClient()
        let query = supabase
          .from("packages")
          .select(
            "id, title, location, category, price, days, nights, duration, description, main_image_url, featured",
          )
          .eq("status", "active")

        // Filter by place if provided
        if (filterPlace) {
          // Check if location contains the place name (case-insensitive)
          query = query.ilike("location", `%${filterPlace}%`)
        }

        const { data, error } = await query
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) throw error

        const mapped: Package[] =
          data?.map((p) => ({
            id: p.id,
            title: p.title,
            location: p.location,
            category: p.category,
            price: Number(p.price || 0),
            days: p.days,
            nights: p.nights,
            duration: p.duration,
            description: p.description,
            image:
              p.main_image_url ||
              FALLBACK_IMAGES[p.title] ||
              "/1767803609020.jpeg",
            featured: p.featured,
          })) || []

        setPackages(mapped)
      } catch (err) {
        console.error("Error loading packages from Supabase", err)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [filterPlace])

  const list = packages

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-3">
            {filterPlace ? `Tour Packages for ${filterPlace}` : "Tour Packages"}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {filterPlace 
              ? `Curated journeys in ${filterPlace}. All packages are fully customisable as per your dates and budget.`
              : "Curated journeys across Kashmir, Jammu and Ladakh. All packages are fully customisable as per your dates and budget."}
          </p>
          {filterPlace && (
            <div className="mt-4">
              <a
                href="/packages"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                View all packages
              </a>
            </div>
          )}
        </motion.div>

        {loading && list.length === 0 && (
          <p className="text-center text-slate-500">Loading packages…</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="h-full overflow-hidden border-slate-200/70 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white">
                <div className="relative h-48 w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={index < 2}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                    <span className="font-medium line-clamp-1">{pkg.location}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
                      {pkg.duration}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {pkg.title}
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                    {pkg.location && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">
                        {pkg.location}
                      </span>
                    )}
                    {pkg.category && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {pkg.category}
                      </span>
                    )}
                    {pkg.duration && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {pkg.duration}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pkg.description && (
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {pkg.description}
                    </p>
                  )}
                  <div className="flex items-baseline justify-between mt-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Starting from
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>
                        {pkg.days} Days / {pkg.nights} Nights
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 flex flex-wrap gap-2">
                    <Link href={`/packages/${pkg.id}`}>
                      <Button size="sm" className="rounded-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/book?packageId=${pkg.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
