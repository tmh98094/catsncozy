
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';

interface PageHeaderProps {
    onNavigate: (view: ViewState) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onNavigate }) => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-4 border-cat-black px-4 py-3 transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onNavigate('home')}
                >
                    <span className="text-2xl font-black text-cat-blue font-chewy">cats & cozy</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Main Services */}
                    <button
                        onClick={() => onNavigate('board')}
                        className="font-black text-lg hover:text-cat-blue transition-colors uppercase"
                    >
                        Boarding
                    </button>
                    <button
                        onClick={() => onNavigate('grooming')}
                        className="font-black text-lg hover:text-cat-orange transition-colors uppercase"
                    >
                        Grooming
                    </button>

                    <div className="h-6 w-0.5 bg-gray-300"></div>

                    {/* Back to Home */}
                    <button
                        onClick={() => onNavigate('home')}
                        className="bg-cat-black text-white px-5 py-2 rounded-full font-bold border-2 border-transparent hover:bg-white hover:text-cat-black hover:border-cat-black transition-all shadow-md flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Home
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <button
                        onClick={() => onNavigate('home')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default PageHeader;
