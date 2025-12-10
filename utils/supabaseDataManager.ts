import { supabase, TABLES, TableName } from './supabase'
import { Cat, Testimonial, Service, GalleryItem } from '../types'

// Type mapping for database operations
type DataTypeMap = {
  cats: Cat[]
  testimonials: Testimonial[]
  services: Service[]
  about_gallery: GalleryItem[]
  facility_gallery: GalleryItem[]
}

/**
 * Load data from Supabase with localStorage fallback
 */
export async function loadSupabaseData<T extends TableName>(
  tableName: T,
  fallbackData: DataTypeMap[T]
): Promise<DataTypeMap[T]> {
  try {
    const { data, error } = await supabase
      .from(TABLES[tableName])
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error(`Error loading ${tableName}:`, error)
      return getFallbackData(tableName, fallbackData)
    }

    if (data && data.length > 0) {
      // Cache in localStorage
      localStorage.setItem(tableName, JSON.stringify(data))
      return data as DataTypeMap[T]
    }

    return getFallbackData(tableName, fallbackData)
  } catch (error) {
    console.error(`Error connecting to Supabase for ${tableName}:`, error)
    return getFallbackData(tableName, fallbackData)
  }
}

/**
 * Save data to Supabase
 */
export async function saveSupabaseData<T extends TableName>(
  tableName: T,
  data: DataTypeMap[T]
): Promise<boolean> {
  try {
    // Always save to localStorage first (instant backup)
    localStorage.setItem(tableName, JSON.stringify(data))

    // Clear existing data and insert new data
    const { error: deleteError } = await supabase
      .from(TABLES[tableName])
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      console.error(`Error clearing ${tableName}:`, deleteError)
    }

    // Insert new data
    const { error: insertError } = await supabase
      .from(TABLES[tableName])
      .insert(data)

    if (insertError) {
      console.error(`Error saving ${tableName}:`, insertError)
      return false
    }

    console.log(`✅ Saved ${tableName} to Supabase`)
    return true
  } catch (error) {
    console.error(`Error saving ${tableName} to Supabase:`, error)
    return false
  }
}

/**
 * Get fallback data from localStorage or provided fallback
 */
function getFallbackData<T extends TableName>(
  tableName: T,
  fallbackData: DataTypeMap[T]
): DataTypeMap[T] {
  const localData = localStorage.getItem(tableName)
  if (localData) {
    try {
      return JSON.parse(localData)
    } catch (error) {
      console.error(`Error parsing ${tableName} from localStorage:`, error)
    }
  }
  return fallbackData
}

/**
 * Load all data at once
 */
export async function loadAllSupabaseData(fallbackData: {
  cats: Cat[]
  testimonials: Testimonial[]
  services: Service[]
  about_gallery: GalleryItem[]
  facility_gallery: GalleryItem[]
}): Promise<{
  cats: Cat[]
  testimonials: Testimonial[]
  services: Service[]
  about_gallery: GalleryItem[]
  facility_gallery: GalleryItem[]
}> {
  const [cats, testimonials, services, about_gallery, facility_gallery] = await Promise.all([
    loadSupabaseData('cats', fallbackData.cats),
    loadSupabaseData('testimonials', fallbackData.testimonials),
    loadSupabaseData('services', fallbackData.services),
    loadSupabaseData('about_gallery', fallbackData.about_gallery),
    loadSupabaseData('facility_gallery', fallbackData.facility_gallery)
  ])

  return { cats, testimonials, services, about_gallery, facility_gallery }
}

/**
 * Check if Supabase is configured and working
 */
export async function isSupabaseConfigured(): Promise<boolean> {
  try {
    const { error } = await supabase.from('cats').select('count', { count: 'exact', head: true })
    return !error
  } catch {
    return false
  }
}