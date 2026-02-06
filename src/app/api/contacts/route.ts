import { NextRequest, NextResponse } from "next/server"
import { createAnonymousClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, email, phone, subject, message } = body as {
      name?: string
      email?: string
      phone?: string
      subject?: string
      message?: string
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 })
    }

    const supabase = createAnonymousClient()

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      phone: phone || null,
      subject: subject || "Booking enquiry",
      message,
    })

    if (error) {
      console.error("Error inserting contact:", error)
      return NextResponse.json({ error: "Failed to save contact" }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error("Unexpected error in /api/contacts:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}


