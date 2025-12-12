'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        setIsMenuOpen(false);
        router.push(path);
    };

    return (
      <div className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white text-center py-2 text-sm shadow-lg">
          <p className="flex items-center justify-center gap-2 font-semibold tracking-wide">
            <span className="pill bg-white/15 text-white shadow-sm">Lightning fast</span>
            Rated Excellent on Trustpilot · Best Price Guarantee
          </p>
        </div>
        <header className="backdrop-blur-xl bg-white/80 shadow-[0_12px_50px_rgba(0,0,0,0.12)] border-b border-white/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => router.push('/')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-blue-700">CompareMy</span>
                  <span className="text-2xl font-black text-orange-500">Parkings</span>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">NEW</span>
                </div>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  className="ghost-button"
                  onClick={() => handleNavigation('/help')}
                >
                  Help & Contact
                </button>
                <button
                  className="cta-button"
                  onClick={() => handleNavigation('/manage-booking')}
                >
                  My Bookings
                </button>
              </div>

              {/* Mobile Hamburger Menu - Visible only on mobile */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="text-blue-700 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
              <div className="md:hidden bg-white/95 border border-gray-100 shadow-2xl rounded-xl overflow-hidden mb-3">
                <div className="py-2 space-y-0">
                  <button
                    className="w-full text-left px-4 py-4 text-blue-700 hover:bg-blue-50 transition-colors font-semibold border-b border-gray-100 flex items-center justify-between"
                    onClick={() => handleNavigation('/')}
                  >
                    Home
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    className="w-full text-left px-4 py-4 text-blue-700 hover:bg-blue-50 transition-colors font-semibold border-b border-gray-100 flex items-center justify-between"
                    onClick={() => handleNavigation('/manage-booking')}
                  >
                    My Bookings
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    className="w-full text-left px-4 py-4 text-blue-700 hover:bg-blue-50 transition-colors font-semibold flex items-center justify-between"
                    onClick={() => handleNavigation('/help')}
                  >
                    Help & Contact
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    );
}