"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: string
}

export default function AdminContactsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetch("/api/admin/contacts")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load contacts")
        setContacts(json.contacts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      setSaving(true)
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update contact")
      setContacts(json.contacts || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete contact")
      setContacts(json.contacts || [])
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
          Contact Inquiries
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading contacts...
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-sm text-slate-400">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <Card key={c.id} className="bg-slate-900/60 border-slate-800 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {c.name} – {c.subject || "No subject"}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.email} {c.phone ? `• ${c.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1"
                    value={c.status}
                    disabled={saving}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-red-600 text-red-400"
                    onClick={() => deleteContact(c.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 whitespace-pre-line">
                  {c.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


