
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint, Heart, Camera, MapPin, Menu, X, Star, Quote, Mail, Home, Activity, Utensils, Sparkles, Shield, ChevronDown, Phone, Clock, Navigation } from 'lucide-react';
import { Modal } from './Modal';
import { ContactFormData, Cat, Testimonial, GalleryItem } from '../types';
import { HERO_IMAGE_URL, FAQ_ITEMS } from '../constants';

interface HeroProps {
  onNavigate: (view: 'adopt' | 'board' | 'admin') => void;
  cats: Cat[];
  testimonials: Testimonial[];
  aboutGallery: GalleryItem[];
  facilityGallery: GalleryItem[];
}

const Hero: React.FC<HeroProps> = ({ onNavigate, cats, testimonials, aboutGallery, facilityGallery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [activeAboutImage, setActiveAboutImage] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '', email: '', subject: 'General Inquiry', message: ''
  });
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  useEffect(() => {
    // GSAP Context for component-scoped animations
    const ctx = gsap.context(() => {
      // Entry animation for Hero Content
      gsap.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        delay: 0.5
      });

      gsap.set(".hero-btn", { opacity: 1 });
      
      // Entry animation for cats
      gsap.from(".hero-cat-standing", {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: "back.out(1.7)"
      });
      
      gsap.from(".hero-cat-reaching", {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: "back.out(1.7)"
      });

    }, containerRef);

    // Scroll Logic for Parallax & About Gallery
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // 1. Hero Parallax
      const heroSection = document.getElementById('hero-top');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (scrollY <= heroHeight) {
          gsap.to(".hero-bg", {
            y: scrollY * 0.5,
            ease: "none",
            duration: 0,
            overwrite: "auto"
          });
          gsap.to(".hero-cat-standing", {
            y: scrollY * 0.8, 
            ease: "none",
            duration: 0,
            overwrite: "auto"
          });
          gsap.to(".hero-cat-reaching", {
            y: scrollY * 0.9,
            ease: "none",
            duration: 0,
            overwrite: "auto"
          });
        }
      }

      // 2. About Gallery Scroll Logic
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        const height = rect.height;
        const top = rect.top;
        const windowHeight = window.innerHeight;

        // Calculate progress of scroll within the sticky container
        if (top <= 0 && rect.bottom > windowHeight) {
            const scrollableDistance = height - windowHeight;
            const scrolled = Math.abs(top);
            const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
            
            const imageIndex = Math.min(
                Math.floor(progress * aboutGallery.length), 
                aboutGallery.length - 1
            );
            setActiveAboutImage(imageIndex);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Scroll Animations for new sections using Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", overwrite: true }
          );
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.scroll-animate');
      animatedElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setIsContactSubmitted(true), 1000);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="w-full bg-white relative">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b-4 border-cat-black px-4 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-cat-blue rounded-full border-2 border-cat-black flex items-center justify-center relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=100&q=80" className="w-full h-full object-cover opacity-80" alt="logo"/>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-widest text-cat-red uppercase">The Boutique Retreat</span>
              <span className="text-xl font-black text-cat-black">CATS & COZY</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('about')} className="font-bold hover:text-cat-red transition-colors">About Us</button>
            <button onClick={() => scrollToSection('features')} className="font-bold hover:text-cat-red transition-colors">Services</button>
            <button onClick={() => scrollToSection('gallery')} className="font-bold hover:text-cat-red transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('faq')} className="font-bold hover:text-cat-red transition-colors">FAQ</button>
            <div className="h-6 w-0.5 bg-gray-200"></div>
            <button onClick={() => onNavigate('adopt')} className="font-bold hover:text-cat-blue transition-colors">Adopt</button>
            <button onClick={() => onNavigate('board')} className="font-bold hover:text-cat-blue transition-colors">Board</button>
            <button onClick={() => setIsContactOpen(true)} className="bg-cat-black text-white px-5 py-2 rounded-full font-bold border-2 border-transparent hover:bg-white hover:text-cat-black hover:border-cat-black transition-all shadow-md">
              Contact Us
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-cat-black p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('about')} className="text-lg font-bold">About Us</button>
            <button onClick={() => scrollToSection('features')} className="text-lg font-bold">Services</button>
            <button onClick={() => scrollToSection('gallery')} className="text-lg font-bold">Gallery</button>
            <button onClick={() => scrollToSection('faq')} className="text-lg font-bold">FAQ</button>
            <hr className="border-gray-200"/>
            <button onClick={() => onNavigate('adopt')} className="text-lg font-bold text-cat-red">Adopt a Cat</button>
            <button onClick={() => onNavigate('board')} className="text-lg font-bold text-cat-blue">Boarding Services</button>
            <button onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false); }} className="bg-cat-black text-white p-3 rounded-xl font-bold text-center">Contact Us</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div id="hero-top" className="relative min-h-[100dvh] w-full overflow-hidden bg-cat-blue flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-cat-blue via-transparent to-transparent z-10 opacity-90"></div>
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <img src={HERO_IMAGE_URL} alt="Cat Licking Paws" className="hero-bg w-full h-full object-cover object-center will-change-transform"/>
        </div>

        <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 pt-24 pb-40 md:pt-20 md:pb-10">
          <div className="hero-content text-center space-y-4 md:space-y-6 max-w-4xl mx-auto mb-16 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-cat-black text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-widest shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cat-red animate-pulse"></span>
              OPEN FOR BOOKINGS
            </div>
            
            <h1 
              className="text-6xl xs:text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tight"
              style={{ WebkitTextStroke: '3px #1a1a1a', textShadow: '6px 6px 0px #1a1a1a' }}
            >
              CATS <span className="text-[#708dc5]" style={{ WebkitTextStroke: '3px #1a1a1a', textShadow: '6px 6px 0px #1a1a1a' }}>&</span><br />COZY
            </h1>
            
            <div className="inline-block bg-white/95 backdrop-blur-md border-4 border-cat-black p-5 md:p-6 rounded-3xl max-w-2xl mx-auto mt-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-transform duration-300">
              <p className="text-lg md:text-2xl font-black text-cat-black leading-tight">
                The Purrfect Place to Board Your Best Friend—and Adopt Your Next.
              </p>
            </div>
          </div>

          <div className="hero-content w-full max-w-lg grid grid-cols-2 gap-4 px-4">
            <button
              onClick={() => onNavigate('adopt')}
              className="hero-btn group relative bg-cat-yellow border-4 border-cat-black py-4 md:p-6 rounded-3xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex flex-col items-center justify-center text-center overflow-hidden"
            >
               <div className="relative z-10 flex flex-col items-center">
                <Heart className="w-6 h-6 fill-current mx-auto mb-1 text-cat-black" />
                <span className="block text-xl md:text-3xl font-black text-cat-black uppercase leading-none">Adopt</span>
                <span className="block text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 mt-1">Find a friend</span>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => onNavigate('board')}
              className="hero-btn group relative bg-cat-red border-4 border-cat-black py-4 md:p-6 rounded-3xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex flex-col items-center justify-center text-center overflow-hidden"
            >
               <div className="relative z-10 flex flex-col items-center">
                <PawPrint className="w-6 h-6 text-white mx-auto mb-1" />
                <span className="block text-xl md:text-3xl font-black text-white uppercase leading-none">Board</span>
                <span className="block text-[10px] md:text-xs font-bold text-white uppercase tracking-wider opacity-80 mt-1">Luxury Stay</span>
              </div>
               <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* --- ABOUT US SECTION WITH STICKY SCROLL GALLERY --- */}
      <section id="about" ref={aboutRef} className="relative bg-white z-10 h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-center">
            {/* 
              Mobile Layout Adjustment: 
              - Used flex-col for mobile.
              - Added specific heights and overflow handling to prevent clipping.
            */}
            <div className="max-w-6xl mx-auto w-full px-4 flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-12 items-center justify-center h-full py-4 lg:py-0">
                
                {/* Text Content - Scrollable on mobile if too tall */}
                <div className="order-2 lg:order-1 w-full max-h-[50vh] lg:max-h-none overflow-y-auto lg:overflow-visible no-scrollbar space-y-4 lg:space-y-6 bg-white/95 p-6 rounded-3xl backdrop-blur-sm lg:bg-transparent lg:p-0 z-20 border-2 border-gray-100 lg:border-none shadow-xl lg:shadow-none">
                    <div className="inline-block bg-cat-blue px-4 py-1 rounded-full border-2 border-cat-black font-bold uppercase text-xs lg:text-sm tracking-wider">
                        Est. 2021
                    </div>
                    <h2 className="text-3xl md:text-7xl font-black text-cat-black leading-none">
                        MORE THAN JUST A <span className="text-cat-red">CAT HOTEL.</span>
                    </h2>
                    <div className="flex items-center gap-2 font-bold text-gray-500 text-sm lg:text-base">
                        <MapPin size={20} />
                        <span>Penang, Malaysia</span>
                    </div>
                    <p className="text-base lg:text-xl text-gray-700 leading-relaxed font-medium">
                        Started in 2021, it's been 5 years of dedication. We are primarily doing Cat Rescue and Boarding in Penang, Malaysia. What began as a small initiative has grown into a community of cat lovers.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 lg:gap-4 pt-2 lg:pt-6">
                        <div className="text-center p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl border-2 border-gray-100">
                        <div className="text-xl lg:text-3xl font-black text-cat-orange mb-1">5</div>
                        <div className="text-[10px] lg:text-xs font-bold uppercase text-gray-400">Years</div>
                        </div>
                        <div className="text-center p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl border-2 border-gray-100">
                        <div className="text-xl lg:text-3xl font-black text-cat-blue mb-1">200+</div>
                        <div className="text-[10px] lg:text-xs font-bold uppercase text-gray-400">Saved</div>
                        </div>
                        <div className="text-center p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl border-2 border-gray-100">
                        <div className="text-xl lg:text-3xl font-black text-cat-red mb-1">500+</div>
                        <div className="text-[10px] lg:text-xs font-bold uppercase text-gray-400">Families</div>
                        </div>
                    </div>
                </div>

                {/* Changing Image Gallery - Order 1 on Mobile (Top) */}
                <div className="order-1 lg:order-2 relative block w-full h-[30vh] lg:h-[600px] flex-shrink-0">
                   {aboutGallery.map((item, idx) => (
                       <div 
                         key={item.id}
                         className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === activeAboutImage ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                       >
                           <div className="absolute inset-0 bg-cat-yellow rounded-[2rem] lg:rounded-[3rem] transform rotate-2 lg:rotate-3 border-4 border-cat-black"></div>
                           <img 
                                src={item.image} 
                                alt={`Gallery ${idx}`} 
                                className="absolute inset-0 w-full h-full object-cover rounded-[2rem] lg:rounded-[3rem] border-4 border-cat-black shadow-xl transform -rotate-2 lg:-rotate-3 transition-transform duration-500"
                            />
                       </div>
                   ))}
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES GRID (Standard Section) --- */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-black text-center mb-12 uppercase">
              Premium Care Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Camera, title: "CCTV Monitoring", desc: "24/7 surveillance for your peace of mind." },
                { icon: Home, title: "Isolated Places", desc: "Private suites ensuring comfort and safety." },
                { icon: Activity, title: "Cat Playground", desc: "Enrichment areas for active play." },
                { icon: Utensils, title: "Food & Litter", desc: "Close monitoring of diet and habits." },
                { icon: Sparkles, title: "Hygiene & Sterilization", desc: "Hospital-grade cleaning protocols." },
                { icon: Shield, title: "Spacious Area", desc: "Room to roam, relax, and be a cat." },
              ].map((feature, idx) => (
                <div key={idx} className="scroll-animate bg-white p-6 rounded-2xl border-4 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#1a1a1a] transition-all">
                  <div className="w-12 h-12 bg-cat-yellow rounded-full border-2 border-cat-black flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-cat-black" />
                  </div>
                  <h4 className="text-xl font-black uppercase mb-2">{feature.title}</h4>
                  <p className="text-gray-600 font-medium text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <div id="testimonials" className="bg-white py-20 px-4 border-t-4 border-gray-100">
         <div className="max-w-7xl mx-auto">
             <h3 className="scroll-animate text-3xl md:text-5xl font-black text-center mb-12 uppercase">
                Happy Families
             </h3>
             <div className="flex overflow-x-scroll gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               {testimonials.map((t, i) => (
                 <div key={i} className="scroll-animate flex-shrink-0 w-[85vw] md:w-[400px] snap-center bg-gray-50 p-8 rounded-3xl border-4 border-gray-200 hover:border-cat-black transition-colors relative">
                    <Quote className="absolute top-6 right-6 text-cat-blue w-10 h-10 opacity-50" />
                    <div className="flex items-center gap-4 mb-6">
                      <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-cat-black object-cover"/>
                      <div>
                        <h4 className="font-bold text-lg leading-none">{t.name}</h4>
                        <span className="text-sm text-gray-500 font-medium">{t.role}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-cat-orange text-cat-orange"/>)}
                    </div>
                    <p className="text-gray-700 italic font-medium">"{t.feedback}"</p>
                 </div>
               ))}
             </div>
         </div>
      </div>

      {/* --- FACILITY GALLERY SECTION --- */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="scroll-animate text-3xl md:text-5xl font-black mb-4 uppercase">
              Our Facility
            </h3>
            <p className="scroll-animate text-xl text-gray-600 max-w-2xl mx-auto">
              Take a peek inside our cat paradise. Every corner is designed for comfort, safety, and fun!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilityGallery.map((item, idx) => (
              <div 
                key={item.id} 
                className="scroll-animate group relative h-80 rounded-3xl overflow-hidden border-4 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[8px_8px_0px_0px_#1a1a1a] hover:-translate-y-2 transition-all duration-300"
              >
                <img 
                  src={item.image} 
                  alt={item.caption || 'Facility'} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white font-black text-xl">{item.caption || 'Our Facility'}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 px-4 bg-cat-yellow border-t-4 border-cat-black">
        <div className="max-w-6xl mx-auto">
          <h3 className="scroll-animate text-3xl md:text-5xl font-black text-center mb-16 uppercase">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Adoption Process */}
            <div className="scroll-animate bg-white p-8 rounded-3xl border-4 border-cat-black shadow-[8px_8px_0px_0px_#1a1a1a]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-cat-red rounded-full border-2 border-cat-black flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <h4 className="text-2xl font-black uppercase">Adoption Process</h4>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Browse & Inquire", desc: "Find your perfect match and submit an inquiry form." },
                  { step: "2", title: "Meet & Greet", desc: "Visit us to meet the cat and see if it's a good fit." },
                  { step: "3", title: "Home Check", desc: "We'll do a quick virtual or in-person home assessment." },
                  { step: "4", title: "Finalize", desc: "Sign papers, pay adoption fee (RM 150-300), take your new friend home!" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-cat-red text-white rounded-full border-2 border-cat-black flex items-center justify-center font-black">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-black text-lg mb-1">{item.title}</h5>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boarding Process */}
            <div className="scroll-animate bg-white p-8 rounded-3xl border-4 border-cat-black shadow-[8px_8px_0px_0px_#1a1a1a]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-cat-blue rounded-full border-2 border-cat-black flex items-center justify-center">
                  <PawPrint className="w-8 h-8 text-cat-black" />
                </div>
                <h4 className="text-2xl font-black uppercase">Boarding Process</h4>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Book Online", desc: "Choose your dates and service tier. We'll confirm availability." },
                  { step: "2", title: "Pre-Check", desc: "Ensure vaccinations are current. Bring vet records on drop-off." },
                  { step: "3", title: "Drop-Off", desc: "Bring your cat, their favorite toy, and any special food/meds." },
                  { step: "4", title: "Enjoy Updates", desc: "Get daily photos/videos. Pick up a happy, well-rested cat!" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-cat-blue text-cat-black rounded-full border-2 border-cat-black flex items-center justify-center font-black">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-black text-lg mb-1">{item.title}</h5>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-20 px-4 bg-white border-t-4 border-cat-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="scroll-animate text-3xl md:text-5xl font-black mb-4 uppercase">
              Frequently Asked Questions
            </h3>
            <p className="scroll-animate text-xl text-gray-600">
              Got questions? We've got answers!
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <div 
                key={faq.id} 
                className="scroll-animate bg-gray-50 border-4 border-gray-200 rounded-2xl overflow-hidden hover:border-cat-black transition-colors"
              >
                <button
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                  className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-black text-lg pr-4">{faq.question}</h4>
                  <ChevronDown 
                    className={`flex-shrink-0 w-6 h-6 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LOCATION & CONTACT INFO SECTION --- */}
      <section className="py-20 px-4 bg-cat-blue border-t-4 border-cat-black">
        <div className="max-w-6xl mx-auto">
          <h3 className="scroll-animate text-3xl md:text-5xl font-black text-center mb-12 uppercase">
            Visit Us
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="scroll-animate h-96 rounded-3xl overflow-hidden border-4 border-cat-black shadow-[8px_8px_0px_0px_#1a1a1a]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127418.23281006948!2d100.19637!3d5.41639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac048a161f277%3A0x881c46462e4e7c43!2sPenang%2C%20Malaysia!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cats & Cozy Location"
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className="scroll-animate space-y-6">
              <div className="bg-white p-6 rounded-2xl border-4 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cat-orange rounded-full border-2 border-cat-black flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl mb-2">Address</h4>
                    <p className="text-gray-700">
                      123 Jalan Kucing Comel,<br />
                      Tanjung Bungah, 11200<br />
                      Penang, Malaysia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border-4 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cat-yellow rounded-full border-2 border-cat-black flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl mb-2">Contact</h4>
                    <p className="text-gray-700">
                      <a href="tel:+60123456789" className="hover:text-cat-red transition-colors font-bold">+60 12-345 6789</a><br />
                      <a href="mailto:hello@catsandcozy.my" className="hover:text-cat-red transition-colors font-bold">hello@catsandcozy.my</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border-4 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cat-red rounded-full border-2 border-cat-black flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl mb-2">Operating Hours</h4>
                    <p className="text-gray-700">
                      <span className="font-bold">Mon - Sun:</span> 9:00 AM - 6:00 PM<br />
                      <span className="text-sm text-gray-500 italic">24/7 care for boarding guests</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ADOPTION ADVOCACY SECTION --- */}
      <section className="relative py-24 px-4 bg-cat-orange border-t-4 border-cat-black overflow-hidden">
        {/* Animated Background Cats */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
           <div className="flex absolute top-10 left-0 animate-marquee gap-20">
              {[...cats, ...cats].map((cat, idx) => (
                <div key={`r1-${idx}`} className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden border-4 border-white transform rotate-3 bg-white flex-shrink-0">
                  <img src={cat.image} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
           </div>
           
           <div className="flex absolute bottom-10 left-0 animate-marquee-reverse gap-24">
              {[...cats, ...cats].reverse().map((cat, idx) => (
                <div key={`r2-${idx}`} className="w-24 h-24 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white transform -rotate-3 bg-white flex-shrink-0">
                  <img src={cat.image} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
           </div>
        </div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cat-red/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="scroll-animate inline-block bg-white text-cat-red px-6 py-2 rounded-full border-2 border-cat-black font-black uppercase tracking-widest mb-8 shadow-md">
            Adopt Don't Shop
          </div>
          
          <h2 className="scroll-animate text-5xl md:text-8xl font-black text-white mb-8 drop-shadow-[4px_4px_0px_#1a1a1a] leading-tight">
            BE THEIR <br/>HERO.
          </h2>
          
          <p className="scroll-animate text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed drop-shadow-sm max-w-2xl mx-auto bg-cat-orange/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/20">
             Stray cats face cold nights, empty stomachs, and constant danger. But beneath the dirt lies a loving soul just waiting for a warm lap.
             <br/><br/>
             When you choose to adopt, you promise them that they will never be lonely again. Be a hero - Adopt don't buy
          </p>

          <button 
            onClick={() => onNavigate('adopt')}
            className="scroll-animate bg-white text-cat-black text-xl font-black py-4 px-12 rounded-full border-4 border-cat-black hover:bg-cat-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-2 flex items-center gap-3 mx-auto"
          >
            <Heart className="fill-current" />
            FIND A FRIEND
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-cat-black text-white py-12 px-4 border-t-4 border-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-black text-cat-yellow mb-2">CATS & COZY</h4>
            <p className="text-gray-400">© 2025 Cats & Cozy. Penang, Malaysia.</p>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-cat-blue transition-colors font-bold">Instagram</a>
            <a href="#" className="hover:text-cat-blue transition-colors font-bold">Facebook</a>
            <button onClick={() => onNavigate('admin')} className="text-gray-600 hover:text-cat-red transition-colors font-bold text-sm">
              Admin Login
            </button>
          </div>
        </div>
      </footer>

      {/* --- CONTACT MODAL --- */}
      <Modal
        isOpen={isContactOpen}
        onClose={() => { setIsContactOpen(false); setIsContactSubmitted(false); }}
        title="Contact Us"
      >
        {!isContactSubmitted ? (
          <form onSubmit={handleContactSubmit} className="space-y-4">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
               <p className="text-sm text-gray-600">Have a question? Want to list a cat for adoption? We'd love to hear from you!</p>
             </div>
             
             <div>
                <label className="block text-sm font-bold uppercase mb-1">Subject</label>
                <select 
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none bg-white font-medium"
                  value={contactForm.subject}
                  onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>List a Cat for Adoption</option>
                  <option>Boarding Question</option>
                  <option>Partnership</option>
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold uppercase mb-1">Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium"
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold uppercase mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium"
                    placeholder="jane@email.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
               </div>
             </div>

             <div>
                <label className="block text-sm font-bold uppercase mb-1">Message</label>
                <textarea 
                  required
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium h-32 resize-none"
                  placeholder="How can we help?"
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                ></textarea>
             </div>

             <button type="submit" className="w-full bg-cat-black text-white font-black py-4 rounded-xl text-lg hover:bg-cat-blue hover:text-black hover:border-cat-black border-2 border-transparent transition-all shadow-md hover:shadow-none translate-y-0 hover:translate-y-1">
               SEND MESSAGE
             </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-3xl font-black mb-2">Message Sent!</h4>
            <p className="text-gray-600 mb-8">Thanks for reaching out. We'll get back to you within 24 hours.</p>
            <button 
              onClick={() => setIsContactOpen(false)}
              className="bg-cat-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Hero;
