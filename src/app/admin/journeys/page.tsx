"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Edit2, Save, UploadCloud } from "lucide-react"

type Journey = {
  id: string
  title: string
  location: string | null
  category: string | null
  price: number
  days: number
  nights: number
  duration: string | null
  description: string | null
  main_image_url: string | null
  featured: boolean
  rating: number | null
  status: string
}

export default function AdminJourneysPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Partial<Journey>>({})
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        const res = await fetch("/api/admin/packages")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load packages")
        setJourneys(json.packages || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadJourneys()
  }, [])

  const startCreate = () => {
    setEditingId("new")
    setFormState({
      title: "",
      location: "",
      category: "",
      price: 0,
      days: 1,
      nights: 0,
       duration: "",
       description: "",
       main_image_url: "",
       featured: false,
       rating: null,
      status: "active",
    })
  }

  const startEdit = (j: Journey) => {
    setEditingId(j.id)
    setFormState(j)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({})
  }

  const handleChange = (name: keyof Journey, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "days" || name === "nights"
          ? Number(value)
          : value,
    }))
  }

  const saveJourney = async () => {
    if (!formState.title) return

    try {
      setSaving(true)

      const method = editingId === "new" ? "POST" : "PUT"
      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save package")

      setJourneys(json.packages || [])
      cancelEdit()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)

      const fd = new FormData()
      fd.append("bucket", "packages")
      fd.append("folder", "admin-packages")
      fd.append("file", file)

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) {
        console.error("Upload failed:", json?.error)
        return
      }

      setFormState((prev) => ({ ...prev, main_image_url: json.publicUrl }))
    } catch (err) {
      console.error("Unexpected upload error", err)
    } finally {
      setUploadingImage(false)
    }
  }

  const deleteJourney = async (id: string) => {
    if (!confirm("Delete this package?")) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete package")
      setJourneys(json.packages || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            Admin
          </p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
            Journeys / Packages
          </h1>
        </div>
        <Button size="sm" onClick={startCreate} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          New Package
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading packages...
        </div>
      ) : (
        <div className="space-y-4">
          {journeys.map((j) => (
            <Card key={j.id} className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {j.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    {j.location} • {j.days}D / {j.nights}N
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-slate-600"
                    onClick={() => startEdit(j)}
                    disabled={saving}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-red-600 text-red-400"
                    onClick={() => deleteJourney(j.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              {editingId === j.id && (
                <CardContent className="space-y-4 border-t border-slate-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Title</label>
                      <Input
                        value={formState.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Location</label>
                      <Input
                        value={formState.location || ""}
                        onChange={(e) => handleChange("location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Category</label>
                      <Input
                        value={formState.category || ""}
                        onChange={(e) => handleChange("category", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Price</label>
                      <Input
                        type="number"
                        value={formState.price ?? 0}
                        onChange={(e) => handleChange("price", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Days</label>
                      <Input
                        type="number"
                        value={formState.days ?? 1}
                        onChange={(e) => handleChange("days", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Nights</label>
                      <Input
                        type="number"
                        value={formState.nights ?? 0}
                        onChange={(e) => handleChange("nights", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Duration (e.g. 5D/4N)</label>
                      <Input
                        value={formState.duration || ""}
                        onChange={(e) => handleChange("duration", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Main Image URL</label>
                      <Input
                        value={formState.main_image_url || ""}
                        onChange={(e) => handleChange("main_image_url", e.target.value)}
                      />
                      <label className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <UploadCloud className="w-3 h-3" />
                        Upload to <code className="text-[10px]">packages</code> bucket
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file)
                          }}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file)
                          }
                          input.click()
                        }}
                        className="mt-1 h-8 text-xs"
                      >
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Description</label>
                    <Textarea
                      value={formState.description || ""}
                      onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveJourney}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {editingId === "new" && (
            <Card className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  New Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Title</label>
                    <Input
                      value={formState.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Location</label>
                    <Input
                      value={formState.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Category</label>
                    <Input
                      value={formState.category || ""}
                      onChange={(e) => handleChange("category", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Price</label>
                    <Input
                      type="number"
                      value={formState.price ?? 0}
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Days</label>
                    <Input
                      type="number"
                      value={formState.days ?? 1}
                      onChange={(e) => handleChange("days", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Nights</label>
                    <Input
                      type="number"
                      value={formState.nights ?? 0}
                      onChange={(e) => handleChange("nights", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveJourney}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}


