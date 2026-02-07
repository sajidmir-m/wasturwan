"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  main_image_url: string | null
  featured: boolean
}

const STATIC_FEATURED: Package[] = [
  {
    id: "kashmir-winter-wonderland",
    title: "Kashmir Winter Wonderland",
    location: "Srinagar, Gulmarg, Pahalgam",
    category: "Family / Honeymoon",
    price: 24999,
    days: 5,
    nights: 4,
    duration: "5D / 4N",
    description:
      "Snow-clad valleys, Dal Lake sunsets and Gulmarg adventures in one curated winter package.",
    main_image_url: null,
    featured: true,
  },
  {
    id: "gulmarg-adventure-escape",
    title: "Gulmarg Adventure Escape",
    location: "Gulmarg",
    category: "Adventure",
    price: 15999,
    days: 3,
    nights: 2,
    duration: "3D / 2N",
    description:
      "Short and sweet high-altitude escape to Gulmarg with Gondola (optional) and snow activities in season.",
    main_image_url: null,
    featured: true,
  },
  {
    id: "classic-kashmir",
    title: "Classic Kashmir Tour",
    location: "Srinagar, Gulmarg, Pahalgam, Sonamarg",
    category: "Family",
    price: 28999,
    days: 6,
    nights: 5,
    duration: "6D / 5N",
    description:
      "Most-loved Kashmir circuit covering lakes, meadows and valleys with private cab and comfortable stays.",
    main_image_url: null,
    featured: true,
  },
]

export default function FeaturedPackages() {
  const packages = STATIC_FEATURED

  if (packages.length === 0) return null

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">
              Featured Packages
            </h2>
            <p className="text-slate-600 mt-1">
              Handpicked journeys that guests love the most.
            </p>
          </div>
          <Link href="/packages">
            <Button variant="outline" className="rounded-full">
              View All Packages
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className="h-full border-slate-200/70 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {pkg.title}
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {pkg.location && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">
                        {pkg.location}
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
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {pkg.description}
                    </p>
                  )}
                  <div className="flex items-baseline justify-between mt-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">
                        Starting from
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <p>
                        {pkg.days}D / {pkg.nights}N
                      </p>
                    </div>
                  </div>
                  <Link href={`/book?packageId=${pkg.id}`}>
                    <Button size="sm" className="w-full rounded-full mt-2">
                      Enquire Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
