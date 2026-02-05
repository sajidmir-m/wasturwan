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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: 'Server configuration error. Please contact support.' }
  }

  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.persons) {
      return { error: 'All required fields must be filled' }
    }

    // Use anonymous client for package lookups only
    const supabase = createAnonymousClient()
    let resolvedPackageId: string | null = formData.packageId ?? null

    // If no explicit id but we have a label from the website form, try to find the package by title.
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

    // Prepare insert data
    const insertData = {
      package_id: resolvedPackageId,
      user_id: null, // Explicitly set to null for anonymous bookings
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      persons: parseInt(formData.persons.toString()),
      message: formData.message?.trim() || null,
      status: 'pending',
    }

    // Use anonymous client for booking creation
    // The client is configured to always operate as anonymous
    const anonymousSupabase = createAnonymousClient()

    // Attempt insert with anonymous client
    // With the database properly configured, this should work
    const { data, error } = await anonymousSupabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      // If RLS error persists, try direct REST API as fallback
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.error('RLS error with Supabase client, trying direct REST API...')
        
        // Direct REST API call - ensure proper PostgREST format
        const restUrl = `${supabaseUrl}/rest/v1/bookings`
        const restResponse = await fetch(restUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Prefer': 'return=representation',
            // Explicitly set role to anon
            'X-Client-Info': 'supabase-js-anon',
          },
          body: JSON.stringify(insertData),
        })

        const restData = await restResponse.json()

        if (!restResponse.ok) {
          console.error('Both Supabase client and REST API failed:', {
            clientError: error,
            restError: restData,
            restStatus: restResponse.status,
            insertData,
          })

          // This is definitely an RLS policy issue at the database level
          return { 
            error: 'Booking submission failed. Please verify RLS policies allow anonymous inserts.' 
          }
        }

        // REST API succeeded
        const insertedData = Array.isArray(restData) ? restData[0] : restData
        revalidatePath('/admin/bookings')
        return { data: insertedData, error: null }
      }

      // Other errors
      console.error('Booking creation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        insertData,
      })
      
      return { error: error.message || 'Failed to create booking' }
    }

    // Success with Supabase client
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
