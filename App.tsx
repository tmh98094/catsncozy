
import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Adoption from './components/Adoption';
import Boarding from './components/Boarding';
import Admin from './components/Admin';
import { ViewState, Cat, Testimonial, Service, GalleryItem } from './types';
import { CATS as INITIAL_CATS, TESTIMONIALS as INITIAL_TESTIMONIALS, SERVICES as INITIAL_SERVICES, HERO_IMAGE_URL, ABOUT_GALLERY as INITIAL_ABOUT_GALLERY, FACILITY_GALLERY as INITIAL_FACILITY_GALLERY } from './constants';
import { initGitHubStorage } from './utils/githubStorage';
import { loadAllData, saveData } from './utils/dataManager';
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

  // Initialize GitHub Storage on app start
  useEffect(() => {
    // GitHub Configuration - Using environment variables for security
    const GITHUB_CONFIG = {
      owner: import.meta.env.VITE_GITHUB_OWNER || 'tmh98094',
      repo: import.meta.env.VITE_GITHUB_REPO || 'catsncozy',
      token: import.meta.env.VITE_GITHUB_TOKEN || '',
      branch: import.meta.env.VITE_GITHUB_BRANCH || 'main'
    };

    // Only initialize if token is provided
    if (GITHUB_CONFIG.token) {
      initGitHubStorage(GITHUB_CONFIG);
    }

    // Load data from GitHub/localStorage
    loadAllData({
      cats: INITIAL_CATS,
      testimonials: INITIAL_TESTIMONIALS,
      services: INITIAL_SERVICES
    }).then(data => {
      setCats(data.cats);
      setTestimonials(data.testimonials);
      setServices(data.services);
      setIsDataLoaded(true);
    });

    // Load galleries from localStorage first, then try to fetch
    const loadGalleries = async () => {
      // Try localStorage first
      const aboutLocal = localStorage.getItem('aboutGallery');
      const facilityLocal = localStorage.getItem('facilityGallery');
      
      if (aboutLocal) {
        try {
          setAboutGallery(JSON.parse(aboutLocal));
        } catch {
          setAboutGallery(INITIAL_ABOUT_GALLERY);
        }
      } else {
        // Fallback to fetching JSON file
        fetch('/data/aboutGallery.json')
          .then(res => res.json())
          .then(data => setAboutGallery(data))
          .catch(() => setAboutGallery(INITIAL_ABOUT_GALLERY));
      }
      
      if (facilityLocal) {
        try {
          setFacilityGallery(JSON.parse(facilityLocal));
        } catch {
          setFacilityGallery(INITIAL_FACILITY_GALLERY);
        }
      } else {
        fetch('/data/facilityGallery.json')
          .then(res => res.json())
          .then(data => setFacilityGallery(data))
          .catch(() => setFacilityGallery(INITIAL_FACILITY_GALLERY));
      }
    };
    
    loadGalleries();
  }, []);

  // Auto-save to GitHub/localStorage whenever data changes
  useEffect(() => {
    if (isDataLoaded) {
      saveData('cats', cats);
    }
  }, [cats, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      saveData('testimonials', testimonials);
    }
  }, [testimonials, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      saveData('services', services);
    }
  }, [services, isDataLoaded]);

  // Save galleries
  useEffect(() => {
    if (isDataLoaded) {
      saveData('aboutGallery', aboutGallery);
    }
  }, [aboutGallery, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      saveData('facilityGallery', facilityGallery);
    }
  }, [facilityGallery, isDataLoaded]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
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
