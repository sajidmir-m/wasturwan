"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createPlace } from "@/lib/actions/places"
import { compressImage, validateImageFile } from "@/lib/utils/image-compression"

export default function NewPlacePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

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
    } catch (err) {
      console.error("Image compression error:", err)
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    } finally {
      setCompressing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    if (image) {
      formData.append("image", image)
    }

    const { error: actionError } = await createPlace(formData)

    if (actionError) {
      setError(actionError)
      setLoading(false)
    } else {
      router.push("/admin/places")
    }
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
            Add New Place
          </h1>
          <p className="text-slate-600">
            Create a destination that appears on the public Places page
          </p>
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
                    className="rounded-xl"
                    placeholder="e.g., Gulmarg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Region
                  </label>
                  <Input
                    name="region"
                    className="rounded-xl"
                    placeholder="e.g., Kashmir Valley, Jammu Region, Ladakh"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Short Description
                  </label>
                  <Textarea
                    name="description"
                    className="rounded-xl min-h-[120px]"
                    placeholder="Describe what makes this destination special..."
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
                      <div className="relative w-full h-64 rounded-xl overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                  {imagePreview && !compressing && image && (
                    <p className="text-xs text-slate-500 text-center">
                      Image ready (
                      {image.size > 1024 * 1024
                        ? `${(image.size / 1024 / 1024).toFixed(2)}MB`
                        : `${(image.size / 1024).toFixed(0)}KB`}
                      )
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
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500"
                    defaultValue="active"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Ordering (optional)
                  </label>
                  <Input
                    name="ordering"
                    type="number"
                    className="rounded-xl"
                    placeholder="0"
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
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Place"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}


