import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, email, phone, subject, message, status, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin contacts", error)
    return NextResponse.json({ error: "Failed to load contacts" }, { status: 500 })
  }

  return NextResponse.json({ contacts: data ?? [] })
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing contact id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {}
  if (body.status) updateData.status = body.status

  const { error } = await supabase.from("contacts").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating contact", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing contact id" }, { status: 400 })
  }

  const { error } = await supabase.from("contacts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contact", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }

  return GET()
}


