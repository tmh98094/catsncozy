
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, CheckCircle, Calendar, Star, Check, Image as ImageIcon, ChevronLeft, ChevronRight, Sun, Moon, Info, Clock, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { BookingFormData, Service, ViewState } from '../types';
import SubPageNav from './SubPageNav';

interface BoardingProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  services: Service[]; // Keeping for compatibility, but we will use internal data for new structure
}

// Define specific types for internal use
interface LoftOption {
  id: string;
  title: string;
  halfDayPrice?: string;
  fullDayPrice?: string;
  price?: string;
  capacity: string;
  description: string;
  images: string[];
}

const DAYCARE_OPTIONS: LoftOption[] = [
  {
    id: 'dc-std',
    title: 'Standard Loft',
    halfDayPrice: 'RM30',
    fullDayPrice: 'RM40',
    capacity: '2 cats (Max 3)',
    description: 'Perfect for a quick play date.',
    images: ["https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'dc-deluxe',
    title: 'Deluxe Loft',
    halfDayPrice: 'RM35',
    fullDayPrice: 'RM45',
    capacity: '2 cats (Max 3)',
    description: 'More space for active cats.',
    images: ["https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'dc-sky',
    title: 'Premium Sky Loft',
    halfDayPrice: 'RM45',
    fullDayPrice: 'RM55',
    capacity: '2 cats (Max 3)',
    description: 'The ultimate daycare experience with vertical space.',
    images: ["https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&q=80&w=800"]
  }
];

const BOARDING_OPTIONS: LoftOption[] = [
  {
    id: 'bd-std', title: 'Standard Loft', price: 'RM70', capacity: '2 cats (Max 3)',
    description: 'Cozy and comfortable for a peaceful night.',
    images: ["https://images.unsplash.com/photo-1541781777631-faaf8221835f?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'bd-deluxe', title: 'Deluxe Loft', price: 'RM80', capacity: '2 cats (Max 3)',
    description: 'Extra room to stretch and play.',
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'bd-sky', title: 'Premium Sky Loft', price: 'RM100', capacity: '2 cats (Max 3)',
    description: 'Premium vertical space for climbing lovers.',
    images: ["https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'bd-grand', title: 'Grand Sky Loft', price: 'RM120', capacity: '3 cats (Max 4)',
    description: 'Spacious luxury for larger families.',
    images: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: 'bd-prestige', title: 'Prestige Sky Loft', price: 'RM150', capacity: '4 cats (Max 6)',
    description: 'Our largest, most exclusive suite.',
    images: ["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800"]
  }
];

const Boarding: React.FC<BoardingProps> = ({ onBack, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LoftOption | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'daycare' | 'boarding'>('boarding');

  const [formData, setFormData] = useState<BookingFormData>({
    name: '', catName: '', dates: '', notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".board-hero-img", {
        scale: 1.2, opacity: 0, duration: 1.2, ease: "power2.out"
      });
      gsap.from(".board-animate", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleBookClick = (option: LoftOption) => {
    setSelectedOption(option);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData({ name: '', catName: '', dates: '', notes: '' });
  };

  const handleGalleryClick = (option: LoftOption) => {
    setSelectedOption(option);
    setCurrentGalleryIndex(0);
    setIsGalleryOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct WhatsApp message
    const phoneNumber = "6580565123";
    const serviceType = activeTab === 'daycare' ? 'Daycare' : 'Boarding';

    const text = `*🏨 ${serviceType.toUpperCase()} BOOKING INQUIRY*
    
Hi, I would like to book a ${serviceType} slot!

*Booking Details:*
🏠 Option: ${selectedOption?.title} (${selectedOption?.id})
🐱 Cat Name: ${formData.catName}
📅 Dates: ${formData.dates}

*My Details:*
👤 Owner: ${formData.name}
📝 Notes: ${formData.notes || 'None'}

---------------------------
*Please confirm availability.*
`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white w-full pb-32 md:pb-20">
      {/* Consistent Navbar */}
      <SubPageNav onBack={onBack} onNavigate={onNavigate} currentPage="board" />

      {/* Hero Section - Add top padding for fixed navbar */}
      <div className="relative h-[50vh] overflow-hidden border-b-4 border-cat-black pt-16">
        <img src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&q=80&w=2000" alt="Luxury Cat Hotel" className="board-hero-img w-full h-full object-cover" />
        <div className="absolute inset-0 bg-cat-blue/30 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 border-4 border-cat-black rounded-3xl shadow-[16px_16px_0px_0px_#f58b05] transform -rotate-2">
            <h1 className="text-5xl md:text-7xl font-black text-center text-cat-black uppercase leading-none">Stay<br />& Play</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="board-content max-w-6xl mx-auto px-4 py-16">

        {/* Toggle Switch */}
        <div className="board-animate flex justify-center mb-12">
          <div className="bg-gray-100 p-2 rounded-full border-4 border-cat-black inline-flex">
            <button
              onClick={() => setActiveTab('daycare')}
              className={`px-8 py-3 rounded-full font-black uppercase text-lg transition-all ${activeTab === 'daycare' ? 'bg-cat-yellow text-cat-black shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <div className="flex items-center gap-2"><Sun size={20} /> Daycare</div>
            </button>
            <button
              onClick={() => setActiveTab('boarding')}
              className={`px-8 py-3 rounded-full font-black uppercase text-lg transition-all ${activeTab === 'boarding' ? 'bg-cat-red text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <div className="flex items-center gap-2"><Moon size={20} /> Boarding</div>
            </button>
          </div>
        </div>

        {/* Content Render */}
        <div className="board-animate mb-20">
          {activeTab === 'daycare' ? (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-4xl font-black uppercase mb-4">Daycare Menu</h2>
                <p className="text-xl text-gray-600">Perfect for busy work days or when you need a safe place for your kitty to play.</p>
                <div className="mt-4 flex justify-center gap-4 text-sm font-bold bg-yellow-50 inline-block px-4 py-2 rounded-xl border-2 border-yellow-200">
                  <span>Half Day: up to 4 hours</span>
                  <span className="text-gray-300">|</span>
                  <span>Full Day: up to 8 hours</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {DAYCARE_OPTIONS.map((opt) => (
                  <div key={opt.id} className="bg-white p-6 rounded-3xl border-4 border-cat-black hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                    <h3 className="text-2xl font-black uppercase mb-2">{opt.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{opt.description}</p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border-2 border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-600">Half Day</span>
                        <span className="font-black text-xl">{opt.halfDayPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-600">Full Day</span>
                        <span className="font-black text-xl">{opt.fullDayPrice}</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
                      Capacity: {opt.capacity}
                    </div>
                    <button onClick={() => handleBookClick(opt)} className="w-full bg-cat-black text-white py-3 rounded-xl font-bold uppercase hover:bg-cat-yellow hover:text-cat-black transition-colors border-2 border-transparent hover:border-cat-black">
                      Book Daycare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-4xl font-black uppercase mb-4">Boarding Menu</h2>
                <p className="text-xl text-gray-600">Luxury overnight stays with 24/7 care and premium amenities.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOARDING_OPTIONS.map((opt) => (
                  <div key={opt.id} className="bg-white p-6 rounded-3xl border-4 border-cat-black hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                    <h3 className="text-2xl font-black uppercase mb-2">{opt.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{opt.description}</p>
                    <div className="bg-red-50 rounded-xl p-4 mb-4 border-2 border-red-100 text-center">
                      <span className="font-black text-3xl text-cat-red">{opt.price}</span>
                      <span className="text-sm font-bold text-red-300 block uppercase">per night</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
                      Capacity: {opt.capacity}
                    </p>
                    <button onClick={() => handleBookClick(opt)} className="w-full bg-cat-black text-white py-3 rounded-xl font-bold uppercase hover:bg-cat-red transition-colors border-2 border-transparent hover:border-cat-black">
                      Book Stay
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-center text-sm font-bold text-gray-500 mt-8">
            * Additional Cat: RM10 per cat (within max capacity)
          </div>
        </div>

        {/* Policies Section */}
        <div className="board-animate bg-gray-50 border-4 border-gray-200 rounded-[3rem] p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-cat-blue p-3 rounded-full border-2 border-cat-black">
              <Info size={32} />
            </div>
            <h2 className="text-3xl font-black uppercase">Policies, Terms & Conditions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-sm leading-relaxed text-gray-700">
            <div className="space-y-6">
              <div>
                <h4 className="font-black text-lg mb-2">A. Admission & Health</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-bold">Vaccinations:</span> Must be fully vaccinated. proof required. No sick cats admitted.</li>
                  <li><span className="font-bold">Parasites:</span> Must be flea/tick free. RM30 surcharge if found.</li>
                  <li><span className="font-bold">Behavior:</span> Aggressive cats not accepted. RM30 handling fee for aggressive behavior.</li>
                  <li><span className="font-bold">Kittens:</span> Under 6 months must be fully vaccinated.</li>
                  <li><span className="font-bold">Seniors:</span> Over 12 years need vet clearance note.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-lg mb-2">B. Operational Policies</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-bold">Food:</span> Owners encouraged to provide own food. Premium kibbles supplied if not.</li>
                  <li><span className="font-bold">Family Policy:</span> Private room per family. No sharing with strangers.</li>
                  <li><span className="font-bold">Emergencies:</span> Staff will seek vet care. Owners bear all costs.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-black text-lg mb-2">C. Check-in / Out</h4>
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 space-y-2">
                  <div>
                    <span className="font-bold block text-cat-blue">Daycare</span>
                    10:00 AM – 6:00 PM (Full Day)<br />
                    Half Day blocks: 10-2 or 2-6
                  </div>
                  <div className="h-px bg-gray-100 w-full my-2"></div>
                  <div>
                    <span className="font-bold block text-cat-red">Boarding</span>
                    Check-in: 2:00 PM – 6:00 PM<br />
                    Check-out: 10:00 AM – 12:00 PM
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black text-lg mb-2">D. Booking & Cancellation</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>50% deposit required to confirm. Balance at check-in.</li>
                  <li>Deposits non-refundable upon cancellation.</li>
                  <li>Date transfer allowed with 72h notice (valid 3 months).</li>
                  <li>Less than 72h notice = Deposit Forfeited.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-lg mb-2">E. Acknowledgment</h4>
                <p className="italic">By booking, you confirm you have read and agreed to all policies, accept all fees, and acknowledge that while we exercise reasonable care, Cats & Cozy is not liable for incidental risks.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Book ${selectedOption?.title}`}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`p-4 rounded-xl border mb-4 ${activeTab === 'daycare' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-bold text-gray-800">Booking Request</p>
              <p className="text-sm text-gray-600">Service: <span className="font-bold">{activeTab.toUpperCase()} - {selectedOption?.title}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Your Name</label>
                <input required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium" placeholder="Owner" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Cat's Name</label>
                <input required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium" placeholder="Kitty" value={formData.catName} onChange={e => setFormData({ ...formData, catName: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Dates / Time</label>
              <input required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium" placeholder="e.g. Oct 12 - Oct 20" value={formData.dates} onChange={e => setFormData({ ...formData, dates: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Special Notes / Diet</label>
              <textarea className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cat-black outline-none font-medium h-24 resize-none" placeholder="Any medication or dietary needs?" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
            </div>
            <button type="submit" className="w-full bg-cat-black text-white font-black py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-cat-black shadow-md hover:translate-y-1 hover:shadow-none">
              CONFIRM BOOKING
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-3xl font-black mb-2">Request Sent!</h4>
            <p className="text-gray-600 mb-8">We'll check availability for {selectedOption?.title} and get back to you shortly.</p>
            <button onClick={() => setIsModalOpen(false)} className="bg-cat-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Boarding;
