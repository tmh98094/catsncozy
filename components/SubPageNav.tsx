
import React, { useState } from 'react';
import { ArrowLeft, Home, Calendar, Scissors, Heart, HeartHandshake, Shield } from 'lucide-react';
import { ViewState } from '../types';

interface SubPageNavProps {
    onBack: () => void;
    onNavigate: (view: ViewState) => void;
    currentPage: string;
}

const SubPageNav: React.FC<SubPageNavProps> = ({ onBack, onNavigate, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'about', label: 'Our Story', icon: Heart, color: 'text-cat-red' },
        { id: 'community', label: 'Community', icon: HeartHandshake, color: 'text-cat-blue' },
        { id: 'board', label: 'Stay & Play', icon: Home, color: 'text-cat-black' },
        { id: 'grooming', label: 'Spa & Groom', icon: Scissors, color: 'text-cat-yellow' },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-sm px-4 pointer-events-none">

            {/* Expanded Menu */}
            <div className={`
                flex flex-col gap-2 
                transition-all duration-300 ease-out origin-bottom
                ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
            `}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            onNavigate(item.id as ViewState);
                            setIsMenuOpen(false);
                        }}
                        className={`
                            flex items-center gap-4 px-6 py-3 rounded-full shadow-lg border-2
                            bg-white hover:bg-gray-50 active:scale-95 transition-all
                            ${currentPage === item.id ? 'border-cat-black bg-gray-50' : 'border-gray-100'}
                        `}
                    >
                        <div className={`p-2 rounded-full bg-gray-100 ${item.color}`}>
                            <item.icon size={20} className={item.color} />
                        </div>
                        <span className="font-bold text-cat-black text-lg">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Toggle Button */}
            <div className="pointer-events-auto flex items-center gap-3 bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-100">
                <button
                    onClick={onBack}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="h-8 w-[2px] bg-gray-100"></div>

                <div className="flex items-center gap-1 px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as ViewState)}
                            className={`
                                p-3 rounded-full transition-all duration-300
                                ${currentPage === item.id
                                    ? 'bg-cat-black text-white scale-110 shadow-md'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-cat-black'}
                            `}
                        >
                            <item.icon size={20} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubPageNav;
