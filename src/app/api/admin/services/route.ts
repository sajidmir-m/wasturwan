import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("services")
    .select("id, title, description, icon, status")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin services", error)
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 })
  }

  return NextResponse.json({ services: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const insertData = {
    title: body.title,
    description: body.description || null,
    icon: body.icon || null,
    status: body.status || "active",
  }

  const { error } = await supabase.from("services").insert(insertData)

  if (error) {
    console.error("Error inserting service", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }

  return GET()
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing service id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {
    title: body.title,
    description: body.description || null,
    icon: body.icon || null,
    status: body.status || "active",
  }

  const { error } = await supabase.from("services").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating service", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing service id" }, { status: 400 })
  }

  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    console.error("Error deleting service", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }

  return GET()
}


