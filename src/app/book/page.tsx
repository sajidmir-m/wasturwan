"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, CalendarDays, MapPin, Users, Loader2, X } from "lucide-react"
import { motion } from "framer-motion"
import BookingSuccess from "@/components/packages/BookingSuccess"
import { createClient as createBrowserSupabase } from "@/lib/supabase/client"

export default function BookPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [packages, setPackages] = useState<{ id: string; title: string }[]>([])
  const [formLoading, setFormLoading] = useState(true)
  const [selectedPackageId, setSelectedPackageId] = useState("")
  const [bookingData, setBookingData] = useState<{
    name: string
    email: string
    phone: string
    date: string
    persons: number
    packageTitle?: string
    message?: string
  } | null>(null)

  const router = useRouter()

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data, error } = await supabase
          .from("packages")
          .select("id, title")
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (!error && data) {
          setPackages(data)
        }
      } catch (err) {
        console.error("Error loading packages for booking form", err)
      } finally {
        setFormLoading(false)
      }
    }

    loadPackages()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setError("")
    setSuccess(false)

    const formData = new FormData(form)
    const currentPackageId = formData.get("packageId") as string
    const selectedPackage = packages.find((p) => p.id === currentPackageId)
    const selectedPackageLabel = selectedPackage?.title || ""
    const travelDate = formData.get("date") as string
    const persons = Number(formData.get("persons") || 1)
    const baseMessage = (formData.get("message") as string) || ""

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    // Validate required fields
    if (!name || !email || !phone || !travelDate || !persons) {
      setError("Please fill in all required fields")
      return
    }

    try {
      // 1) Save booking in bookings table
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: travelDate || new Date().toISOString().slice(0, 10),
          persons: isNaN(persons) || persons <= 0 ? 1 : persons,
          packageId: currentPackageId || null,
          message: baseMessage || undefined,
        }),
      })

      // 2) Also create a contact entry so admin can see the enquiry
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: currentPackageId ? "Package booking enquiry" : "Custom booking enquiry",
          message:
            baseMessage ||
            `Booking enquiry for ${selectedPackageLabel || "custom itinerary"} on ${travelDate} for ${persons} person(s).`,
        }),
      })
    } catch (err) {
      console.error("Error creating booking/contact", err)
      setError("We could not save your booking right now. You can still send via WhatsApp or Email.")
    }

    // Store booking data for email/WhatsApp options
    setBookingData({
      name,
      email,
      phone,
      date: travelDate || new Date().toISOString().slice(0, 10),
      persons: isNaN(persons) || persons <= 0 ? 1 : persons,
      packageTitle: selectedPackageLabel || undefined,
      message: baseMessage || undefined
    })
    
    setSuccess(true)
    // Don't reset form - let user see their data before sending
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Book Your Journey
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
            Booking Form
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Share your travel dates, group size and preferred destinations. Our team will get back
            to you with a tailored itinerary and best available prices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/50"
        >
          <h3 className="text-2xl font-bold mb-8 text-slate-900 text-left">Tell us about your trip</h3>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Name *</label>
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone *</label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Your phone / WhatsApp"
                  required
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Travel Date
                </label>
                <Input
                  name="date"
                  type="date"
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Travelers
                </label>
                <Input
                  name="persons"
                  type="number"
                  min={1}
                  defaultValue={2}
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Preferred Package
                </label>
                {formLoading ? (
                  <div className="h-12 rounded-xl border border-slate-200 px-3 flex items-center text-sm text-slate-400">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading packages...
                  </div>
                ) : packages.length > 0 ? (
                  <select
                    name="packageId"
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                  >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title}
                      </option>
                    ))}
                    <option value="">Custom itinerary / Not listed</option>
                  </select>
                ) : (
                  <select
                    name="packageId"
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                  >
                    <option value="">No packages available - Custom booking</option>
                    <option value="">Custom itinerary / Not listed</option>
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Trip Details *</label>
                <Textarea
                  name="message"
                  placeholder="No. of travelers, budget range and any special requirements..."
                  required
                  className="min-h-[120px] md:min-h-[140px] rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={success}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg h-14 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Send
            </Button>
          </form>
        </motion.div>
      </div>
      
      {/* Modal Popup for Email/WhatsApp Options */}
      {success && bookingData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Choose How to Send</h2>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setBookingData(null)
                    router.push("/")
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <BookingSuccess bookingData={bookingData} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}


