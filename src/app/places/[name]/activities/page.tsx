"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Mountain, Ship, Compass, TreePine, MapPin, Sparkles } from "lucide-react"

type Activity = {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const PLACE_ACTIVITIES: Record<string, Activity[]> = {
  "Srinagar": [
    { title: "Shikara Ride on Dal Lake", description: "Glide across the serene waters in traditional wooden boats. Experience the tranquility of Dal Lake as you float past floating gardens, houseboats, and the stunning backdrop of snow-capped mountains.", icon: Ship },
    { title: "Mughal Gardens Tour", description: "Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi - three of the most beautiful Mughal gardens in Kashmir. Marvel at the terraced gardens, fountains, and panoramic views of Dal Lake.", icon: TreePine },
    { title: "Houseboat Stay", description: "Experience overnight stays in heritage houseboats on Dal Lake. Wake up to misty mornings, enjoy Kashmiri hospitality, and watch the sunset from your floating home.", icon: Ship },
    { title: "Old City Heritage Walk", description: "Explore the historic lanes and markets of old Srinagar. Visit Jamia Masjid, walk through traditional bazaars, and discover the rich cultural heritage of the city.", icon: Compass },
    { title: "Sunset Photography", description: "Capture stunning sunsets over Dal Lake and mountains. The golden hour transforms the entire landscape into a photographer's paradise with perfect lighting.", icon: Camera },
  ],
  "Gulmarg": [
    { title: "Gulmarg Gondola Ride", description: "Asia's highest cable car with panoramic mountain views. Ride in two phases to reach 3,980 meters, offering breathtaking views of snow-covered peaks and valleys below.", icon: Mountain },
    { title: "Skiing & Snow Sports", description: "Winter skiing, snowboarding, and snow play activities. Gulmarg offers world-class slopes for beginners and experts, with equipment rental and professional instructors available.", icon: Mountain },
    { title: "Golf Course", description: "World's highest 18-hole golf course in summer. Play golf at 2,650 meters above sea level with stunning mountain views as your backdrop.", icon: Compass },
    { title: "Meadow Walks", description: "Scenic walks through flower-filled meadows in summer. The valley transforms into a carpet of wildflowers, perfect for leisurely strolls and picnics.", icon: TreePine },
    { title: "Alpather Lake Trek", description: "Day trek to the frozen lake surrounded by snow peaks. A moderate 3-hour trek that rewards you with stunning views of a frozen alpine lake.", icon: Mountain },
  ],
  "Pahalgam": [
    { title: "Betaab Valley", description: "Picturesque valley named after the Bollywood movie Betaab. Surrounded by pine forests and snow-capped mountains, this valley offers perfect spots for photography and relaxation.", icon: Camera },
    { title: "Aru Valley", description: "Scenic valley perfect for trekking and pony rides. Located 12 km from Pahalgam, this pristine valley is the starting point for many high-altitude treks.", icon: Mountain },
    { title: "Lidder River Rafting", description: "Adventure rafting on the pristine Lidder River. Experience the thrill of white-water rafting through beautiful landscapes with professional guides.", icon: Ship },
    { title: "Pony Rides", description: "Traditional pony rides to scenic viewpoints. Explore the valleys and meadows on horseback, a traditional way to experience the beauty of Pahalgam.", icon: Compass },
    { title: "Chandanwari", description: "Snow point and starting point for Amarnath Yatra. Located 16 km from Pahalgam, this is a popular spot for snow activities and scenic views.", icon: Mountain },
  ],
  "Sonamarg": [
    { title: "Thajiwas Glacier", description: "Beautiful glacier accessible by short trek or pony ride. Walk on the glacier, enjoy snow activities, and witness the stunning ice formations up close.", icon: Mountain },
    { title: "Zero Point", description: "Scenic point with snow-covered landscapes year-round. A perfect spot for photography and experiencing the raw beauty of the Himalayas.", icon: Camera },
    { title: "Krishnasar Lake", description: "High-altitude alpine lake with crystal clear waters. A challenging trek that rewards you with one of the most beautiful lakes in Kashmir.", icon: Ship },
    { title: "Meadow Camping", description: "Camping under the stars in golden meadows. Experience the tranquility of Sonamarg with overnight camping, bonfires, and stargazing.", icon: TreePine },
    { title: "Trekking Routes", description: "Gateway to various trekking routes including Kashmir Great Lakes. Sonamarg is the starting point for some of the most spectacular treks in the region.", icon: Compass },
  ],
  "Gurez": [
    { title: "Kishanganga River", description: "Scenic river views and fishing opportunities. The pristine river flows through the valley, offering peaceful spots for relaxation and fishing.", icon: Ship },
    { title: "Habba Khatoon Peak", description: "Trek to the peak named after the famous Kashmiri poet. A moderate trek offering panoramic views of the entire Gurez Valley and surrounding mountains.", icon: Mountain },
    { title: "Dawar Village", description: "Main village with traditional architecture and culture. Experience the unique culture of the Dard-Shina people, their traditional houses, and local cuisine.", icon: Compass },
    { title: "Tulail Valley", description: "Remote valley with pristine natural beauty. Explore untouched landscapes, alpine meadows, and experience true wilderness away from crowds.", icon: Camera },
    { title: "Wildlife Spotting", description: "Chance to see Himalayan wildlife and rare birds. Gurez is home to various species including brown bears, snow leopards, and numerous bird species.", icon: TreePine },
  ],
}

const PLACE_IMAGES: Record<string, string> = {
  "Srinagar": "/dal.png",
  "Gulmarg": "/1767803609020.jpeg",
  "Pahalgam": "/1767803600176.jpeg",
  "Sonamarg": "/1767803650229.jpeg",
  "Gurez": "/1767803728726.jpeg",
}

export default function ActivitiesPage() {
  const params = useParams()
  const router = useRouter()
  const placeName = decodeURIComponent(params.name as string)
  const activities = PLACE_ACTIVITIES[placeName] || []
  const placeImage = PLACE_IMAGES[placeName] || "/1767803609020.jpeg"

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  }), [])

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Place not found</h1>
          <Link href="/places" className="text-blue-600 hover:text-blue-700">
            Back to Places
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={placeImage}
            alt={placeName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto w-full"
          >
            <button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Places</span>
            </button>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 tracking-[0.15em] uppercase text-xs font-bold">
                Activities & Experiences
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4">
              {placeName}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Discover amazing activities and experiences in {placeName}. From adventure sports to cultural tours, find your perfect way to explore this beautiful destination.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200/60 overflow-hidden transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <activity.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>
              
              {/* Decorative gradient bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Ready to Experience {placeName}?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Book your trip now and let us create a customized itinerary that includes your favorite activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/book?place=${encodeURIComponent(placeName)}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Book Your Trip
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300"
              >
                View Packages
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

