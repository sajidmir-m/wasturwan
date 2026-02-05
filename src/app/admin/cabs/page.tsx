"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Car } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getCabs, createCab, updateCab, deleteCab } from "@/lib/actions/cabs"

interface Cab {
  id: string
  name: string
  slug: string
  category: string | null
  models: string[] | null
  capacity_min: number | null
  capacity_max: number | null
  description: string | null
  tags: string[] | null
  status: string
  ordering: number | null
}

export default function AdminCabsPage() {
  const [cabs, setCabs] = useState<Cab[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Cab | null>(null)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    models: "",
    capacity_min: "",
    capacity_max: "",
    description: "",
    tags: "",
    status: "active",
    ordering: "",
  })

  useEffect(() => {
    loadCabs()
  }, [])

  const loadCabs = async () => {
    setLoading(true)
    const data = await getCabs()
    setCabs(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setEditing(null)
    setForm({
      name: "",
      slug: "",
      category: "",
      models: "",
      capacity_min: "",
      capacity_max: "",
      description: "",
      tags: "",
      status: "active",
      ordering: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category || null,
      models: form.models ? form.models.split(",").map((m) => m.trim()).filter(Boolean) : [],
      capacity_min: form.capacity_min ? Number(form.capacity_min) : null,
      capacity_max: form.capacity_max ? Number(form.capacity_max) : null,
      description: form.description || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: form.status as "active" | "inactive",
      ordering: form.ordering ? Number(form.ordering) : null,
    }

    try {
      if (editing) {
        await updateCab(editing.id, payload)
      } else {
        await createCab(payload)
      }
      await loadCabs()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cab: Cab) => {
    setEditing(cab)
    setForm({
      name: cab.name || "",
      slug: cab.slug || "",
      category: cab.category || "",
      models: (cab.models || []).join(", "),
      capacity_min: cab.capacity_min?.toString() || "",
      capacity_max: cab.capacity_max?.toString() || "",
      description: cab.description || "",
      tags: (cab.tags || []).join(", "),
      status: cab.status || "active",
      ordering: cab.ordering?.toString() || "",
    })
  }

  const handleDelete = async (cab: Cab) => {
    if (!confirm(`Delete cab "${cab.name}"?`)) return
    setSaving(true)
    try {
      await deleteCab(cab.id)
      await loadCabs()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-7 h-7 text-blue-600" />
            Cabs
          </h1>
          <p className="text-slate-600 mt-1">Manage all cab categories and models shown on the public Cabs page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1 border-slate-200/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Cab" : "Add New Cab"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sedan Cabs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Slug</label>
                <Input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="sedan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Sedan, MPV, Tempo Traveller..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Models (comma separated)</label>
                <Input
                  value={form.models}
                  onChange={(e) => setForm({ ...form, models: e.target.value })}
                  placeholder="Swift Dzire, Toyota Etios, Honda Amaze"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Min Persons</label>
                  <Input
                    type="number"
                    value={form.capacity_min}
                    onChange={(e) => setForm({ ...form, capacity_min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Max Persons</label>
                  <Input
                    type="number"
                    value={form.capacity_max}
                    onChange={(e) => setForm({ ...form, capacity_max: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description for this cab category..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tags (comma separated)</label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="AC, Budget friendly, Sightseeing"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
                  <select
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Ordering</label>
                  <Input
                    type="number"
                    value={form.ordering}
                    onChange={(e) => setForm({ ...form, ordering: e.target.value })}
                    placeholder="1, 2, 3..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full px-5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editing ? "Update Cab" : "Create Cab"}
                    </>
                  )}
                </Button>
                {editing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">All Cabs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : cabs.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No cabs yet. Add your first cab on the left.</p>
            ) : (
              <div className="space-y-3">
                {cabs.map((cab) => (
                  <div
                    key={cab.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200/70 bg-slate-50/80 hover:bg-white transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {cab.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-white uppercase tracking-wide">
                          {cab.slug}
                        </span>
                        {cab.status === "inactive" && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Inactive
                          </span>
                        )}
                      </div>
                      {cab.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {cab.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {cab.models && cab.models.length > 0 && (
                          <span className="text-[11px] text-slate-700">
                            Models: {cab.models.join(", ")}
                          </span>
                        )}
                        {cab.capacity_min && cab.capacity_max && (
                          <span className="text-[11px] text-slate-700">
                            • {cab.capacity_min}-{cab.capacity_max} persons
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:self-start">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cab)}
                        className="rounded-full h-8 px-3"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cab)}
                        className="rounded-full h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


