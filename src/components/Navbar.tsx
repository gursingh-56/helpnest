import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto tracking-tight">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Radia Logo" className="h-8 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-label text-sm tracking-tight transition-colors duration-300 ${isActive('/') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Features
          </Link>
          <Link 
            to="/privacy" 
            className={`font-label text-sm tracking-tight transition-colors duration-300 ${isActive('/privacy') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className={`font-label text-sm tracking-tight transition-colors duration-300 ${isActive('/terms') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Terms
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
            Download
          </a>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary">menu</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
