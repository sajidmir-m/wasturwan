"use client"

import { Mail, MessageCircle, CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

/**
 * BookingSuccess Component
 * 
 * IMPORTANT: This component is PURELY CLIENT-SIDE and does NOT interact with Supabase.
 * The booking has already been saved to Supabase before this component is shown.
 * 
 * This component only provides UI buttons that:
 * - Open email client (mailto: link) - NO database interaction
 * - Open WhatsApp (wa.me link) - NO database interaction
 * - Copy text to clipboard - NO database interaction
 */

interface BookingSuccessProps {
  bookingData: {
    name: string
    email: string
    phone: string
    date: string
    persons: number
    packageTitle?: string
    message?: string
  }
}

export default function BookingSuccess({ bookingData }: BookingSuccessProps) {
  const [emailCopied, setEmailCopied] = useState(false)
  const [whatsappCopied, setWhatsappCopied] = useState(false)

  // WhatsApp number (remove any spaces or dashes)
  const whatsappNumber = "917006594976"
  
  // Format booking details for WhatsApp message
  const whatsappMessage = `Hello! I just submitted a booking request:

Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Travel Date: ${bookingData.date}
Persons: ${bookingData.persons}
${bookingData.packageTitle ? `Package: ${bookingData.packageTitle}` : ''}
${bookingData.message ? `\nMessage: ${bookingData.message}` : ''}

Please confirm my booking. Thank you!`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  // Email details
  const emailSubject = `Booking Request - ${bookingData.name}`
  const emailBody = `Hello Wasturwan Travels,

I just submitted a booking request through your website:

Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Travel Date: ${bookingData.date}
Number of Persons: ${bookingData.persons}
${bookingData.packageTitle ? `Preferred Package: ${bookingData.packageTitle}` : ''}
${bookingData.message ? `\nAdditional Details:\n${bookingData.message}` : ''}

Please confirm my booking at your earliest convenience.

Thank you!`

  const emailTo = "wasturwantravels@gmail.com"
  const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  // Client-side only: Copy to clipboard (NO Supabase interaction)
  const copyToClipboard = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard.writeText(text)
    if (type === 'email') {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } else {
      setWhatsappCopied(true)
      setTimeout(() => setWhatsappCopied(false), 2000)
    }
  }

  // Client-side only: Open email client (NO Supabase interaction)
  const handleEmailClick = () => {
    window.location.href = mailtoUrl
  }

  // Client-side only: Open WhatsApp (NO Supabase interaction)
  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-emerald-900 mb-1">
            Booking Request Submitted Successfully!
          </h3>
          <p className="text-sm text-emerald-700">
            Your booking has been received. Choose how you'd like to proceed:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Option */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Send via Email</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Open your email client to send booking details
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleEmailClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg h-10 font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              Open Email
            </Button>
            <Button
              onClick={() => copyToClipboard(emailTo, 'email')}
              variant="outline"
              className="px-3 border-slate-300 hover:bg-slate-50 rounded-lg h-10"
              title="Copy email address"
            >
              {emailCopied ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600" />
              )}
            </Button>
          </div>
        </div>

        {/* WhatsApp Option */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Contact via WhatsApp</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Open WhatsApp with pre-filled booking details
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg h-10 font-medium"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open WhatsApp
            </Button>
            <Button
              onClick={() => copyToClipboard(`https://wa.me/${whatsappNumber}`, 'whatsapp')}
              variant="outline"
              className="px-3 border-slate-300 hover:bg-slate-50 rounded-lg h-10"
              title="Copy WhatsApp link"
            >
              {whatsappCopied ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-200">
        <p className="text-xs text-center text-slate-600">
          💡 Tip: You can also call us directly at{" "}
          <a href="tel:+917006594976" className="text-blue-600 hover:underline font-medium">
            +91 70065 94976
          </a>
        </p>
      </div>
    </div>
  )
}

