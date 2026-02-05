"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCabs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cabs")
    .select("*")
    .order("ordering", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching cabs", error)
    return []
  }
  return data
}

export async function createCab(payload: {
  name: string
  slug: string
  category: string | null
  models: string[]
  capacity_min: number | null
  capacity_max: number | null
  description: string | null
  tags: string[]
  status: "active" | "inactive"
  ordering: number | null
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("cabs").insert(payload)
  if (error) {
    console.error("Error creating cab", error)
    throw error
  }
}

export async function updateCab(
  id: string,
  payload: {
    name: string
    slug: string
    category: string | null
    models: string[]
    capacity_min: number | null
    capacity_max: number | null
    description: string | null
    tags: string[]
    status: "active" | "inactive"
    ordering: number | null
  }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("cabs").update(payload).eq("id", id)
  if (error) {
    console.error("Error updating cab", error)
    throw error
  }
}

export async function deleteCab(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("cabs").delete().eq("id", id)
  if (error) {
    console.error("Error deleting cab", error)
    throw error
  }
}

