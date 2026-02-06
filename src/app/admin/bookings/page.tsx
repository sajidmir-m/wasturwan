"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"

type Booking = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  persons: number
  status: string
  package_id: string | null
  message: string | null
  created_at: string
}

export default function AdminBookingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load bookings")
        setBookings(json.bookings || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      setSaving(true)
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update booking")
      setBookings(json.bookings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete booking")
      setBookings(json.bookings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
          Admin
        </p>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
          Bookings
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-slate-400">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {b.name} – {b.date}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    {b.email} • {b.phone} • {b.persons} person(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1"
                    value={b.status}
                    disabled={saving}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-red-600 text-red-400"
                    onClick={() => deleteBooking(b.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              {b.message && (
                <CardContent>
                  <p className="text-xs text-slate-300 whitespace-pre-line">
                    {b.message}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


