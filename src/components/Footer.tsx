import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 mt-auto bg-surface border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        <div className="text-lg font-bold text-primary">Radia</div>
        <div className="flex flex-wrap justify-center gap-8 text-on-surface-variant text-sm">
          <Link to="/privacy" className="font-label text-xs tracking-wider uppercase hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="font-label text-xs tracking-wider uppercase hover:text-primary transition-colors">Terms of Service</Link>
          <a href="#" className="font-label text-xs tracking-wider uppercase hover:text-primary transition-colors">Contact Support</a>
          <a href="#" className="font-label text-xs tracking-wider uppercase hover:text-primary transition-colors">Play Store</a>
        </div>
        <div className="text-on-surface-variant/60 text-xs font-label tracking-wider uppercase">
          © {new Date().getFullYear()} Radia Education. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
