"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, Loader2, CheckCircle, CalendarDays, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"
import { createBooking } from "@/lib/actions/bookings"
import { getJourneys } from "@/lib/actions/journeys"

export default function BookPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [packages, setPackages] = useState<{ id: string; title: string }[]>([])
  const [formLoading, setFormLoading] = useState(true)
  const [selectedPackageId, setSelectedPackageId] = useState("")

  useEffect(() => {
    const loadPackages = async () => {
      const { data } = await getJourneys()
      if (data) {
        setPackages(
          data
            .filter((p: any) => p.status === "active")
            .map((p: any) => ({ id: p.id, title: p.title }))
        )
      }
      setFormLoading(false)
    }
    loadPackages()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
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

    const messageLines: string[] = []
    if (selectedPackageLabel) messageLines.push(`Preferred package: ${selectedPackageLabel}`)
    if (travelDate) messageLines.push(`Travel date: ${travelDate}`)
    messageLines.push(baseMessage)

    const { error: actionError } = await createBooking({
      packageId: currentPackageId || null,
      packageLabel: selectedPackageLabel || null,
      name,
      email,
      phone,
      date: travelDate || new Date().toISOString().slice(0, 10),
      persons: isNaN(persons) || persons <= 0 ? 1 : persons,
      message: messageLines.join("\n\n").trim(),
    })

    if (actionError) {
      setError(actionError)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      form.reset()
      setTimeout(() => setSuccess(false), 5000)
    }
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
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Booking request sent! We'll get back to you soon.</span>
            </div>
          )}
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
                    Loading packages...
                  </div>
                ) : (
                  <select
                    name="packageId"
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg h-14 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Booking Request
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}


