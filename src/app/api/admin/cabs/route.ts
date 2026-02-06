import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("cabs")
    .select("id, name, slug, type, capacity, luggage_capacity, description, base_fare, per_km_rate, status, featured, main_image_url, tags")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin cabs", error)
    return NextResponse.json({ error: "Failed to load cabs" }, { status: 500 })
  }

  return NextResponse.json({ cabs: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const insertData = {
    name: body.name,
    slug: body.slug || null,
    type: body.type || "sedan",
    capacity: body.capacity ?? 4,
    luggage_capacity: body.luggage_capacity ?? 2,
    description: body.description || null,
    base_fare: body.base_fare ?? null,
    per_km_rate: body.per_km_rate ?? null,
    status: body.status || "active",
    featured: body.featured ?? false,
    main_image_url: body.main_image_url || null,
    tags: body.tags ?? [],
  }

  const { error } = await supabase.from("cabs").insert(insertData)

  if (error) {
    console.error("Error inserting cab", error)
    return NextResponse.json({ error: "Failed to create cab" }, { status: 500 })
  }

  return GET()
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing cab id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {
    name: body.name,
    slug: body.slug || null,
    type: body.type || "sedan",
    capacity: body.capacity ?? 4,
    luggage_capacity: body.luggage_capacity ?? 2,
    description: body.description || null,
    base_fare: body.base_fare ?? null,
    per_km_rate: body.per_km_rate ?? null,
    status: body.status || "active",
    featured: body.featured ?? false,
    main_image_url: body.main_image_url || null,
    tags: body.tags ?? [],
  }

  const { error } = await supabase.from("cabs").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating cab", error)
    return NextResponse.json({ error: "Failed to update cab" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing cab id" }, { status: 400 })
  }

  const { error } = await supabase.from("cabs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting cab", error)
    return NextResponse.json({ error: "Failed to delete cab" }, { status: 500 })
  }

  return GET()
}


