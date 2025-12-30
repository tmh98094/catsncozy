
import React from 'react';
import { Home, Calendar, Scissors } from 'lucide-react';
import { ViewState } from '../types';

interface FixedBottomNavProps {
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
}

const FixedBottomNav: React.FC<FixedBottomNavProps> = ({ currentView, onNavigate }) => {
    // Don't show on admin or loading
    if (currentView === 'loading' || currentView === 'admin') return null;

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-cat-black/90 backdrop-blur-md text-white rounded-2xl shadow-xl border-2 border-white/20 p-2 flex justify-between items-center px-6">

                <button
                    onClick={() => onNavigate('home')}
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentView === 'home' ? 'text-cat-yellow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Home size={24} fill={currentView === 'home' ? "currentColor" : "none"} />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </button>

                <div className="w-px h-8 bg-gray-600"></div>

                <button
                    onClick={() => onNavigate('grooming')}
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentView === 'grooming' ? 'text-cat-orange' : 'text-gray-400 hover:text-white'}`}
                >
                    <Scissors size={24} />
                    <span className="text-[10px] font-bold uppercase">Groom</span>
                </button>

                <div className="w-px h-8 bg-gray-600"></div>

                <button
                    onClick={() => onNavigate('board')}
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentView === 'board' ? 'text-cat-blue' : 'text-gray-400 hover:text-white'}`}
                >
                    <Calendar size={24} />
                    <span className="text-[10px] font-bold uppercase">Board</span>
                </button>

            </div>
        </div>
    );
};

export default FixedBottomNav;
