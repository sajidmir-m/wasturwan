"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Sparkles, Send, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string) || ""
    const email = (formData.get('email') as string) || ""
    const phone = (formData.get('phone') as string) || ""
    const subject = (formData.get('subject') as string) || "Website Contact"
    const message = (formData.get('message') as string) || ""

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in required fields (name, email, message).")
      setLoading(false)
      return
    }

    // No backend: open user's email client (mailto) with prefilled message
    const emailTo = "wasturwantravels@gmail.com"
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    )}`

    window.location.href = mailtoUrl
    setSuccess(true)
    setLoading(false)
    e.currentTarget.reset()
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Get In Touch
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/50">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Get in Touch with Wasturwan Travels</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Our Office</h4>
                    <p className="text-slate-600">
                      Wasturwan Travels<br />
                      Ground Floor, Pahal Brein<br />
                      Nishat Road, Srinagar, J&amp;K<br />
                      PIN: 191121
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shrink-0 shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Phone & WhatsApp</h4>
                    <p className="text-slate-600">+91 7006594976</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center shrink-0 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Email</h4>
                    <p className="text-slate-600">wasturwantravels@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Plan Your Kashmir Journey Today</h3>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                Ready to explore Jammu &amp; Kashmir? Contact us for custom packages and best deals.
              </p>
              <a href="https://wa.me/917006594976" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/50"
          >
            <h3 className="text-2xl font-bold mb-8 text-slate-900">Send a Message</h3>
            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Message sent successfully! We'll get back to you soon.</span>
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
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <Input 
                  name="phone"
                  type="tel"
                  placeholder="Your phone number" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <Input 
                  name="subject"
                  placeholder="How can we help?" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message *</label>
                <Textarea 
                  name="message"
                  placeholder="Tell us more about your travel plans..." 
                  required
                  className="min-h-[180px] rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
                />
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
                Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
