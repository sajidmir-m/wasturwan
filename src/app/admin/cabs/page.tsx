"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Edit2, Save, UploadCloud } from "lucide-react"

type Cab = {
  id: string
  name: string
  type: string
  capacity: number
  luggage_capacity: number | null
  base_fare: number | null
  per_km_rate: number | null
  status: string
  featured: boolean
  main_image_url: string | null
}

export default function AdminCabsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cabs, setCabs] = useState<Cab[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Partial<Cab>>({})
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const loadCabs = async () => {
      try {
        const res = await fetch("/api/admin/cabs")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load cabs")
        setCabs(json.cabs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCabs()
  }, [])

  const startCreate = () => {
    setEditingId("new")
    setFormState({
      name: "",
      type: "sedan",
      capacity: 4,
      luggage_capacity: 2,
      base_fare: null,
      per_km_rate: null,
      status: "active",
      featured: false,
      main_image_url: "",
    })
  }

  const startEdit = (c: Cab) => {
    setEditingId(c.id)
    setFormState(c)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({})
  }

  const handleChange = (name: keyof Cab, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [name]:
        name === "capacity" ||
        name === "luggage_capacity" ||
        name === "base_fare" ||
        name === "per_km_rate"
          ? Number(value)
          : value,
    }))
  }

  const saveCab = async () => {
    if (!formState.name) return

    try {
      setSaving(true)
      const method = editingId === "new" ? "POST" : "PUT"
      const res = await fetch("/api/admin/cabs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save cab")
      setCabs(json.cabs || [])
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
      fd.append("bucket", "cabs")
      fd.append("folder", "admin-cabs")
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

  const deleteCab = async (id: string) => {
    if (!confirm("Delete this cab?")) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/cabs?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete cab")
      setCabs(json.cabs || [])
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
            Cabs
          </h1>
        </div>
        <Button size="sm" onClick={startCreate} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          New Cab
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading cabs...
        </div>
      ) : (
        <div className="space-y-4">
          {cabs.map((c) => (
            <Card key={c.id} className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {c.name}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.type} • {c.capacity} seats • {c.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-slate-600"
                    onClick={() => startEdit(c)}
                    disabled={saving}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-red-600 text-red-400"
                    onClick={() => deleteCab(c.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              {editingId === c.id && (
                <CardContent className="space-y-4 border-t border-slate-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Name</label>
                      <Input
                        value={formState.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Type</label>
                      <Input
                        value={formState.type || ""}
                        onChange={(e) => handleChange("type", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Capacity</label>
                      <Input
                        type="number"
                        value={formState.capacity ?? 4}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Luggage Capacity</label>
                      <Input
                        type="number"
                        value={formState.luggage_capacity ?? 2}
                        onChange={(e) =>
                          handleChange("luggage_capacity", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Base Fare</label>
                      <Input
                        type="number"
                        value={formState.base_fare ?? 0}
                        onChange={(e) => handleChange("base_fare", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Per Km Rate</label>
                      <Input
                        type="number"
                        value={formState.per_km_rate ?? 0}
                        onChange={(e) => handleChange("per_km_rate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Main Image URL</label>
                      <Input
                        value={formState.main_image_url || ""}
                        onChange={(e) =>
                          handleChange("main_image_url", e.target.value)
                        }
                      />
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
                        className="mt-1 h-8 text-xs flex items-center gap-2"
                      >
                        <UploadCloud className="w-3 h-3" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Status</label>
                      <Input
                        value={formState.status || "active"}
                        onChange={(e) => handleChange("status", e.target.value)}
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
                      onClick={saveCab}
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
                  New Cab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Name</label>
                    <Input
                      value={formState.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Type</label>
                    <Input
                      value={formState.type || ""}
                      onChange={(e) => handleChange("type", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Capacity</label>
                    <Input
                      type="number"
                      value={formState.capacity ?? 4}
                      onChange={(e) => handleChange("capacity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Luggage Capacity</label>
                    <Input
                      type="number"
                      value={formState.luggage_capacity ?? 2}
                      onChange={(e) =>
                        handleChange("luggage_capacity", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Base Fare</label>
                    <Input
                      type="number"
                      value={formState.base_fare ?? 0}
                      onChange={(e) => handleChange("base_fare", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Per Km Rate</label>
                    <Input
                      type="number"
                      value={formState.per_km_rate ?? 0}
                      onChange={(e) => handleChange("per_km_rate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Main Image URL</label>
                    <Input
                      value={formState.main_image_url || ""}
                      onChange={(e) =>
                        handleChange("main_image_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Status</label>
                    <Input
                      value={formState.status || "active"}
                      onChange={(e) => handleChange("status", e.target.value)}
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
                    onClick={saveCab}
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


