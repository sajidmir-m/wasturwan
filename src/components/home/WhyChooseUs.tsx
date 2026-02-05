"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Heart, Users, Sparkles, Mountain, Waves, MapPin, Instagram, Facebook } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Users,
    title: "Local Mountain Guides",
    description: "Travel with local experts who know every hidden meadow, ski slope and trekking trail across Jammu & Kashmir.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Mountain,
    title: "Adventure Planning",
    description: "From skiing in Gulmarg to treks around Sonamarg and Doodhpathri, we plan safe and exciting adventures end‑to‑end.",
    color: "from-slate-500 to-slate-600"
  },
  {
    icon: Waves,
    title: "Rafting & Outdoor Experiences",
    description: "Rafting, paragliding and outdoor activities arranged with trusted operators and proper safety gear.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Heart,
    title: "Custom Itineraries",
    description: "Build your own mix of Dal Lake stays, road trips, treks and spiritual routes with our tailor‑made itineraries.",
    color: "from-pink-500 to-pink-600"
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">
            Your Trusted Travel Partner
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We don't just sell tour packages; we craft unforgettable memories. Here is why travelers trust us.
          </p>
          {/* Social proof icons */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/wasturwan_travels_?igsh=emJzNnY1YmNlY3F3"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700 group-hover:text-pink-600 transition-colors">
                Follow us on Instagram
              </span>
            </a>
            <a
              href="https://www.facebook.com/share/1CEFBaqrvr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Facebook className="w-7 h-7 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                Connect on Facebook
              </span>
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature Experiences Cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center"
        >
          {[
            {
              key: "dal",
              title: "Houseboats, shikaras & starlit waters.",
              badge: "Dal Lake Nights",
              image: "/dal.png",
              description:
                "Sleep on traditional houseboats, wake up to misty mornings and glide under the stars on Dal Lake.",
            },
            {
              key: "gulmarg",
              title: "Ski slopes, snow trails & gondola views.",
              badge: "Gulmarg Adventure",
              image: "/1767803335038_1.jpeg",
              description:
                "Plan winter skiing or summer meadows in Gulmarg with lift passes and guides arranged end‑to‑end.",
            },
            {
              key: "sonamarg",
              title: "Golden meadows & glacier day trips.",
              badge: "Sonamarg Meadows",
              image: "/1767803650229.jpeg",
              description:
                "Ride through valleys of Sonamarg, walk to glaciers and spend your days between sunlit meadows and snow‑kissed peaks.",
            },
            {
              key: "gurez-ladakh",
              title: "Gurez valley to Ladakh high passes.",
              badge: "Gurez & Ladakh Trails",
              image: "/Lehladakh.jpeg",
              description:
                "Blend remote Gurez villages with Ladakh’s high‑altitude deserts for an unforgettable Himalayan circuit.",
            },
          ].map((card) => (
            <div
              key={card.key}
              className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-200/60 bg-slate-950 w-full sm:w-[320px] lg:w-[340px] mx-auto h-[380px] md:h-[420px] lg:h-[440px]"
            >
              <Image src={card.image} alt={card.badge} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
              <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-center h-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-2">
                  <MapPin className="w-3 h-3 text-blue-200" />
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-blue-50">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-serif font-semibold text-white mb-1">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-100/85 max-w-md">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
