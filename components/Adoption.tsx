
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Heart, Check } from 'lucide-react';
import { Cat, AdoptionFormData } from '../types';
import { Modal } from './Modal';
import { calculateAge } from '../utils/ageCalculator';

interface AdoptionProps {
  onBack: () => void;
  cats: Cat[];
}

const Adoption: React.FC<AdoptionProps> = ({ onBack, cats }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<AdoptionFormData>({
    name: '', email: '', phone: '', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".adopt-header", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Animate cards
      gsap.fromTo(".cat-card", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", overwrite: true }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAdoptClick = (cat: Cat) => {
    setSelectedCat(cat);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const phoneNumber = "6580565123";
    const text = `*🐈 ADOPTION INQUIRY: ${selectedCat?.name}*
    
Hi, I am interested in adopting ${selectedCat?.name}!

*My Details:*
👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}

*Message:*
${formData.message}

---------------------------
*Cat Info:*
Breed: ${selectedCat?.breed}
Age: ${selectedCat ? calculateAge(selectedCat.dateOfBirth) : ''}
`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show success state in UI
    setIsSubmitted(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-cat-yellow w-full pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cat-yellow/90 backdrop-blur-sm border-b-4 border-cat-black p-4 md:p-6 flex items-center justify-between adopt-header transition-all">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-cat-black p-2 rounded-full hover:bg-cat-black hover:text-white transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-center flex-1">Meet the Crew</h2>
        <div className="w-10"></div>
      </header>

      {/* Marquee Banner */}
      <div className="bg-cat-orange py-3 overflow-hidden border-b-4 border-cat-black transform -rotate-1 mt-4 mb-8">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="text-xl font-black text-white uppercase flex items-center gap-4">
               ADOPT DON'T SHOP <Heart className="fill-current w-5 h-5"/> 
             </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div ref={cardsRef} className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((cat) => (
          <div key={cat.id} className="cat-card group bg-white border-4 border-cat-black rounded-3xl overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
            <div className="relative h-72 overflow-hidden border-b-4 border-cat-black">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-cat-red text-white px-3 py-1 rounded-full font-bold text-sm border-2 border-cat-black rotate-3 shadow-md">
                {calculateAge(cat.dateOfBirth)}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-cat-black px-3 py-1 rounded-full font-bold text-xs border-2 border-cat-black">
                {cat.gender}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-3xl font-black mb-1">{cat.name}</h3>
                    <p className="text-gray-500 font-bold uppercase text-sm">{cat.breed}</p>
                  </div>
                  <div className="bg-cat-blue p-2 rounded-full border-2 border-cat-black">
                    <PawIcon />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.personality.map((trait, idx) => (
                    <span key={idx} className="bg-cat-yellow/30 px-3 py-1 rounded-lg text-xs font-bold border border-cat-black/10 uppercase tracking-wide">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleAdoptClick(cat)}
                className="w-full bg-cat-black text-white font-bold py-3 rounded-xl text-lg hover:bg-cat-orange hover:text-black transition-colors border-2 border-transparent hover:border-cat-black shadow-md active:shadow-none active:translate-y-1"
              >
                ADOPT ME
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adoption Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Adopt ${selectedCat?.name}`}
      >
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cat-black flex-shrink-0">
                <img src={selectedCat?.image} alt={selectedCat?.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-lg">You're inquiring about {selectedCat?.name}</p>
                <p className="text-sm text-gray-500">Great choice! {selectedCat?.name} is {selectedCat?.personality[0]}.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Your Name</label>
              <input 
                required
                type="text" 
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Phone</label>
                <input 
                  required
                  type="tel" 
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium"
                  placeholder="+60..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Why do you want to adopt?</label>
              <textarea 
                required
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none transition-colors font-medium h-32 resize-none"
                placeholder="Tell us about your home and experience with cats..."
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-cat-red text-white font-black py-4 rounded-xl text-lg hover:bg-red-600 transition-colors border-2 border-cat-black shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-1 hover:shadow-none">
              SUBMIT ON WHATSAPP
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-3xl font-black mb-2">Redirecting...</h4>
            <p className="text-gray-600 mb-8">We're taking you to WhatsApp to complete your inquiry for {selectedCat?.name}.</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="bg-cat-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800"
            >
              Back to Browsing
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const PawIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.5 2 9.2 3 9 4.5C8.8 6 9.8 7.2 11.2 7.8C10.8 8.2 10.2 8.5 9.5 8.5C8.8 8.5 8.2 8.2 7.8 7.8C9.2 7.2 10.2 6 10 4.5C9.8 3 8.5 2 7 2C5.5 2 4.2 3 4 4.5C3.8 6 4.8 7.2 6.2 7.8C5.8 8.2 5.2 8.5 4.5 8.5C3.8 8.5 3.2 8.2 2.8 7.8C4.2 7.2 5.2 6 5 4.5C4.8 3 3.5 2 2 2C0.5 2 -0.8 3 -0.6 4.5C-0.4 6 1.8 8.8 3.5 10.5C2.2 11.8 1.5 13.5 1.5 15.5C1.5 19.6 4.9 23 9 23C13.1 23 16.5 19.6 16.5 15.5C16.5 13.5 15.8 11.8 14.5 10.5C16.2 8.8 18.4 6 18.6 4.5C18.8 3 17.5 2 16 2C14.5 2 13.2 3 13 4.5C12.8 6 13.8 7.2 15.2 7.8C14.8 8.2 14.2 8.5 13.5 8.5C12.8 8.5 12.2 8.2 11.8 7.8C13.2 7.2 14.2 6 14 4.5C13.8 3 12.5 2 11 2H12Z" fill="currentColor"/>
  </svg>
);

export default Adoption;
    