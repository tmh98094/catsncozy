
export interface Cat {
  id: number;
  name: string;
  dateOfBirth: string; // ISO date string
  breed: string;
  image: string;
  images?: string[];
  gender: 'Male' | 'Female';
  personality: string[];
}

export interface Service {
  id: number;
  title: string;
  price: string;
  description: string;
  icon: string;
  images: string[];
}

export type ViewState = 'loading' | 'home' | 'about' | 'services' | 'board' | 'grooming' | 'community' | 'admin';

export type Tab = 'cats' | 'testimonials' | 'services' | 'galleries';

export interface AdoptionFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  catName: string;
  dates: string;
  notes: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  feedback: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  caption?: string;
}
