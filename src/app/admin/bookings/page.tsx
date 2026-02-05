"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Calendar, CheckCircle, XCircle, Clock, Eye, Loader2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { getBookings, updateBookingStatus, deleteBooking } from "@/lib/actions/bookings"
import { cn } from "@/lib/utils"
import { formatDateReadable } from "@/lib/utils/date-format"

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    const { data, error } = await getBookings()
    if (data) {
      setBookings(data)
    } else if (error) {
      console.error('Error loading bookings:', error)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id)
    const { error } = await updateBookingStatus(id, status)
    if (!error) {
      loadBookings()
    } else {
      alert("Error updating status: " + error)
    }
    setUpdatingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    
    setDeletingId(id)
    const { error } = await deleteBooking(id)
    if (!error) {
      loadBookings()
    } else {
      alert("Error deleting booking: " + error)
    }
    setDeletingId(null)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
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
      <div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Bookings Management</h1>
        <p className="text-slate-600">View and manage all customer bookings</p>
      </div>

      {/* Search and Filters */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search bookings by name, email, phone or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 px-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="border-slate-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg">No bookings found</p>
            {bookings.length === 0 && (
              <p className="text-slate-500 text-sm mt-2">Bookings will appear here when customers make reservations.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{booking.name}</h3>
                          <p className="text-lg text-slate-600 mb-2">{booking.packageName}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>Travel Date: {formatDateReadable(booking.date)}</span>
                            </div>
                            <span>•</span>
                            <span>{booking.persons} {booking.persons === 1 ? 'Person' : 'Persons'}</span>
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1 text-xs font-semibold rounded-full capitalize",
                          booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                          booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Contact</p>
                          <p className="text-slate-900 font-medium">{booking.phone}</p>
                          <p className="text-slate-600 text-xs">{booking.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Customer No.</p>
                          <p className="text-slate-900 font-medium">{booking.persons}</p>
                        </div>
                      </div>
                      {booking.message && (
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-500 mb-1">Message:</p>
                          <p className="text-sm text-slate-700">{booking.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      {booking.status === "pending" && (
                        <Button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          disabled={updatingId === booking.id}
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl font-semibold"
                        >
                          {updatingId === booking.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Confirm
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          disabled={updatingId === booking.id}
                          variant="outline"
                          className="w-full rounded-xl border-slate-200 hover:bg-slate-50"
                        >
                          {updatingId === booking.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 mr-2" />
                          )}
                          Mark Complete
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(booking.id)}
                        disabled={deletingId === booking.id}
                        variant="destructive"
                        className="w-full rounded-xl"
                      >
                        {deletingId === booking.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
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

