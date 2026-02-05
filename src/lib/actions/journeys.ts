"use server"

import { createClient, createAnonymousClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Get all journeys/packages - public function that works for anonymous users
 * Used for public-facing pages like booking form, packages page, etc.
 */
export async function getJourneys() {
  try {
    // Use anonymous client for public access
    const supabase = createAnonymousClient()
    
    // Fetch only active packages - filter at database level for better performance
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching journeys:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return { data: null, error }
    }

    // If no data, return empty array instead of null
    if (!data || data.length === 0) {
      console.warn('No active packages found in database')
      return { data: [], error: null }
    }

    // Get images for each package (optional - don't fail if images fail)
    const packagesWithImages = await Promise.all(
      data.map(async (pkg) => {
        try {
          const { data: images } = await supabase
            .from('package_images')
            .select('image_url')
            .eq('package_id', pkg.id)
            .limit(1)

          return {
            ...pkg,
            image: images?.[0]?.image_url || pkg.main_image_url || null
          }
        } catch (imgError) {
          // If image fetch fails, just return package without image
          console.warn(`Failed to fetch images for package ${pkg.id}:`, imgError)
          return {
            ...pkg,
            image: pkg.main_image_url || null
          }
        }
      })
    )

    return { data: packagesWithImages, error: null }
  } catch (err: any) {
    console.error('Unexpected error in getJourneys:', err)
    return { data: null, error: { message: err.message || 'Failed to fetch packages' } }
  }
}

export async function getJourneyById(id: string) {
  const supabase = await createClient()
  
  const { data: packageData, error: packageError } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single()

  if (packageError || !packageData) {
    return { data: null, error: packageError }
  }

  const { data: images } = await supabase
    .from('package_images')
    .select('id, image_url')
    .eq('package_id', id)

  return {
    data: {
      ...packageData,
      images: images || []
    },
    error: null
  }
}

export async function createJourney(formData: FormData) {
  const supabase = await createClient()

  // Check if user is admin
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

  const title = formData.get('title') as string
  const price = parseFloat(formData.get('price') as string)
  const days = parseInt(formData.get('days') as string)
  const nights = parseInt(formData.get('nights') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const category = formData.get('category') as string
  const featured = formData.get('featured') === 'true'
  const status = formData.get('status') as string || 'active'
  const mainImage = formData.get('mainImage') as File | null

  // Upload main image if provided
  let mainImageUrl = null
  if (mainImage && mainImage.size > 0) {
    const fileExt = mainImage.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `packages/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('packages')
      .upload(filePath, mainImage)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('packages')
        .getPublicUrl(filePath)
      mainImageUrl = publicUrl
    }
  }

  // Create package
  const { data: packageData, error: packageError } = await supabase
    .from('packages')
    .insert({
      title,
      price,
      days,
      nights,
      duration,
      description,
      location,
      category,
      featured,
      status,
      main_image_url: mainImageUrl,
      itinerary: [],
      inclusions: [],
      exclusions: []
    })
    .select()
    .single()

  if (packageError) {
    return { error: packageError.message }
  }

  // Handle additional images
  const additionalImages = formData.getAll('additionalImages') as File[]
  if (additionalImages.length > 0) {
    const imageUploads = additionalImages
      .filter(img => img.size > 0)
      .map(async (image) => {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `packages/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('packages')
          .upload(filePath, image)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('packages')
            .getPublicUrl(filePath)

          await supabase
            .from('package_images')
            .insert({
              package_id: packageData.id,
              image_url: publicUrl
            })
        }
      })

    await Promise.all(imageUploads)
  }

  revalidatePath('/admin/journeys')
  revalidatePath('/packages')
  return { data: packageData, error: null }
}

export async function updateJourney(id: string, formData: FormData) {
  const supabase = await createClient()

  // Check if user is admin
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

  const title = formData.get('title') as string
  const price = parseFloat(formData.get('price') as string)
  const days = parseInt(formData.get('days') as string)
  const nights = parseInt(formData.get('nights') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const category = formData.get('category') as string
  const featured = formData.get('featured') === 'true'
  const status = formData.get('status') as string
  const mainImage = formData.get('mainImage') as File | null
  const deleteImage = formData.get('deleteImage') === 'true'

  const updateData: any = {
    title,
    price,
    days,
    nights,
    duration,
    description,
    location,
    category,
    featured,
    status
  }

  // Handle image deletion
  if (deleteImage) {
    updateData.main_image_url = null
  }
  // Upload new main image if provided
  else if (mainImage && mainImage.size > 0) {
    const fileExt = mainImage.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `packages/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('packages')
      .upload(filePath, mainImage)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('packages')
        .getPublicUrl(filePath)
      updateData.main_image_url = publicUrl
    }
  }

  const { data, error } = await supabase
    .from('packages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }


  revalidatePath('/admin/journeys')
  revalidatePath('/packages')
  revalidatePath(`/packages/${id}`)
  return { data, error: null }
}

export async function deleteJourney(id: string) {
  const supabase = await createClient()

  // Check if user is admin
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
    .from('packages')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/journeys')
  revalidatePath('/packages')
  return { error: null }
}

export async function deleteJourneyImage(imageId: string) {
  const supabase = await createClient()

  // Check if user is admin
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
    .from('package_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/journeys')
  return { error: null }
}
