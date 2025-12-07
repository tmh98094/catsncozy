
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, CheckCircle, Calendar, Star, Check, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from './Modal';
import { BookingFormData, Service } from '../types';

interface BoardingProps {
  onBack: () => void;
  services: Service[];
}

const Boarding: React.FC<BoardingProps> = ({ onBack, services }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  
  const [formData, setFormData] = useState<BookingFormData>({
    name: '', catName: '', dates: '', notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image parallax-like feel
      gsap.from(".board-hero-img", {
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      });

      // Content slide up
      gsap.from(".board-content > *", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBookClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData({ name: '', catName: '', dates: '', notes: '' });
  };

  const handleGalleryClick = (service: Service) => {
      setSelectedService(service);
      setCurrentGalleryIndex(0);
      setIsGalleryOpen(true);
  };

  const nextImage = () => {
      if (selectedService && selectedService.images.length > 0) {
          setCurrentGalleryIndex((prev) => (prev + 1) % selectedService.images.length);
      }
  };

  const prevImage = () => {
      if (selectedService && selectedService.images.length > 0) {
          setCurrentGalleryIndex((prev) => (prev - 1 + selectedService.images.length) % selectedService.images.length);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white w-full pb-20">
      {/* Navigation */}
      <div className="absolute top-0 left-0 z-50 p-6 w-full flex justify-between items-center pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto bg-cat-blue border-4 border-cat-black p-3 rounded-full hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <ArrowLeft size={24} className="text-cat-black" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden border-b-4 border-cat-black">
        <img 
          src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Cat Hotel" 
          className="board-hero-img w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cat-blue/30 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 border-4 border-cat-black rounded-3xl shadow-[16px_16px_0px_0px_#FFA239] transform -rotate-2">
                <h1 className="text-5xl md:text-7xl font-black text-center text-cat-black uppercase leading-none">
                    Cat<br/>Vacation
                </h1>
            </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="board-content max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We provide a safe, fun, and relaxing environment for your cats while you are away. It's not just boarding, it's a holiday!</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {services.map((service, idx) => (
                <div key={service.id} className={`relative p-8 rounded-3xl border-4 border-cat-black flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] ${idx === 1 ? 'bg-cat-yellow scale-105 z-10' : 'bg-white'}`}>
                    {idx === 1 && (
                        <div className="absolute -top-5 bg-cat-red text-white px-4 py-1 rounded-full font-bold border-2 border-cat-black uppercase text-sm">Most Popular</div>
                    )}
                    <div className="w-16 h-16 bg-cat-blue rounded-full border-2 border-cat-black flex items-center justify-center mb-6">
                        {service.icon === 'bed' && <Star size={32} />}
                        {service.icon === 'crown' && <Star size={32} className="text-cat-yellow fill-current" />}
                        {service.icon === 'sun' && <Star size={32} />}
                    </div>
                    <h3 className="text-2xl font-black mb-2 uppercase">{service.title}</h3>
                    <div className="text-3xl font-black text-cat-red mb-4">{service.price}</div>
                    <p className="text-gray-700 font-medium mb-6 flex-grow">{service.description}</p>
                    
                    <div className="w-full flex flex-col gap-3">
                        <button 
                            onClick={() => handleGalleryClick(service)}
                            className="w-full py-2 rounded-xl border-2 border-gray-200 font-bold uppercase text-gray-500 hover:text-black hover:border-cat-black transition-colors flex items-center justify-center gap-2"
                        >
                            <ImageIcon size={18} /> View Gallery
                        </button>
                        <button 
                        onClick={() => handleBookClick(service)}
                        className="w-full py-3 rounded-xl border-2 border-cat-black font-bold uppercase transition-colors hover:bg-cat-black hover:text-white"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Features / Why Us */}
        <div className="bg-cat-blue rounded-[3rem] border-4 border-cat-black p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-4xl font-black mb-8 uppercase">Why Choose Cats & Cozy?</h3>
                    <ul className="space-y-4">
                        {[
                            "24/7 Monitoring & Vet on call",
                            "Daily photo updates sent to you",
                            "Climate controlled individual suites",
                            "Interactive play sessions",
                            "Premium organic cat food included"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-cat-black">
                                <CheckCircle className="text-cat-green text-green-500 flex-shrink-0" />
                                <span className="font-bold">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-cat-black rounded-3xl transform translate-x-4 translate-y-4"></div>
                    <div className="relative bg-white rounded-3xl border-4 border-cat-black p-8 flex flex-col items-center justify-center text-center">
                        <Calendar size={64} className="text-cat-orange mb-4" />
                        <h4 className="text-2xl font-black mb-2">Ready to book?</h4>
                        <p className="mb-6">Spots fill up fast during holidays!</p>
                        <button 
                          onClick={() => handleBookClick(services[0])}
                          className="bg-cat-red text-white px-8 py-4 rounded-xl font-black text-xl border-2 border-cat-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all w-full"
                        >
                            CHECK AVAILABILITY
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Book ${selectedService?.title || 'Stay'}`}
      >
         {!isSubmitted ? (
           <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
               <p className="font-bold text-gray-800">Reservation Details</p>
               <p className="text-sm text-gray-600">You are booking: <span className="font-bold text-cat-red">{selectedService?.title}</span> at {selectedService?.price}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Your Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                  placeholder="Owner"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Cat's Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                  placeholder="Kitty"
                  value={formData.catName}
                  onChange={e => setFormData({...formData, catName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Dates Required</label>
              <input 
                required
                type="text" 
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                placeholder="e.g. Oct 12 - Oct 20"
                value={formData.dates}
                onChange={e => setFormData({...formData, dates: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Special Notes / Diet</label>
              <textarea 
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium h-24 resize-none"
                placeholder="Any medication or dietary needs?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-cat-black text-white font-black py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-cat-black shadow-[4px_4px_0px_0px_#8CE4FF] hover:translate-y-1 hover:shadow-none">
              CONFIRM BOOKING
            </button>
          </form>
         ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-3xl font-black mb-2">You're Booked!</h4>
            <p className="text-gray-600 mb-8">We can't wait to see {formData.catName}! We've sent a confirmation email to you.</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="bg-cat-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800"
            >
              Close
            </button>
          </div>
         )}
      </Modal>

      {/* Gallery Modal */}
      <Modal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={`${selectedService?.title} Gallery`}
      >
          <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 rounded-xl overflow-hidden mb-4 border-2 border-cat-black">
              {selectedService && selectedService.images.length > 0 ? (
                  <>
                      <img 
                        src={selectedService.images[currentGalleryIndex]} 
                        alt="Room view" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                          <button onClick={prevImage} className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
                              <ChevronLeft />
                          </button>
                          <button onClick={nextImage} className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
                              <ChevronRight />
                          </button>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                          {currentGalleryIndex + 1} / {selectedService.images.length}
                      </div>
                  </>
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                      No images available
                  </div>
              )}
          </div>
          <button 
              onClick={() => { setIsGalleryOpen(false); handleBookClick(selectedService!); }}
              className="w-full bg-cat-red text-white font-black py-4 rounded-xl text-lg hover:bg-red-600 border-2 border-cat-black"
            >
              BOOK THIS ROOM
          </button>
      </Modal>
    </div>
  );
};

export default Boarding;
