import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("places")
    .select("id, name, region, status, featured, hero_image_url, short_description, description, gallery, slug")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading admin places", error)
    return NextResponse.json({ error: "Failed to load places" }, { status: 500 })
  }

  return NextResponse.json({ places: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const insertData = {
    name: body.name,
    slug: body.slug || null,
    region: body.region || null,
    status: body.status || "active",
    featured: body.featured ?? false,
    hero_image_url: body.hero_image_url || null,
    short_description: body.short_description || null,
    description: body.description || null,
    gallery: body.gallery ?? [],
  }

  const { error } = await supabase.from("places").insert(insertData)

  if (error) {
    console.error("Error inserting place", error)
    return NextResponse.json({ error: "Failed to create place" }, { status: 500 })
  }

  return GET()
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: "Missing place id" }, { status: 400 })
  }

  const updateData: Record<string, any> = {
    name: body.name,
    slug: body.slug || null,
    region: body.region || null,
    status: body.status || "active",
    featured: body.featured ?? false,
    hero_image_url: body.hero_image_url || null,
    short_description: body.short_description || null,
    description: body.description || null,
    gallery: body.gallery ?? [],
  }

  const { error } = await supabase.from("places").update(updateData).eq("id", body.id)

  if (error) {
    console.error("Error updating place", error)
    return NextResponse.json({ error: "Failed to update place" }, { status: 500 })
  }

  return GET()
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing place id" }, { status: 400 })
  }

  const { error } = await supabase.from("places").delete().eq("id", id)

  if (error) {
    console.error("Error deleting place", error)
    return NextResponse.json({ error: "Failed to delete place" }, { status: 500 })
  }

  return GET()
}


