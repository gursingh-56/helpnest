import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BetaBanner } from './BetaBanner';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative selection:bg-primary/30">
      <div className="fixed inset-0 obsidian-grain z-[-1]"></div>
      <div className="fixed inset-0 forest-gradient z-[-2]"></div>
      
      <BetaBanner />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-24">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
