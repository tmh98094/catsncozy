
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint, Heart, Camera, MapPin, Menu, X, Star, Quote, Mail, Home, Activity, Utensils, Sparkles, Shield, ChevronDown, Phone, Clock, Navigation, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import Footer from './Footer';
import { ContactFormData, Cat, Testimonial, GalleryItem, ViewState } from '../types';
import { HERO_IMAGE_URL, FAQ_ITEMS } from '../constants';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
  cats: Cat[];
  testimonials: Testimonial[];
  aboutGallery: GalleryItem[];
  facilityGallery: GalleryItem[];
}

const Hero: React.FC<HeroProps> = ({ onNavigate, cats, testimonials, aboutGallery, facilityGallery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [activeAboutImage, setActiveAboutImage] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
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

    // Scroll Logic for Parallax ONLY
    const handleScroll = () => {
      const scrollY = window.scrollY;
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

  // Carousel Auto-Play Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAboutImage(prev => (prev + 1) % aboutGallery.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [aboutGallery.length]);

  // Testimonials Auto-Play Logic
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setIsContactSubmitted(true), 1000);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const nextSlide = () => {
    setActiveAboutImage(prev => (prev + 1) % aboutGallery.length);
  };

  const prevSlide = () => {
    setActiveAboutImage(prev => (prev - 1 + aboutGallery.length) % aboutGallery.length);
  };

  return (
    <div ref={containerRef} className="w-full bg-white relative">

      {/* --- HEADER --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b-4 border-cat-black px-4 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-2xl font-black text-cat-blue font-chewy">cats & cozy</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* Main Services */}
            <button onClick={() => onNavigate('board')} className="font-black text-lg hover:text-cat-blue transition-colors uppercase">Boarding</button>
            <button onClick={() => onNavigate('grooming')} className="font-black text-lg hover:text-cat-orange transition-colors uppercase">Grooming</button>

            <div className="h-6 w-0.5 bg-gray-300"></div>

            {/* Secondary Items */}
            <button onClick={() => scrollToSection('about')} className="font-medium hover:text-cat-red transition-colors">About</button>
            <button onClick={() => scrollToSection('gallery')} className="font-medium hover:text-cat-red transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('faq')} className="font-medium hover:text-cat-red transition-colors">FAQ</button>
            <button onClick={() => onNavigate('community')} className="font-medium text-gray-500 hover:text-cat-blue transition-colors">Community</button>

            <button onClick={() => setIsContactOpen(true)} className="bg-cat-black text-white px-5 py-2 rounded-full font-bold border-2 border-transparent hover:bg-white hover:text-cat-black hover:border-cat-black transition-all shadow-md">
              Contact Us
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-cat-black p-4 flex flex-col gap-4 shadow-xl">
            {/* Main Services */}
            <button onClick={() => { onNavigate('board'); setIsMobileMenuOpen(false); }} className="text-xl font-black text-cat-blue">Boarding</button>
            <button onClick={() => { onNavigate('grooming'); setIsMobileMenuOpen(false); }} className="text-xl font-black text-cat-orange">Grooming</button>
            <hr className="border-gray-200" />
            {/* Secondary */}
            <button onClick={() => scrollToSection('about')} className="text-lg font-bold">About</button>
            <button onClick={() => scrollToSection('gallery')} className="text-lg font-bold">Gallery</button>
            <button onClick={() => scrollToSection('faq')} className="text-lg font-bold">FAQ</button>
            <button onClick={() => { onNavigate('community'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-600">Community & Care</button>
            <hr className="border-gray-200" />
            <button onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false); }} className="bg-cat-black text-white p-3 rounded-xl font-black text-center">Contact Us</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div id="hero-top" className="relative min-h-[100dvh] w-full overflow-hidden bg-cat-blue flex flex-col justify-center">
        {/* Solid Background with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cat-blue via-[#708dc5] to-cat-blue opacity-90"></div>
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
        </div>

        <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 pt-24 pb-40 md:pt-20 md:pb-10">
          <div className="hero-content text-center space-y-4 md:space-y-6 max-w-4xl mx-auto mb-16 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-cat-black text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-widest shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cat-red animate-pulse"></span>
              OPEN FOR BOOKINGS
            </div>

            <h1
              className="text-6xl xs:text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tight font-chewy whitespace-nowrap"
              style={{ WebkitTextStroke: '3px #1a1a1a', textShadow: '6px 6px 0px #1a1a1a' }}
            >
              CATS <span className="text-[#708dc5]" style={{ WebkitTextStroke: '3px #1a1a1a', textShadow: '6px 6px 0px #1a1a1a' }}>&</span> COZY
            </h1>

            <div className="inline-block bg-white/95 backdrop-blur-md border-4 border-cat-black p-5 md:p-6 rounded-3xl max-w-2xl mx-auto mt-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-transform duration-300">
              <p className="text-lg md:text-2xl font-black text-cat-black leading-tight">
                Premium Boarding & Grooming for Your Feline Friends.
              </p>
            </div>
          </div>

          <div className="hero-content w-full max-w-2xl grid grid-cols-2 gap-4 px-4">
            {/* Boarding - Primary CTA */}
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

            {/* Grooming - Primary CTA */}
            <button
              onClick={() => onNavigate('grooming')}
              className="hero-btn group relative bg-cat-yellow border-4 border-cat-black py-4 md:p-6 rounded-3xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center">
                <Sparkles className="w-6 h-6 text-cat-black mx-auto mb-1" />
                <span className="block text-xl md:text-3xl font-black text-cat-black uppercase leading-none">Groom</span>
                <span className="block text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 mt-1">Spa & Shine</span>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cat-orange rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* --- ABOUT US SECTION (REFRACTORED) --- */}
      <section id="about" ref={aboutRef} className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start">

          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="inline-block bg-cat-blue px-4 py-1 rounded-full border-2 border-cat-black font-bold uppercase text-xs lg:text-sm tracking-wider">
              Est. 2021
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-cat-black leading-none">
              MORE THAN JUST A <span className="text-cat-red">CAT HOTEL.</span>
            </h2>
            <div className="flex items-center gap-2 font-bold text-gray-500 text-sm lg:text-base">
              <MapPin size={20} />
              <span>Penang, Malaysia</span>
            </div>

            <div className="text-lg text-gray-700 leading-relaxed font-medium space-y-4">
              <p>
                Every meaningful journey begins with a meeting that feels anything but accidental.
              </p>
              <p>
                What began as a small home-based boarding space has now grown into a premium boutique retreat created exclusively for cats — thoughtfully designed with comfort, hygiene, enrichment, and emotional wellbeing at its core.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-cat-red font-black uppercase tracking-wider hover:gap-4 transition-all"
              >
                Read Our Full Story <ArrowRight size={20} />
              </button>
            </div>

            {/* Founder's Promise Box */}
            <div className="mt-8 bg-cat-yellow/20 border-l-4 border-cat-black p-6 italic text-gray-800 font-medium rounded-r-2xl">
              <h4 className="font-black uppercase mb-2 not-italic text-sm tracking-wider">Our Founder’s Promise</h4>
              <p className="text-xl">"Every cat entrusted to us will be treated with patience, respect, and genuine care — just as we would care for our own."</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="text-3xl font-black text-cat-orange mb-1">5</div>
                <div className="text-xs font-bold uppercase text-gray-400">Years</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="text-3xl font-black text-cat-blue mb-1">200+</div>
                <div className="text-xs font-bold uppercase text-gray-400">Saved</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="text-3xl font-black text-cat-red mb-1">500+</div>
                <div className="text-xs font-bold uppercase text-gray-400">Families</div>
              </div>
            </div>
          </div>

          {/* Carousel Gallery */}
          <div className="order-1 lg:order-2 w-full lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[3rem] border-4 border-cat-black shadow-[12px_12px_0px_0px_#1a1a1a] overflow-hidden bg-cat-yellow transform rotate-2">
              {aboutGallery.map((item, idx) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 rounded-[3rem] overflow-hidden transition-all duration-700 ease-in-out ${idx === activeAboutImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <img
                    src={item.image}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover rounded-[3rem]"
                  />
                  {/* Gradient Overlay for Caption */}
                  <div className="absolute inset-x-0 bottom-0 px-12 pb-20 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-[3rem] text-center pointer-events-none">
                    {item.caption && <p className="text-white font-bold text-lg drop-shadow-md">{item.caption}</p>}
                  </div>
                </div>
              ))}

              {/* Controls */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 z-20">
                <button onClick={prevSlide} className="bg-white/80 backdrop-blur p-3 rounded-full hover:bg-white text-cat-black">
                  <ChevronDown className="rotate-90 w-6 h-6" />
                </button>
                <div className="flex gap-2 items-end pb-3">
                  {aboutGallery.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === activeAboutImage ? 'w-8 bg-cat-red' : 'w-2 bg-white/50'}`}></div>
                  ))}
                </div>
                <button onClick={nextSlide} className="bg-white/80 backdrop-blur p-3 rounded-full hover:bg-white text-cat-black">
                  <ChevronDown className="-rotate-90 w-6 h-6" />
                </button>
              </div>
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

      {/* --- TESTIMONIALS SECTION (Carousel) --- */}
      <section id="testimonials" className="bg-gradient-to-b from-white to-gray-50 py-20 px-4 border-t-4 border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="scroll-animate text-3xl md:text-5xl font-black mb-12 uppercase">
            Happy Families
          </h3>

          {/* Featured Testimonial */}
          {testimonials.length > 0 && (
            <div className="relative">
              <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 text-cat-blue w-16 h-16 opacity-20" />

              <div className="bg-white p-10 md:p-16 rounded-3xl border-4 border-cat-black shadow-[8px_8px_0px_0px_#1a1a1a] relative">
                <div className="flex flex-col items-center">
                  <img
                    src={testimonials[activeTestimonialIndex]?.image}
                    alt={testimonials[activeTestimonialIndex]?.name}
                    className="w-20 h-20 rounded-full border-4 border-cat-yellow object-cover mb-4 shadow-lg"
                  />
                  <h4 className="font-black text-2xl">{testimonials[activeTestimonialIndex]?.name}</h4>
                  <span className="text-sm text-gray-500 font-medium mb-4">{testimonials[activeTestimonialIndex]?.role}</span>

                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-cat-orange text-cat-orange" />)}
                  </div>

                  <p className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed max-w-2xl">
                    "{testimonials[activeTestimonialIndex]?.feedback}"
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonialIndex(i)}
                    className={`h-3 rounded-full transition-all duration-300 ${i === activeTestimonialIndex ? 'w-10 bg-cat-red' : 'w-3 bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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

      {/* --- COMMUNITY VALUES SECTION --- */}
      <section className="relative py-24 px-4 bg-gray-100 border-t-4 border-cat-black overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="scroll-animate inline-block bg-cat-blue px-6 py-2 rounded-full border-2 border-cat-black font-black uppercase tracking-widest mb-8 shadow-md">
            Community & Care
          </div>

          <h2 className="scroll-animate text-4xl md:text-6xl font-black text-cat-black mb-8 leading-tight">
            MORE THAN JUST A SERVICE.
          </h2>

          <p className="scroll-animate text-xl md:text-2xl font-medium text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            We believe every cat deserves a life shaped by care, patience, and understanding.
            Beyond our boarding and grooming services, we support adoption, rescue, and fostering initiatives that align with our values.
          </p>

          <button
            onClick={() => onNavigate('community')}
            className="scroll-animate bg-cat-black text-white text-xl font-black py-4 px-12 rounded-full border-4 border-cat-black hover:bg-white hover:text-cat-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-2 flex items-center gap-3 mx-auto"
          >
            <Heart className="fill-current" />
            LEARN MORE
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer onNavigate={onNavigate} />

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
                onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
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
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
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
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
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
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
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
