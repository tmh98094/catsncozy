// Data Manager - Handles both localStorage and GitHub storage
import { Cat, Testimonial, Service, GalleryItem } from '../types';
import { getGitHubStorage } from './githubStorage';

export type DataType = 'cats' | 'testimonials' | 'services' | 'aboutGallery' | 'facilityGallery';

// Debounced save system to prevent excessive GitHub commits
const pendingSaves = new Map<DataType, any>();
const saveTimeouts = new Map<DataType, NodeJS.Timeout>();
const SAVE_DELAY = 30000; // 30 seconds delay before GitHub save

interface DataPaths {
  cats: string;
  testimonials: string;
  services: string;
  aboutGallery: string;
  facilityGallery: string;
}

const DATA_PATHS: DataPaths = {
  cats: 'data/cats.json',
  testimonials: 'data/testimonials.json',
  services: 'data/services.json',
  aboutGallery: 'data/aboutGallery.json',
  facilityGallery: 'data/facilityGallery.json'
};

/**
 * Load data from GitHub (with localStorage fallback)
 */
export async function loadData<T>(type: DataType, fallbackData: T): Promise<T> {
  const github = getGitHubStorage();

  if (github) {
    try {
      const data = await github.readJSON<T>(DATA_PATHS[type]);
      if (data) {
        // Save to localStorage as cache
        localStorage.setItem(type, JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error(`Error loading ${type} from GitHub:`, error);
    }
  }

  // Fallback to localStorage
  const localData = localStorage.getItem(type);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (error) {
      console.error(`Error parsing ${type} from localStorage:`, error);
    }
  }

  // Final fallback to provided data
  return fallbackData;
}

/**
 * Save data with debouncing to prevent excessive GitHub commits
 */
export async function saveData<T>(type: DataType, data: T): Promise<boolean> {
  // Always save to localStorage first (instant)
  localStorage.setItem(type, JSON.stringify(data));

  // Store pending save data
  pendingSaves.set(type, data);

  // Clear existing timeout for this data type
  const existingTimeout = saveTimeouts.get(type);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Set new timeout for GitHub save
  const timeout = setTimeout(async () => {
    await performGitHubSave(type);
  }, SAVE_DELAY);

  saveTimeouts.set(type, timeout);

  return true; // localStorage save succeeded
}

/**
 * Perform the actual GitHub save
 */
async function performGitHubSave<T>(type: DataType): Promise<boolean> {
  const data = pendingSaves.get(type);
  if (!data) return false;

  const github = getGitHubStorage();
  if (github) {
    try {
      const message = `Update ${type} - ${new Date().toLocaleString()}`;
      await github.writeJSON(DATA_PATHS[type], data, message);

      // Clear pending save
      pendingSaves.delete(type);
      saveTimeouts.delete(type);

      console.log(`✅ Saved ${type} to GitHub`);
      return true;
    } catch (error) {
      console.error(`Error saving ${type} to GitHub:`, error);
      return false;
    }
  }

  return false;
}

/**
 * Force save all pending changes immediately (useful for page unload)
 */
export async function flushPendingSaves(): Promise<void> {
  const promises: Promise<boolean>[] = [];

  for (const [type] of pendingSaves) {
    // Clear timeout and save immediately
    const timeout = saveTimeouts.get(type);
    if (timeout) {
      clearTimeout(timeout);
    }
    promises.push(performGitHubSave(type));
  }

  await Promise.all(promises);
}

/**
 * Load all data at once
 */
export async function loadAllData(fallbackData: {
  cats: Cat[];
  testimonials: Testimonial[];
  services: Service[];
  aboutGallery: GalleryItem[];
  facilityGallery: GalleryItem[];
}): Promise<{
  cats: Cat[];
  testimonials: Testimonial[];
  services: Service[];
  aboutGallery: GalleryItem[];
  facilityGallery: GalleryItem[];
}> {
  const [cats, testimonials, services, aboutGallery, facilityGallery] = await Promise.all([
    loadData('cats', fallbackData.cats),
    loadData('testimonials', fallbackData.testimonials),
    loadData('services', fallbackData.services),
    loadData('aboutGallery', fallbackData.aboutGallery),
    loadData('facilityGallery', fallbackData.facilityGallery)
  ]);

  return { cats, testimonials, services, aboutGallery, facilityGallery };
}

/**
 * Check if GitHub is configured and working
 */
export async function isGitHubConfigured(): Promise<boolean> {
  const github = getGitHubStorage();
  if (!github) return false;

  try {
    return await github.testConnection();
  } catch {
    return false;
  }
}
