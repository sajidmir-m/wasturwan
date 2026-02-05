"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getPlaces() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("ordering", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching places:", error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getPlaceById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching place:", error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createPlace(formData: FormData) {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (userData?.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const region = formData.get("region") as string
  const description = formData.get("description") as string
  const status = (formData.get("status") as string) || "active"
  const ordering = parseInt((formData.get("ordering") as string) || "0", 10)
  const imageFile = formData.get("image") as File | null

  // Basic slug from name
  const slug =
    (name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || null

  let imageUrl: string | null = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `places/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("places")
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error("Error uploading place image:", uploadError)
      return { error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("places")
      .getPublicUrl(filePath)

    imageUrl = publicUrl
  }

  const { data, error } = await supabase
    .from("places")
    .insert({
      name,
      slug,
      region,
      description,
      status,
      ordering,
      image_url: imageUrl,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating place:", error)
    return { error: error.message }
  }

  revalidatePath("/places")
  revalidatePath("/admin/places")

  return { data, error: null }
}

export async function updatePlace(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (userData?.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const region = formData.get("region") as string
  const description = formData.get("description") as string
  const status = (formData.get("status") as string) || "active"
  const ordering = parseInt((formData.get("ordering") as string) || "0", 10)
  const imageFile = formData.get("image") as File | null
  const deleteImage = formData.get("deleteImage") === "true"

  const updateData: any = {
    name,
    region,
    description,
    status,
    ordering,
  }

  if (name) {
    updateData.slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  if (deleteImage) {
    updateData.image_url = null
  } else if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `places/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("places")
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error("Error uploading place image:", uploadError)
      return { error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("places")
      .getPublicUrl(filePath)

    updateData.image_url = publicUrl
  }

  const { data, error } = await supabase
    .from("places")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating place:", error)
    return { error: error.message }
  }

  revalidatePath("/places")
  revalidatePath("/admin/places")

  return { data, error: null }
}

export async function deletePlace(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (userData?.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("places")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting place:", error)
    return { error: error.message }
  }

  revalidatePath("/places")
  revalidatePath("/admin/places")

  return { error: null }
}


