
import React, { useState } from 'react';
import { ArrowLeft, Menu, X, Heart, PawPrint, Scissors, Home, Scroll } from 'lucide-react';
import { ViewState } from '../types';

interface SubPageNavProps {
    onBack: () => void;
    onNavigate: (view: ViewState) => void;
    currentPage: 'adopt' | 'board' | 'grooming' | 'about';
}

const SubPageNav: React.FC<SubPageNavProps> = ({ onBack, onNavigate, currentPage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'about', label: 'Our Story', icon: Heart, color: 'text-cat-red' },
        { id: 'adopt', label: 'Adopt', icon: PawPrint, color: 'text-cat-blue' }, // Changed Icon to PawPrint variety if needed, keeping simple
        { id: 'board', label: 'Stay & Play', icon: Home, color: 'text-cat-black' }, // Changed Icon
        { id: 'grooming', label: 'Spa & Groom', icon: Scissors, color: 'text-cat-yellow' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-4 border-cat-black px-4 py-3 transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo / Back to Home */}
                <button onClick={onBack} className="flex items-center gap-3 group">
                    <div className="bg-cat-blue p-2 rounded-full border-2 border-cat-black group-hover:scale-110 transition-transform">
                        <ArrowLeft size={20} className="text-cat-black" />
                    </div>
                    <div className="hidden md:flex flex-col leading-none">
                        <span className="text-[10px] font-bold tracking-widest text-cat-red uppercase">Back to</span>
                        <span className="text-lg font-black text-cat-black">CATS & COZY</span>
                    </div>
                </button>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as ViewState)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border-2 ${currentPage === item.id
                                ? `bg-cat-black text-white border-cat-black`
                                : `bg-white hover:bg-gray-100 border-gray-200 hover:border-cat-black`
                                }`}
                        >
                            <item.icon size={18} className={currentPage === item.id ? 'text-white' : item.color} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-cat-black p-4 flex flex-col gap-3 shadow-xl">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { onNavigate(item.id as ViewState); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentPage === item.id
                                ? `bg-cat-black text-white`
                                : `bg-gray-50 hover:bg-gray-100`
                                }`}
                        >
                            <item.icon size={20} className={currentPage === item.id ? 'text-white' : item.color} />
                            {item.label}
                        </button>
                    ))}
                    <hr className="border-gray-200 my-2" />
                    <button onClick={onBack} className="flex items-center gap-3 p-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">
                        <Home size={20} /> Back to Home
                    </button>
                </div>
            )}
        </nav>
    );
};

export default SubPageNav;
