"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Sparkles } from "lucide-react"

const places = [
  { 
    name: "Srinagar", 
    region: "Kashmir Valley", 
    image: "/dallake.png",
    description: "Shikara rides on Dal Lake, Mughal gardens, and the heritage of old Srinagar city."
  },
  { 
    name: "Gulmarg", 
    region: "Kashmir Valley", 
    image: "/1767803609020.jpeg",
    description: "Snow-clad meadows, Gulmarg Gondola, skiing in winter and lush green walks in summer."
  },
  { 
    name: "Pahalgam", 
    region: "Kashmir Valley", 
    image: "/1767803600176.jpeg",
    description: "Riverside valleys, Betaab Valley, Aru, and scenic pony trails loved by families."
  },
  { 
    name: "Sonamarg", 
    region: "Kashmir Valley", 
    image: "/1767803650229.jpeg",
    description: "Golden meadows, glacier views, and the gateway towards Ladakh."
  },
  { 
    name: "Doodhpathri", 
    region: "Kashmir Valley", 
    image: "/1767803735796.jpeg",
    description: "Offbeat green meadows and crystal-clear streams, perfect for peaceful day trips."
  },
  { 
    name: "Yusmarg", 
    region: "Kashmir Valley", 
    image: "/1767803751161.jpeg",
    description: "Pine forests, rolling meadows, and quiet treks away from the crowds."
  },
  { 
    name: "Gurez Valley", 
    region: "Kashmir Valley", 
    image: "/1767803728726.jpeg",
    description: "Remote border valley, wooden villages, and stunning views of Habba Khatoon peak."
  },
  { 
    name: "Kupwara & Bangus", 
    region: "Kashmir Valley", 
    image: "/1767803439961.jpeg",
    description: "Untouched meadows and forests, ideal for nature lovers and photographers."
  },
  { 
    name: "Pulwama & Aharbal", 
    region: "Kashmir Valley", 
    image: "/1767803580261.jpeg",
    description: "The famous Aharbal waterfall and scenic countryside drives."
  },
  { 
    name: "Anantnag & Verinag", 
    region: "Kashmir Valley", 
    image: "/1767803583853.jpeg",
    description: "Ancient springs, gardens and the starting point of the Jhelum river."
  },
  { 
    name: "Ladakh", 
    region: "Union Territory of Ladakh", 
    image: "/Lehladakh.jpeg",
    description: "High-altitude deserts, monasteries, and dramatic landscapes across the region."
  },
  { 
    name: "Leh", 
    region: "Union Territory of Ladakh", 
    image: "/Leh.jpeg",
    description: "Leh town, Shanti Stupa, local markets and nearby monasteries like Thiksey and Hemis."
  },
  { 
    name: "Kargil", 
    region: "Union Territory of Ladakh", 
    image: "/Ladakh.jpeg",
    description: "Historic mountain routes, war memorials, and a blend of cultures on the highway."
  },
  { 
    name: "Jammu", 
    region: "Jammu Region", 
    image: "/1767803335038.jpeg",
    description: "The winter capital, temples, and a base for exploring the wider Jammu region."
  },
  { 
    name: "Patnitop", 
    region: "Jammu Region", 
    image: "/1767803345571.jpeg",
    description: "Hill station with pine forests, viewpoints and snow in winter months."
  },
  { 
    name: "Katra & Vaishno Devi", 
    region: "Jammu Region", 
    image: "/1767803358391.jpeg",
    description: "Spiritual journey to Mata Vaishno Devi shrine with comfortable stay options."
  },
]

export default function PlacesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Jammu &amp; Kashmir Places
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
            Discover Jammu &amp; Kashmir
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore the must-visit destinations across Kashmir Valley, Jammu region, and Ladakh with Wasturwan Travels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place, index) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200/60 group flex flex-col"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {place.name}
                  </h3>
                  <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {place.region}
                  </p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-slate-600 mb-4 flex-1">
                  {place.description}
                </p>
                <Link
                  href={`/packages?place=${encodeURIComponent(place.name)}`}
                  className="inline-flex items-center justify-center text-sm font-semibold text-blue-700 hover:text-blue-800 mt-2"
                >
                  View packages for {place.name}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

