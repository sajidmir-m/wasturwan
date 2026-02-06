import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("id, name, email, phone, date, persons, status, package_id, message, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin bookings", error)
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 })
  }

  return NextResponse.json({ bookings: data ?? [] })
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {}
  if (body.status) updateData.status = body.status

  const { error } = await supabase.from("bookings").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating booking", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 })
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id)

  if (error) {
    console.error("Error deleting booking", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }

  return GET()
}


