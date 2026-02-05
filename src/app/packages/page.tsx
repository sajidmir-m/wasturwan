"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Star, MapPin, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getJourneys } from "@/lib/actions/journeys"
import { useSearchParams } from "next/navigation"

export default function PackagesPage() {
  const searchParams = useSearchParams()
  const initialPlace = searchParams.get("place") || ""

  const [searchTerm, setSearchTerm] = useState(initialPlace)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    setLoading(true)
    const { data, error } = await getJourneys()
    if (data) {
      setPackages(data.filter((pkg: any) => pkg.status === 'active'))
    } else {
      console.error("Failed to load packages:", error)
    }
    setLoading(false)
  }

  // Get unique categories from packages
  const categories = ["All", ...Array.from(new Set(packages.map(pkg => pkg.category).filter(Boolean)))]

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pkg.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">Tour Packages</h1>
            <p className="text-xl text-slate-600">Explore our best curated travel itineraries</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search destination..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-slate-200/50 shadow-lg bg-white group h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <Image 
                    src={pkg.image || pkg.main_image_url || "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop"} 
                    alt={pkg.title || "Package"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {pkg.rating && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-slate-900 flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {pkg.rating}
                    </div>
                  )}
                  {pkg.category && (
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-white">
                      {pkg.category}
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-slate-900">{pkg.title}</CardTitle>
                  </div>
                  {pkg.location && (
                    <div className="flex items-center text-slate-500 text-sm mt-2">
                      <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
                      {pkg.location}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pb-4 flex-grow">
                  <div className="flex items-center justify-between text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{pkg.days} Days / {pkg.nights} Nights</span>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-600">₹{Number(pkg.price).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm ml-2">/ person</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link href={`/packages/${pkg.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPackages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No packages found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
