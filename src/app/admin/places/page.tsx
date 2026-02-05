"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, MapPin, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getPlaces, deletePlace } from "@/lib/actions/places"

export default function PlacesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadPlaces()
  }, [])

  const loadPlaces = async () => {
    setLoading(true)
    const { data } = await getPlaces()
    if (data) {
      setPlaces(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this place?")) return

    setDeletingId(id)
    const { error } = await deletePlace(id)
    if (!error) {
      loadPlaces()
    } else {
      alert("Error deleting place: " + error)
    }
    setDeletingId(null)
  }

  const regions = [
    "All",
    ...Array.from(new Set(places.map((p) => p.region).filter(Boolean))),
  ]

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.region?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion =
      selectedRegion === "All" || place.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
            Places Management
          </h1>
          <p className="text-slate-600">
            Manage all destinations shown on your public Places page
          </p>
        </div>
        <Link href="/admin/places/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" /> Add New Place
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <Card className="border-slate-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">No places found.</p>
            <Link href="/admin/places/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Place
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-44 w-full">
                  {place.image_url ? (
                    <Image
                      src={place.image_url}
                      alt={place.name || "Place"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                        place.status === "active"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {place.status || "active"}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-slate-900 mb-1">
                    {place.name}
                  </CardTitle>
                  <div className="flex items-center text-slate-500 text-sm gap-2">
                    {place.region && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{place.region}</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">
                      Order: {place.ordering ?? 0}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {place.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/places?place=${encodeURIComponent(
                        place.name || ""
                      )}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-slate-200 hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Public
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/places/${place.id}/edit`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(place.id)}
                      disabled={deletingId === place.id}
                      className="rounded-xl hover:bg-red-700"
                    >
                      {deletingId === place.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}


