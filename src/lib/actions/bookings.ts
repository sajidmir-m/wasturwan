"use server"

import { createClient, createAnonymousClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBooking(formData: {
  packageId?: string | null
  packageLabel?: string | null
  name: string
  email: string
  phone: string
  date: string
  persons: number
  message?: string
}) {
  // Use anonymous client for public booking creation
  // This ensures RLS policies work consistently across all devices/browsers
  // regardless of cached auth sessions
  const supabase = createAnonymousClient()

  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.persons) {
      return { error: 'All required fields must be filled' }
    }

    // Work out which package to attach (by id or by label), if any.
    let resolvedPackageId: string | null = formData.packageId ?? null

    // If no explicit id but we have a label from the website form, try to find the package by title.
    // Use anonymous client for package lookup as well to ensure consistency
    if (!resolvedPackageId && formData.packageLabel) {
      const { data: pkg, error: pkgError } = await supabase
        .from('packages')
        .select('id, title')
        .ilike('title', formData.packageLabel)
        .maybeSingle()

      if (!pkgError && pkg) {
        resolvedPackageId = pkg.id
      }
    }

    // If we have a package id at this point, validate that it exists.
    if (resolvedPackageId) {
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('id, title')
        .eq('id', resolvedPackageId)
        .single()

      if (packageError || !packageData) {
        return { error: 'Package not found' }
      }
    }

    // Insert booking - user_id will be null for anonymous bookings
    // The anonymous client ensures no auth session is used
    const insertData = {
      package_id: resolvedPackageId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      persons: parseInt(formData.persons.toString()),
      message: formData.message?.trim() || null,
      status: 'pending' as const,
      // user_id is omitted - will default to null in database
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      // Enhanced error logging for debugging
      console.error('Booking creation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        insertData,
      })
      
      // Check for RLS-specific errors
      if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        console.error('RLS Policy Error - This indicates the Supabase RLS policy may not be correctly configured.')
        return { 
          error: 'Unable to submit booking. Please ensure all required fields are filled and try again.' 
        }
      }
      
      return { error: error.message || 'Failed to create booking' }
    }

    revalidatePath('/admin/bookings')
    return { data, error: null }
  } catch (err: any) {
    console.error('Unexpected error creating booking:', err)
    return { error: err.message || 'An unexpected error occurred' }
  }
}

export async function getBookings() {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { data: null, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (
          id,
          title,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return { data: null, error: error.message }
    }

    // Transform data to include package name and calculate total amount.
    // If there is no linked package, keep name but mark as custom and leave amount as 0.
    const transformedData = data?.map(booking => {
      let packageName = booking.packages?.title as string | undefined
      const packagePrice = booking.packages?.price || 0

      if (!packageName) {
        // Try to infer from the message if user came via the website booking form
        if (booking.message && booking.message.includes('Preferred package:')) {
          const match = booking.message.match(/Preferred package:\s*(.+)/)
          if (match && match[1]) {
            packageName = match[1].split('\n')[0].trim()
          }
        }
      }

      return {
        ...booking,
        packageName: packageName || 'Custom Booking',
        packagePrice,
        totalAmount: packagePrice * booking.persons
      }
    }) || []

    return { data: transformedData, error: null }
  } catch (err: any) {
    console.error('Unexpected error fetching bookings:', err)
    return { data: null, error: err.message || 'Failed to fetch bookings' }
  }
}

export async function getBookingById(id: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { data: null, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (
          id,
          title,
          price,
          description,
          location,
          duration
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return {
      data: {
        ...data,
        packageName: data.packages?.title || 'Package Not Found',
        packagePrice: data.packages?.price || 0,
        totalAmount: (data.packages?.price || 0) * data.persons
      },
      error: null
    }
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch booking' }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/bookings')
    return { error: null }
  } catch (err: any) {
    return { error: err.message || 'Failed to update booking status' }
  }
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/bookings')
    return { error: null }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete booking' }
  }
}
