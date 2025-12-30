
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Scissors, Droplets, Wind, Sparkles, Shield, AlertTriangle, Info } from 'lucide-react';
import { ViewState } from '../types';
import SubPageNav from './SubPageNav';
import PageHeader from './PageHeader';
import Footer from './Footer';
import { Modal } from './Modal';

interface GroomingProps {
    onBack: () => void;
    onNavigate: (view: ViewState) => void;
}

const Grooming: React.FC<GroomingProps> = ({ onBack, onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        catName: '',
        date: '',
        serviceType: 'Basic Groom'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const phoneNumber = "6580565123";
        const text = `*🧖‍♀️ GROOMING APPOINTMENT*
        
Hi, I would like to book a grooming session!

*Details:*
✂️ Service: ${formData.serviceType}
🐱 Cat Name/Breed: ${formData.catName}
📅 Preferred Date: ${formData.date}

*My Info:*
👤 Name: ${formData.name}

---------------------------
*Please confirm availability.*`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
        setIsSubmitted(true);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".groom-animate", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-white w-full pb-32 md:pb-20">
            {/* Desktop Header */}
            <PageHeader onNavigate={onNavigate} />
            {/* Mobile Navbar */}
            <SubPageNav onBack={onBack} onNavigate={onNavigate} currentPage="grooming" />

            {/* Hero Section - Add top padding for fixed navbar */}
            <div className="relative h-[40vh] bg-cat-yellow border-b-4 border-cat-black flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="text-center z-10 px-4 mt-12">
                    <h1 className="groom-animate text-5xl md:text-7xl font-black text-cat-black uppercase mb-4">
                        Spa & Groom
                    </h1>
                    <p className="groom-animate text-xl font-bold max-w-2xl mx-auto">
                        Where hygiene meets happiness. A premium spa experience designed entirely for cats.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

                {/* Philosophy */}
                <section className="groom-animate text-center">
                    <div className="inline-block bg-cat-blue px-6 py-2 rounded-full border-2 border-cat-black font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_#000]">
                        Our Philosophy
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800">
                        All grooming services are performed with care, expertise, and the welfare of your cat as our top priority. Each treatment is designed to provide comfort, hygiene, and a premium spa experience.
                    </p>
                </section>

                {/* Pricing Menu */}
                <section className="groom-animate bg-white rounded-3xl border-4 border-cat-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#000]">
                    <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
                        <Scissors className="w-8 h-8" /> Grooming Menu
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm border-b-2 border-gray-100 pb-2">Basic Rates</h3>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Short coat kitten</span>
                                <span>RM60</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Long coat kitten</span>
                                <span>RM70</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Short coat adult</span>
                                <span>RM80</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Long coat adult</span>
                                <span>RM100</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm border-b-2 border-gray-100 pb-2">Add-Ons</h3>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Large breed (&gt;6kg)</span>
                                <span>+RM30</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Medicated Shampoo</span>
                                <span>+RM30</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Dematting</span>
                                <span>RM10 - RM50</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                        <h4 className="font-black text-lg mb-4 uppercase">Premium Full Groom Includes:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm font-medium text-gray-700">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Assessment</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Nail Clipping</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Eye & Ear Cleaning</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Brushing</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Paw Trimming</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Sanitary Trim</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Degreasing</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Bubble Bath</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Treatment Shampoo</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Conditioner</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Blow-dry</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cat-red rounded-full"></div> Paw Balm</div>
                        </div>
                    </div>
                </section>

                {/* Rituals */}
                <section className="groom-animate">
                    <h2 className="text-3xl font-black uppercase mb-8 text-center">Spa Rituals</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: "Soothing Ritual", desc: "Gently cleanses while restoring natural texture. Leaves coat soft and manageable.", icon: Wind, color: "bg-blue-100" },
                            { title: "Hydrating Ritual", desc: "Deep moisture for dry coats. Replenishes hydration and smoothness.", icon: Droplets, color: "bg-cyan-100" },
                            { title: "Volumizing Ritual", desc: "Strengthens and adds volume to fine coats for a fuller look.", icon: Sparkles, color: "bg-purple-100" },
                            { title: "Shining Ritual", desc: "Smooths the coat, enhances natural shine for a glossy finish.", icon: Sparkles, color: "bg-yellow-100" }
                        ].map((ritual, idx) => (
                            <div key={idx} className={`p-6 rounded-2xl border-4 border-cat-black ${ritual.color} flex gap-4 items-start`}>
                                <div className="bg-white p-3 rounded-xl border-2 border-cat-black">
                                    <ritual.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl mb-1">{ritual.title}</h3>
                                    <p className="text-gray-700 leading-snug">{ritual.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Policies Accordion / List */}
                <section className="groom-animate bg-gray-50 border-4 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                        <Info className="w-6 h-6" /> Important Policies
                    </h2>
                    <div className="space-y-6 text-sm text-gray-700">
                        <div>
                            <h4 className="font-black text-base mb-1">General Notes</h4>
                            <p>Duration varies by coat/behavior. Steps may be modified for cat's welfare. Safety is our top priority.</p>
                        </div>

                        <div>
                            <h4 className="font-black text-base mb-1">Kitten Policy (Under 6 months AND under 4kg)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Must have completed vaccination series.</li>
                                <li>Heavier kittens charged at adult rates.</li>
                                <li>Pre-bath degreasing only for 6mo+ vaccinated cats.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-base mb-1">Flea & Tick Policy</h4>
                            <p>Cats must be parasite-free. Inspection/Handling surcharge of <span className="font-bold">RM30</span> applies if found. May be sent home for treatment.</p>
                        </div>

                        <div>
                            <h4 className="font-black text-base mb-1 text-red-600">Aggressive Cat Policy</h4>
                            <p>Aggressive/highly stressed cats <span className="font-bold">not accepted</span>. If aggression occurs, service stops, RM30 handling fee applies, and owner must collect immediately.</p>
                        </div>


                        <div>
                            <h4 className="font-black text-base mb-1">Liablity</h4>
                            <p>Owners assume risk causing stress/anxiety. We are not liable for pre-existing conditions triggered by grooming.</p>
                        </div>
                    </div>
                </section>

                {/* Book Button */}
                <div className="text-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-cat-black text-white text-xl font-black uppercase py-4 px-12 rounded-full hover:bg-cat-red transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Book Appointment
                    </button>
                </div>

            </div>

            {/* Booking Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Spa Session">
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold uppercase mb-1">Your Name</label>
                            <input
                                required
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-medium focus:border-cat-black focus:outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase mb-1">Cat's Name & Breed</label>
                            <input
                                required
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-medium focus:border-cat-black focus:outline-none"
                                placeholder="Luna (Persian)"
                                value={formData.catName}
                                onChange={e => setFormData({ ...formData, catName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase mb-1">Preferred Date/Time</label>
                            <input
                                required
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-medium focus:border-cat-black focus:outline-none"
                                placeholder="This Saturday, 2pm"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase mb-1">Service Type</label>
                            <select
                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-medium focus:border-cat-black focus:outline-none bg-white"
                                value={formData.serviceType}
                                onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                            >
                                <option value="Basic Groom">Basic Groom</option>
                                <option value="Full Groom">Full Groom</option>
                                <option value="Spa Treatment">Spa Treatment</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-cat-black text-white font-black uppercase py-4 rounded-xl hover:bg-cat-green transition-colors flex items-center justify-center gap-2"
                        >
                            <Scissors size={20} />
                            Request via WhatsApp
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles size={40} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-6">Redirecting you to WhatsApp to finalize your booking...</p>
                        <button onClick={() => { setIsModalOpen(false); setIsSubmitted(false); }} className="text-gray-400 font-bold hover:text-cat-black">
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Footer */}
            <Footer onNavigate={onNavigate} />
        </div>
    );
};

export default Grooming;
