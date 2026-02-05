"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPlaceById, updatePlace } from "@/lib/actions/places"
import { compressImage, validateImageFile } from "@/lib/utils/image-compression"

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [place, setPlace] = useState<any>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageDeleted, setImageDeleted] = useState(false)
  const [compressing, setCompressing] = useState(false)

  useEffect(() => {
    loadPlace()
  }, [id])

  const loadPlace = async () => {
    const { data } = await getPlaceById(id)
    if (data) {
      setPlace(data)
      if (data.image_url) {
        setImagePreview(data.image_url)
      }
    }
    setLoading(false)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file, 5)
    if (validationError) {
      setError(validationError)
      return
    }

    setCompressing(true)
    setError("")

    try {
      const compressedFile = await compressImage(file, 1600, 900, 0.85, 2)
      setImage(compressedFile)
      setImagePreview(URL.createObjectURL(compressedFile))
      setImageDeleted(false)
    } catch (err) {
      console.error("Image compression error:", err)
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setImageDeleted(false)
    } finally {
      setCompressing(false)
    }
  }

  const handleDeleteImage = () => {
    setImage(null)
    setImagePreview(null)
    setImageDeleted(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    if (imageDeleted) {
      formData.append("deleteImage", "true")
    } else if (image) {
      formData.append("image", image)
    }

    const { error: actionError } = await updatePlace(id, formData)

    if (actionError) {
      setError(actionError)
      setSaving(false)
    } else {
      router.push("/admin/places")
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!place) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Place not found</p>
        <Link href="/admin/places">
          <Button className="mt-4">Back to Places</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/places">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            Edit Place
          </h1>
          <p className="text-slate-600">Update destination details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Place Name *
                  </label>
                  <Input
                    name="name"
                    required
                    defaultValue={place.name}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Region
                  </label>
                  <Input
                    name="region"
                    defaultValue={place.region || ""}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Short Description
                  </label>
                  <Textarea
                    name="description"
                    defaultValue={place.description || ""}
                    className="rounded-xl min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Place Image
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    {compressing ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        <p className="text-sm text-slate-600">
                          Compressing image...
                        </p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden group">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" /> Delete
                          </button>
                          <label className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={compressing}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300">
                          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                          <p className="text-slate-600 font-medium mb-1">
                            Click to upload image
                          </p>
                          <p className="text-xs text-slate-500">
                            JPG, PNG or WebP (max 5MB, auto-compressed)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={compressing}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {imagePreview && !compressing && (
                    <p className="text-xs text-slate-500 text-center">
                      {image ? (
                        <>
                          New image selected (
                          {image.size > 1024 * 1024
                            ? `${(image.size / 1024 / 1024).toFixed(2)}MB`
                            : `${(image.size / 1024).toFixed(0)}KB`}
                          ). Click "Save Changes" to update.
                        </>
                      ) : (
                        "Current image. Hover to delete or replace."
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={place.status || "active"}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Ordering
                  </label>
                  <Input
                    name="ordering"
                    type="number"
                    defaultValue={place.ordering ?? 0}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-slate-500">
                    Lower numbers appear first on the Places page.
                  </p>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Link href="/admin/places" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}


