import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, title, location, category, price, days, nights, duration, description, status, featured, rating, main_image_url, itinerary, inclusions, exclusions",
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin packages", error)
    return NextResponse.json({ error: "Failed to load packages" }, { status: 500 })
  }

  return NextResponse.json({ packages: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const insertData = {
    title: body.title,
    location: body.location || null,
    category: body.category || null,
    price: body.price ?? 0,
    days: body.days ?? 1,
    nights: body.nights ?? 0,
    duration: body.duration || null,
    description: body.description || null,
    main_image_url: body.main_image_url || null,
    status: body.status || "active",
    featured: body.featured ?? false,
    rating: body.rating ?? null,
    itinerary: body.itinerary ?? [],
    inclusions: body.inclusions ?? [],
    exclusions: body.exclusions ?? [],
  }

  const { error } = await supabase.from("packages").insert(insertData)

  if (error) {
    console.error("Error inserting package", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }

  return GET()
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing package id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {
    title: body.title,
    location: body.location || null,
    category: body.category || null,
    price: body.price ?? 0,
    days: body.days ?? 1,
    nights: body.nights ?? 0,
    duration: body.duration || null,
    description: body.description || null,
    main_image_url: body.main_image_url || null,
    status: body.status || "active",
    featured: body.featured ?? false,
    rating: body.rating ?? null,
    itinerary: body.itinerary ?? [],
    inclusions: body.inclusions ?? [],
    exclusions: body.exclusions ?? [],
  }

  const { error } = await supabase.from("packages").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating package", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing package id" }, { status: 400 })
  }

  const { error } = await supabase.from("packages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting package", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }

  return GET()
}


