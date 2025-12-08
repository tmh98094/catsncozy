// Data Manager - Handles both localStorage and GitHub storage
import { Cat, Testimonial, Service, GalleryItem } from '../types';
import { getGitHubStorage } from './githubStorage';

export type DataType = 'cats' | 'testimonials' | 'services' | 'aboutGallery' | 'facilityGallery';

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
 * Save data to GitHub (with localStorage backup)
 */
export async function saveData<T>(type: DataType, data: T): Promise<boolean> {
  // Always save to localStorage first (instant)
  localStorage.setItem(type, JSON.stringify(data));

  // Then try to save to GitHub
  const github = getGitHubStorage();
  if (github) {
    try {
      const message = `Update ${type} - ${new Date().toLocaleString()}`;
      await github.writeJSON(DATA_PATHS[type], data, message);
      return true;
    } catch (error) {
      console.error(`Error saving ${type} to GitHub:`, error);
      // Don't throw - localStorage save already succeeded
      return false;
    }
  }

  return true; // localStorage save succeeded
}

/**
 * Load all data at once
 */
export async function loadAllData(fallbackData: {
  cats: Cat[];
  testimonials: Testimonial[];
  services: Service[];
}): Promise<{
  cats: Cat[];
  testimonials: Testimonial[];
  services: Service[];
}> {
  const [cats, testimonials, services] = await Promise.all([
    loadData('cats', fallbackData.cats),
    loadData('testimonials', fallbackData.testimonials),
    loadData('services', fallbackData.services)
  ]);

  return { cats, testimonials, services };
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
