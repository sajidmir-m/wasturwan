"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Edit2, Save } from "lucide-react"

type Service = {
  id: string
  title: string
  description: string | null
  icon: string | null
  status: string
}

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Partial<Service>>({})

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/admin/services")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load services")
        setServices(json.services || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const startCreate = () => {
    setEditingId("new")
    setFormState({
      title: "",
      description: "",
      icon: "",
      status: "active",
    })
  }

  const startEdit = (s: Service) => {
    setEditingId(s.id)
    setFormState(s)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({})
  }

  const handleChange = (name: keyof Service, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveService = async () => {
    if (!formState.title) return

    try {
      setSaving(true)
      const method = editingId === "new" ? "POST" : "PUT"
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save service")
      setServices(json.services || [])
      cancelEdit()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete service")
      setServices(json.services || [])
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
            Services
          </h1>
        </div>
        <Button size="sm" onClick={startCreate} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          New Service
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading services...
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <Card key={s.id} className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {s.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.icon} • {s.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-slate-600"
                    onClick={() => startEdit(s)}
                    disabled={saving}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-red-600 text-red-400"
                    onClick={() => deleteService(s.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              {editingId === s.id && (
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
                      <label className="text-xs text-slate-400">Icon</label>
                      <Input
                        value={formState.icon || ""}
                        onChange={(e) => handleChange("icon", e.target.value)}
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
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Description</label>
                    <Textarea
                      value={formState.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
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
                      onClick={saveService}
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
                  New Service
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
                    <label className="text-xs text-slate-400">Icon</label>
                    <Input
                      value={formState.icon || ""}
                      onChange={(e) => handleChange("icon", e.target.value)}
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
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Description</label>
                  <Textarea
                    value={formState.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
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
                    onClick={saveService}
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


