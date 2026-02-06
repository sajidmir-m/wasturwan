"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BookingForm from "@/components/packages/BookingForm"
import { createClient } from "@/lib/supabase/client"

type ItineraryDay = {
  day: number
  title: string
  description: string
}

type PackageDetail = {
  id: string
  title: string
  location: string | null
  duration: string | null
  days: number
  nights: number
  price: number
  heroImage: string
  shortDescription: string | null
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
}

const FALLBACK_DETAILS: PackageDetail[] = [
  {
    id: "kashmir-winter-wonderland",
    title: "Kashmir Winter Wonderland",
    location: "Srinagar, Gulmarg, Pahalgam",
    duration: "5D / 4N",
    days: 5,
    nights: 4,
    price: 24999,
    heroImage: "/1767803609020.jpeg",
    shortDescription:
      "Snow-clad valleys, Dal Lake sunsets and Gulmarg adventures in one curated winter package ideal for families and couples.",
    itinerary: [
      {
        day: 1,
        title: "Arrival Srinagar & Dal Lake",
        description: "Airport pickup, check-in to hotel/houseboat and evening shikara ride on Dal Lake.",
      },
      {
        day: 2,
        title: "Full Day Gulmarg",
        description: "Drive to Gulmarg, enjoy meadows / snow (seasonal) and optional Gondola cable car.",
      },
      {
        day: 3,
        title: "Pahalgam Valley",
        description: "Scenic drive to Pahalgam, riverside walks and optional visit to Betaab / Aru valleys.",
      },
      {
        day: 4,
        title: "Srinagar City Tour",
        description: "Visit Mughal gardens, old city markets and local handicraft showrooms.",
      },
      {
        day: 5,
        title: "Departure",
        description: "Free time for last‑minute shopping followed by airport drop.",
      },
    ],
    inclusions: [
      "Private cab for entire tour as per itinerary",
      "Comfortable accommodation in Srinagar, Gulmarg / Pahalgam (as per plan)",
      "Daily breakfast",
      "Airport pickup and drop",
      "Driver allowances, tolls and parking",
    ],
    exclusions: [
      "Air / train tickets",
      "Lunch, dinner and personal expenses",
      "Gondola tickets, pony rides and activities",
      "Entry tickets to monuments and parks",
    ],
  },
  {
    id: "gulmarg-adventure-escape",
    title: "Gulmarg Adventure Escape",
    location: "Gulmarg",
    duration: "3D / 2N",
    days: 3,
    nights: 2,
    price: 15999,
    heroImage: "/1767803600176.jpeg",
    shortDescription:
      "Short and sweet escape to Gulmarg focused on meadows, snow views and the famous Gondola ride.",
    itinerary: [
      {
        day: 1,
        title: "Arrival Srinagar – Transfer to Gulmarg",
        description: "Pickup from airport / hotel and transfer to Gulmarg. Evening at leisure.",
      },
      {
        day: 2,
        title: "Gulmarg Exploration",
        description:
          "Full day to explore Gulmarg, optional Gondola ride and snow activities (in winter) or meadows (in summer).",
      },
      {
        day: 3,
        title: "Departure",
        description: "Drive back to Srinagar airport / hotel for onward journey.",
      },
    ],
    inclusions: [
      "Private cab Srinagar–Gulmarg–Srinagar",
      "Accommodation in Gulmarg",
      "Breakfast at hotel",
    ],
    exclusions: [
      "Gondola tickets",
      "Lunch and dinner",
      "Guide charges and activities",
    ],
  },
  {
    id: "classic-kashmir",
    title: "Classic Kashmir Tour",
    location: "Srinagar, Gulmarg, Pahalgam, Sonamarg",
    duration: "6D / 5N",
    days: 6,
    nights: 5,
    price: 28999,
    heroImage: "/1767803650229.jpeg",
    shortDescription:
      "Most-loved Kashmir circuit covering Dal Lake, Gulmarg meadows, Pahalgam valleys and Sonamarg day trip.",
    itinerary: [
      { day: 1, title: "Arrival Srinagar & Dal Lake", description: "Airport pickup and shikara ride." },
      { day: 2, title: "Gulmarg Day Trip", description: "Full day Gulmarg sightseeing and optional Gondola." },
      { day: 3, title: "Pahalgam Transfer", description: "Drive to Pahalgam via saffron fields and Awantipora ruins." },
      { day: 4, title: "Pahalgam Valleys", description: "Explore Betaab / Aru / Chandanwari (as per season and choice)." },
      { day: 5, title: "Sonamarg Day Trip", description: "Drive to Sonamarg and return to Srinagar by evening." },
      { day: 6, title: "Departure", description: "Free time and airport drop." },
    ],
    inclusions: [
      "Private cab for entire tour",
      "Accommodation in Srinagar & Pahalgam",
      "Breakfast at hotel",
      "Airport transfers",
    ],
    exclusions: [
      "All activities like Gondola / pony rides",
      "Lunch and dinner",
      "Entry tickets and local union cabs",
    ],
  },
  {
    id: "honeymoon-special",
    title: "Honeymoon Special Kashmir",
    location: "Srinagar, Gulmarg, Pahalgam",
    duration: "6D / 5N",
    days: 6,
    nights: 5,
    price: 31999,
    heroImage: "/dal.png",
    shortDescription:
      "Romantic houseboat night, private cab and relaxed pace itinerary crafted specially for couples.",
    itinerary: [
      { day: 1, title: "Arrival & Houseboat", description: "Check-in to houseboat and evening shikara ride." },
      { day: 2, title: "Srinagar City & Gardens", description: "Visit Mughal gardens and old city." },
      { day: 3, title: "Gulmarg Day Trip", description: "Day excursion to Gulmarg and back." },
      { day: 4, title: "Pahalgam Transfer", description: "Drive to Pahalgam, evening at leisure." },
      { day: 5, title: "Pahalgam & Valleys", description: "Explore nearby valleys or relax by the river." },
      { day: 6, title: "Departure", description: "Return to Srinagar airport." },
    ],
    inclusions: [
      "One night in Srinagar houseboat",
      "Candle light decor in room (once)",
      "Private cab for sightseeing",
      "Breakfast and one special dinner",
    ],
    exclusions: [
      "Flights",
      "Gondola / activities",
      "Extra meals and personal expenses",
    ],
  },
]

export default function PackageDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [pkg, setPkg] = useState<PackageDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("packages")
          .select(
            "id, title, location, duration, days, nights, price, main_image_url, description, itinerary, inclusions, exclusions, status",
          )
          .eq("id", params.id)
          .maybeSingle()

        if (error) throw error

        if (!data) {
          const fallback = FALLBACK_DETAILS.find((p) => p.id === params.id)
          setPkg(fallback || null)
        } else {
          setPkg({
            id: data.id,
            title: data.title,
            location: data.location,
            duration: data.duration,
            days: data.days,
            nights: data.nights,
            price: Number(data.price || 0),
            heroImage:
              data.main_image_url ||
              FALLBACK_DETAILS.find((p) => p.title === data.title)?.heroImage ||
              "/1767803609020.jpeg",
            shortDescription:
              data.description ||
              "A curated journey in Kashmir designed by Wasturwan Travels.",
            itinerary:
              ((data.itinerary as any[]) || []).map((d: any, i: number) => ({
                day: d.day ?? i + 1,
                title: d.title ?? `Day ${i + 1}`,
                description: d.desc ?? d.description ?? "",
              })) || [],
            inclusions: (data.inclusions as string[]) || [],
            exclusions: (data.exclusions as string[]) || [],
          })
        }
      } catch (err) {
        console.error("Error loading package detail from Supabase", err)
        const fallback = FALLBACK_DETAILS.find((p) => p.id === params.id)
        setPkg(fallback || null)
      } finally {
        setLoading(false)
      }
    }

    loadPackage()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading package...</p>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Package not found</p>
          <h1 className="text-3xl font-serif font-bold text-slate-900">This package is not available</h1>
          <Button className="mt-4" onClick={() => router.push("/packages")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />
        <div className="absolute inset-x-0 top-6 md:top-10 flex justify-center px-4">
          <div className="max-w-6xl w-full flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 bg-black/30 text-white backdrop-blur-sm"
              onClick={() => router.push("/packages")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase">
                <MapPin className="w-3 h-3" />
                {pkg.location}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-100/80">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ideal for couples & families
                </span>
                <span className="inline-flex items-center gap-2 font-semibold">
                  From
                  <span className="text-emerald-300">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-200/80">per person</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-50 text-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-10 lg:gap-12">
          {/* Left column */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-md border border-slate-200/70 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3">
                Trip Overview
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {pkg.shortDescription}
              </p>
            </section>

            <section className="bg-white rounded-3xl shadow-md border border-slate-200/70 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-5">
                Day-wise Itinerary
              </h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                        Day {day.day}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {day.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-3xl shadow-md border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Inclusions
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-3xl shadow-md border border-rose-100 p-6">
                <h3 className="text-lg font-semibold text-rose-900 mb-3">
                  Exclusions
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-blue-50 border border-blue-100 rounded-3xl p-5 md:p-6">
              <p className="text-sm text-blue-900">
                Need a customised version of this itinerary?{" "}
                <Link href="/contact" className="font-semibold underline">
                  Send us your dates and requirements
                </Link>{" "}
                and our team will tailor this package for you.
              </p>
            </section>
          </div>

          {/* Right column: booking */}
          <div className="lg:pt-4">
            <BookingForm packageId={pkg.id} packageTitle={pkg.title} price={pkg.price} />
          </div>
        </div>
      </div>
    </div>
  )
}


