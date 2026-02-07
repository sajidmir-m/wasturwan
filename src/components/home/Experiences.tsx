"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Mountain, Ship, Compass, Sparkles } from "lucide-react"

const experiences = [
  {
    title: "Dal Lake Shikara Experience",
    description:
      "Glide across Dal Lake at sunrise, stay in heritage houseboats, and watch the mountains glow in golden light.",
    image: "/dal.png",
    place: "Srinagar",
  },
  {
    title: "Snow & Meadows of Gulmarg",
    description:
      "Ride the Gulmarg Gondola, try skiing and snow play in winter, or walk through flower-filled meadows in summer.",
    image: "/1767803609020.jpeg",
    place: "Gulmarg",
  },
  {
    title: "Pahalgam Family & Honeymoon Escape",
    description:
      "Riverside walks, pony rides to Betaab and Aru Valley, and cozy stays perfect for couples and families.",
    image: "/1767803600176.jpeg",
    place: "Pahalgam",
  },
  {
    title: "Adventure Trails & Treks",
    description:
      "Plan your adventures: skiing, trekking, rafting and paragliding across Sonamarg, Doodhpathri, Yusmarg and more.",
    image: "/1767803650229.jpeg",
    place: "Adventure",
  },
]

export default function Experiences() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-10 w-72 h-72 bg-blue-500/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-5">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 tracking-[0.15em] uppercase text-xs font-bold">
                Places & Experiences
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
              Live the Kashmir story,
              <br />
              not just the sightseeing.
            </h2>
            <p className="text-base md:text-lg text-slate-100/80 max-w-xl leading-relaxed">
              From the calm waters of Dal Lake to the adventure-filled slopes of Gulmarg and hidden valleys beyond,
              Wasturwan Travels curates experiences across Jammu &amp; Kashmir that match your style of travel.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-100/80">
            <p className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-blue-200" />
              Alpine meadows, snow adventures and offbeat valleys.
            </p>
            <p className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-blue-200" />
              Houseboats, shikaras and lakeside sunsets on Dal Lake.
            </p>
            <p className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-200" />
              Custom-made itineraries for families, couples and groups.
            </p>
            <div className="pt-2">
              <Link
                href="/places"
                className="inline-flex items-center text-sm font-semibold text-blue-200 hover:text-white transition-colors"
              >
                Explore all places in Jammu &amp; Kashmir
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-300/60 transition-all duration-150 flex flex-col will-change-transform"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <MapPin className="w-3 h-3" />
                    <span>{exp.place}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                  {exp.title}
                </h3>
                <p className="text-sm text-slate-100/80 flex-1 leading-relaxed">
                  {exp.description}
                </p>
                <Link
                  href={
                    exp.place === "Adventure"
                      ? "/packages?place=Gulmarg"
                      : `/packages?place=${encodeURIComponent(exp.place)}`
                  }
                  className="mt-4 inline-flex text-xs font-semibold text-blue-200 hover:text-white transition-colors"
                >
                  View packages for {exp.place === "Adventure" ? "adventures" : exp.place}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


