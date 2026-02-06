import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const bucket = String(formData.get("bucket") || "")
    const folder = String(formData.get("folder") || "admin")
    const file = formData.get("file")

    if (!bucket) {
      return NextResponse.json({ error: "Missing bucket" }, { status: 400 })
    }
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // @ts-expect-error - File is the standard web File in Next route runtime
    const filename = `${Date.now()}-${file.name}` as string
    const path = `${folder}/${filename}`

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    })

    if (error) {
      console.error("Admin upload error:", error)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return NextResponse.json({ publicUrl: data.publicUrl, path })
  } catch (err) {
    console.error("Unexpected error in /api/admin/upload:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}


