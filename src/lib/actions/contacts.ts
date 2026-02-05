"use server"

import { createClient, createAnonymousClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getContacts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getContactById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateContactStatus(id: string, status: string) {
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

  const updateData: any = { status }
  if (status === 'replied') {
    updateData.replied_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('contacts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/contacts')
  return { data, error: null }
}

export async function deleteContact(id: string) {
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
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/contacts')
  return { error: null }
}

// Public function to create contact inquiry
export async function createContact(formData: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  // Use anonymous client for public contact creation
  // This ensures RLS policies work consistently across all devices/browsers
  const supabase = createAnonymousClient()

  // Validate required fields
  if (!formData.name || !formData.name.trim()) {
    return { error: 'Name is required' }
  }
  if (!formData.email || !formData.email.trim()) {
    return { error: 'Email is required' }
  }
  if (!formData.message || !formData.message.trim()) {
    return { error: 'Message is required' }
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject?.trim() || null,
      message: formData.message.trim(),
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    return { error: error.message || 'Failed to create contact inquiry' }
  }

  revalidatePath('/admin/contacts')
  return { data, error: null }
}
