import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  cats: 'cats',
  testimonials: 'testimonials', 
  services: 'services',
  about_gallery: 'about_gallery',
  facility_gallery: 'facility_gallery'
} as const

export type TableName = keyof typeof TABLES