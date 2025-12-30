
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
    onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-cat-black text-white py-12 pb-32 md:pb-12 px-4 border-t-4 border-white">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h4 className="text-3xl font-black text-cat-yellow font-chewy">CATS & COZY</h4>
                    <p className="text-gray-400">© 2025 Cats & Cozy. Penang, Malaysia.</p>
                </div>
                <div className="flex gap-6 items-center">
                    <a href="#" className="hover:text-cat-blue transition-colors font-bold">Instagram</a>
                    <a href="#" className="hover:text-cat-blue transition-colors font-bold">Facebook</a>
                    <button
                        onClick={() => onNavigate('admin')}
                        className="text-gray-600 hover:text-cat-red transition-colors font-bold text-sm"
                    >
                        Admin Login
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
