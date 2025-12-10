
import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Adoption from './components/Adoption';
import Boarding from './components/Boarding';
import Admin from './components/Admin';
import { ViewState, Cat, Testimonial, Service, GalleryItem } from './types';
import { CATS as INITIAL_CATS, TESTIMONIALS as INITIAL_TESTIMONIALS, SERVICES as INITIAL_SERVICES, HERO_IMAGE_URL, ABOUT_GALLERY as INITIAL_ABOUT_GALLERY, FACILITY_GALLERY as INITIAL_FACILITY_GALLERY } from './constants';
import { initGitHubStorage } from './utils/githubStorage';
import { loadAllData, saveData, flushPendingSaves } from './utils/dataManager';
import { loadAllSupabaseData, saveSupabaseData, isSupabaseConfigured } from './utils/supabaseDataManager';
import gsap from 'gsap';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('loading');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Lifted State
  const [cats, setCats] = useState<Cat[]>(INITIAL_CATS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [aboutGallery, setAboutGallery] = useState<GalleryItem[]>(INITIAL_ABOUT_GALLERY);
  const [facilityGallery, setFacilityGallery] = useState<GalleryItem[]>(INITIAL_FACILITY_GALLERY);
  const [useSupabase, setUseSupabase] = useState(false);

  // Initialize GitHub Storage on app start
  useEffect(() => {
    // GitHub Configuration - Using environment variables for security
    const GITHUB_CONFIG = {
      owner: (import.meta as any).env.VITE_GITHUB_OWNER || 'tmh98094',
      repo: (import.meta as any).env.VITE_GITHUB_REPO || 'catsncozy',
      token: (import.meta as any).env.VITE_GITHUB_TOKEN || '',
      branch: (import.meta as any).env.VITE_GITHUB_BRANCH || 'main'
    };

    // Check if Supabase is configured first
    const initializeData = async () => {
      const supabaseReady = await isSupabaseConfigured();
      setUseSupabase(supabaseReady);

      if (supabaseReady) {
        console.log('🚀 Using Supabase for data storage');
        // Load data from Supabase
        const data = await loadAllSupabaseData({
          cats: INITIAL_CATS,
          testimonials: INITIAL_TESTIMONIALS,
          services: INITIAL_SERVICES,
          about_gallery: INITIAL_ABOUT_GALLERY,
          facility_gallery: INITIAL_FACILITY_GALLERY
        });
        
        setCats(data.cats);
        setTestimonials(data.testimonials);
        setServices(data.services);
        setAboutGallery(data.about_gallery);
        setFacilityGallery(data.facility_gallery);
      } else {
        console.log('📁 Using GitHub/localStorage for data storage');
        // Fallback to GitHub/localStorage
        if (GITHUB_CONFIG.token) {
          initGitHubStorage(GITHUB_CONFIG);
        }

        const data = await loadAllData({
          cats: INITIAL_CATS,
          testimonials: INITIAL_TESTIMONIALS,
          services: INITIAL_SERVICES
        });
        
        setCats(data.cats);
        setTestimonials(data.testimonials);
        setServices(data.services);

        // Load galleries from localStorage/files
        const aboutLocal = localStorage.getItem('about_gallery');
        const facilityLocal = localStorage.getItem('facility_gallery');
        
        if (aboutLocal) {
          try {
            setAboutGallery(JSON.parse(aboutLocal));
          } catch {
            setAboutGallery(INITIAL_ABOUT_GALLERY);
          }
        }
        
        if (facilityLocal) {
          try {
            setFacilityGallery(JSON.parse(facilityLocal));
          } catch {
            setFacilityGallery(INITIAL_FACILITY_GALLERY);
          }
        }
      }
      
      setIsDataLoaded(true);
    };

    initializeData();
  }, []);

  // Auto-save data whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      if (useSupabase) {
        saveSupabaseData('cats', cats);
      } else {
        saveData('cats', cats);
      }
    }
  }, [cats, isDataLoaded, useSupabase]);

  useEffect(() => {
    if (isDataLoaded) {
      if (useSupabase) {
        saveSupabaseData('testimonials', testimonials);
      } else {
        saveData('testimonials', testimonials);
      }
    }
  }, [testimonials, isDataLoaded, useSupabase]);

  useEffect(() => {
    if (isDataLoaded) {
      if (useSupabase) {
        saveSupabaseData('services', services);
      } else {
        saveData('services', services);
      }
    }
  }, [services, isDataLoaded, useSupabase]);

  useEffect(() => {
    if (isDataLoaded) {
      if (useSupabase) {
        saveSupabaseData('about_gallery', aboutGallery);
      } else {
        saveData('aboutGallery', aboutGallery);
      }
    }
  }, [aboutGallery, isDataLoaded, useSupabase]);

  useEffect(() => {
    if (isDataLoaded) {
      if (useSupabase) {
        saveSupabaseData('facility_gallery', facilityGallery);
      } else {
        saveData('facilityGallery', facilityGallery);
      }
    }
  }, [facilityGallery, isDataLoaded, useSupabase]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    // Flush pending saves when user leaves the page
    const handleBeforeUnload = () => {
      flushPendingSaves();
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Simple custom cursor effect
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      gsap.to(cursor, {
        x: cursorPosition.x,
        y: cursorPosition.y,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  }, [cursorPosition]);

  const handleLoadingComplete = () => {
    setView('home');
  };

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-cat-blue text-cat-black font-sans selection:bg-cat-red selection:text-white">
      {/* Custom Cursor Element */}
      <div 
        id="custom-cursor" 
        className="hidden md:block fixed w-8 h-8 border-2 border-cat-black rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>

      {view === 'loading' && (
        <Loader 
          onComplete={handleLoadingComplete} 
          imageUrl={HERO_IMAGE_URL}
        />
      )}
      
      {view === 'home' && (
        <Hero 
          onNavigate={(v) => navigateTo(v)} 
          cats={cats}
          testimonials={testimonials}
          aboutGallery={aboutGallery}
          facilityGallery={facilityGallery}
        />
      )}

      {view === 'adopt' && (
        <Adoption onBack={() => navigateTo('home')} cats={cats} />
      )}

      {view === 'board' && (
        <Boarding onBack={() => navigateTo('home')} services={services} />
      )}

      {view === 'admin' && (
        <Admin 
          onBack={() => navigateTo('home')} 
          cats={cats}
          setCats={setCats}
          testimonials={testimonials}
          setTestimonials={setTestimonials}
          services={services}
          setServices={setServices}
          aboutGallery={aboutGallery}
          setAboutGallery={setAboutGallery}
          facilityGallery={facilityGallery}
          setFacilityGallery={setFacilityGallery}
        />
      )}
    </div>
  );
};

export default App;
