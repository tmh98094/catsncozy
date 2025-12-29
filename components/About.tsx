
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ViewState, GalleryItem } from '../types';
import SubPageNav from './SubPageNav';
import { MapPin, Heart, Star, Award } from 'lucide-react';

interface AboutProps {
    onBack: () => void;
    onNavigate: (view: ViewState) => void;
    gallery: GalleryItem[];
}


const About: React.FC<AboutProps> = ({ onBack, onNavigate, gallery }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCat, setActiveCat] = useState<number | null>(null);

    // Use first 4 gallery items for founders section
    const foundingCats = gallery.slice(0, 4).map((item, idx) => ({
        id: item.id,
        name: item.caption || `Founder ${idx + 1}`,
        image: item.image,
        color: ['bg-cat-yellow', 'bg-cat-blue', 'bg-cat-red', 'bg-cat-orange'][idx % 4]
    }));

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-animate", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-white pb-20">
            <SubPageNav onBack={onBack} onNavigate={onNavigate} currentPage="about" />

            {/* Hero Section */}
            <div className="pt-24 pb-12 px-4 text-center max-w-4xl mx-auto">
                <h1 className="about-animate text-5xl md:text-7xl font-black uppercase mb-6 text-cat-black">
                    Our <span className="text-cat-blue">Origin</span> Story
                </h1>
                <p className="about-animate text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
                    It wasn't a business plan. It was a promise made to special cats who changed everything.
                </p>
            </div>

            {/* Interactive Founding Cats Section - Only show if we have images */}
            {foundingCats.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 mb-24">
                    <div className="border-4 border-dashed border-gray-200 rounded-[3rem] p-8 md:p-12 bg-gray-50">
                        <h3 className="text-center font-black uppercase text-2xl mb-12 flex items-center justify-center gap-3">
                            <Award className="text-cat-orange" /> Meet The Founders <Award className="text-cat-orange" />
                        </h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {foundingCats.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="cat-card relative h-[450px] rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden border-4 border-cat-black shadow-lg hover:shadow-2xl hover:scale-105 bg-white"
                                >
                                    {/* Image - Full size */}
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error('Image failed to load:', cat.image);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={() => console.log('Image loaded:', cat.name)}
                                    />

                                    {/* Dark gradient overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                                    {/* Name Label at bottom */}
                                    <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                                        <div className="bg-white border-2 border-cat-black inline-block px-4 py-2 rounded-full font-black text-sm uppercase shadow-lg">
                                            {cat.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

            {/* Full Story Content */}
            <div className="max-w-5xl mx-auto px-4 space-y-16">

                {/* Chapter 1 */}
                <div className="grid md:grid-cols-2 gap-12 items-center about-animate">
                    <div className="order-2 md:order-1 space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                        <h3 className="text-3xl font-black uppercase text-cat-black">The Beginning</h3>
                        <p>
                            Before this space existed, our founder — a cat mom at heart — formed an unexpected bond with stray cats who appeared daily. At the time, she didn’t yet know how to help them fully, but their quiet companionship planted the seed for everything that followed.
                        </p>
                        <p>
                            That experience led her to learn, to adopt, and eventually to become involved in rescue work — helping stray cats heal, build trust, and find safe, loving homes.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="rounded-3xl overflow-hidden border-4 border-cat-black shadow-[8px_8px_0px_0px_#000] rotate-2 relative group">
                            {gallery[0] ? (
                                <>
                                    <img src={gallery[0].image} className="w-full h-auto" alt="Beginning" />
                                    {gallery[0].caption && (
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white font-bold text-center">{gallery[0].caption}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-64 bg-gray-200 flex items-center justify-center font-bold text-gray-400">Image Placeholder</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chapter 2 */}
                <div className="grid md:grid-cols-2 gap-12 items-center about-animate">
                    <div className="order-1">
                        <div className="rounded-3xl overflow-hidden border-4 border-cat-black shadow-[8px_8px_0px_0px_#000] -rotate-2 relative group">
                            {gallery[1] ? (
                                <>
                                    <img src={gallery[1].image} className="w-full h-auto" alt="Experience" />
                                    {gallery[1].caption && (
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white font-bold text-center">{gallery[1].caption}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-64 bg-gray-200 flex items-center justify-center font-bold text-gray-400">Image Placeholder</div>
                            )}
                        </div>
                    </div>
                    <div className="order-2 space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                        <h3 className="text-3xl font-black uppercase text-cat-black">The Realization</h3>
                        <p>
                            Through years of hands-on care, one truth became clear: cats thrive when they are understood on their own terms. They need calm over noise, routine over disruption, and environments designed with their needs in mind.
                        </p>
                        <p>
                            Standard boarding often treats cats like small dogs. We knew there had to be a better way. A place where "scaredy cats" could feel safe, and energetic ones could explore.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex justify-center about-animate">
                    <Heart size={40} className="text-cat-red fill-current animate-bounce" />
                </div>

                {/* Mission Statement */}
                <div className="bg-cat-black text-white p-12 rounded-[3rem] text-center shadow-2xl about-animate">
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-6">Our Promise</h2>
                    <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                        "This is more than just a cat hotel. It is a space shaped by love and rescue experience, created by cat parents, and designed entirely for cats."
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-8 text-cat-yellow font-bold text-lg">
                        <MapPin /> Penang, Malaysia
                    </div>
                </div>

            </div>

        </div>
    );
};

export default About;
