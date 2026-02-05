"use client"

import { Car, Users, Luggage, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cabGroups = [
  {
    key: "sedan",
    title: "Sedan Cabs",
    subtitle: "Perfect for 2–3 guests",
    description:
      "Comfortable sedans for airport transfers, Srinagar sightseeing and point‑to‑point travel across Kashmir.",
    cars: ["Swift Dzire", "Toyota Etios", "Honda Amaze"],
    tags: ["AC", "Point‑to‑point", "Budget friendly"],
    icon: Car,
  },
  {
    key: "innova",
    title: "Innova",
    subtitle: "Family comfort",
    description:
      "Spacious Innova for families and small groups who want extra legroom and luggage space on long drives.",
    cars: ["Toyota Innova"],
    tags: ["6–7 Seater", "AC", "Long routes"],
    icon: Users,
  },
  {
    key: "crysta",
    title: "Innova Crysta",
    subtitle: "Premium MPV",
    description:
      "Top‑end Crysta fleet for premium airport pickups, Gulmarg, Pahalgam and Sonamarg circuits.",
    cars: ["Innova Crysta"],
    tags: ["Premium", "Comfort", "Family trips"],
    icon: Luggage,
  },
  {
    key: "tempo",
    title: "Tempo Traveller",
    subtitle: "Groups & Incentives",
    description:
      "Tempo Travellers for groups, corporate movements and large family trips across Jammu & Kashmir.",
    cars: ["9/12/17 Seater Tempo Traveller"],
    tags: ["Group travel", "Sightseeing", "Multi‑day tours"],
    icon: Users,
  },
]

export default function CabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 text-xs font-semibold tracking-[0.18em] uppercase text-blue-700 mb-4">
            <Car className="w-4 h-4" />
            Wasturwan Cabs
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
            Private Cabs & Transfers
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sedans, Innovas, Crysta and Tempo Travellers for airport pickups and complete Kashmir
            itineraries. All cabs are neat, AC‑equipped and driven by experienced local drivers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cabGroups.map((group, index) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
            >
              <Card className="h-full rounded-3xl border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 mb-2">
                      <group.icon className="w-4 h-4" />
                      <span>{group.subtitle}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">{group.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{group.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Available models</p>
                    <ul className="flex flex-wrap gap-2">
                      {group.cars.map((car) => (
                        <li
                          key={car}
                          className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700"
                        >
                          {car}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Good for</p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl px-6 py-6 md:px-10 md:py-7">
          <div>
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-[0.18em] mb-1">
              Plan your cab
            </p>
            <h2 className="text-xl md:text-2xl font-serif font-semibold">
              Tell us your dates & routes, we’ll assign the right cab.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+917006594976">
              <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-5 h-11 text-sm font-semibold">
                Call to Book
              </Button>
            </a>
            <Link href="/book">
              <Button className="rounded-full bg-slate-900 text-white hover:bg-black px-5 h-11 text-sm font-semibold flex items-center gap-2">
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


