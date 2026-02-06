import { NextRequest, NextResponse } from "next/server"
import { createAnonymousClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, email, phone, date, persons, packageId, message } = body as {
      name?: string
      email?: string
      phone?: string
      date?: string
      persons?: number
      packageId?: string | null
      message?: string
    }

    if (!name || !email || !phone || !date || !persons) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 })
    }

    const supabase = createAnonymousClient()

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        name,
        email,
        phone,
        date,
        persons,
        package_id: packageId || null,
        message: message || null,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error inserting booking:", error)
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 })
    }

    return NextResponse.json({ bookingId: data.id }, { status: 201 })
  } catch (err) {
    console.error("Unexpected error in /api/bookings:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}


