import React from 'react';

export function Privacy() {
  return (
    <div className="relative max-w-4xl mx-auto px-6">
      {/* Ambient Background Glows - specific to Privacy page */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] forest-glow blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] forest-glow opacity-50 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Hero Header */}
      <header className="mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-primary/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Compliance Protocol 2.4.0</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-background mb-4">
          Privacy <span className="text-primary italic">Policy</span>
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed">
          Last updated: October 24, 2024. At Radia, we believe privacy is the backbone of digital autonomy. This document outlines how we treat your data as a sacred asset within our educational ecosystem.
        </p>
      </header>

      {/* Legal Sections */}
      <div className="grid grid-cols-1 gap-8 relative z-10">
        {/* Introduction */}
        <section className="group relative p-8 rounded-xl bg-surface-container-low border border-white/5 transition-all duration-300 hover:border-primary/30">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h2 className="font-headline text-2xl font-bold text-primary mb-2">01. Introduction</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Scope & Reach</p>
            </div>
            <div className="md:w-2/3">
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Radia ("we", "us", "our") is dedicated to protecting your privacy. This policy describes our practices regarding the information we collect through our software, educational modules, and associated learning services.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                By engaging with the Radia ecosystem, you agree to the educational protocols and data governance standards defined within this framework. Note that we do not collect or process any real patient data.
              </p>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="group relative p-8 rounded-xl bg-surface-container-low border border-white/5 transition-all duration-300 hover:border-primary/30">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h2 className="font-headline text-2xl font-bold text-primary mb-2">02. Data Collection</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Input Vectors</p>
            </div>
            <div className="md:w-2/3">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-on-surface mb-2">Usage Data</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    We collect technical information about your device and interaction metrics to ensure our 3D anatomical models and positioning simulations run smoothly on your hardware.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-surface-container border border-white/5 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary mb-2 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Learning Progress</p>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-container border border-white/5 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary mb-2 text-3xl">analytics</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Usage Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Your Data */}
        <section className="group relative p-8 rounded-xl bg-surface-container-low border border-white/5 transition-all duration-300 hover:border-primary/30">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h2 className="font-headline text-2xl font-bold text-primary mb-2">03. Usage</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Processing Logic</p>
            </div>
            <div className="md:w-2/3">
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="text-primary mt-1 select-none">
                    <svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                    </svg>
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Optimizing the 3D anatomical rendering engine for your specific hardware architecture.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary mt-1 select-none">
                    <svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                    </svg>
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Providing educational insights and tracking your progress through positioning modules.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary mt-1 select-none">
                    <svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                    </svg>
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Enforcing system integrity and preventing unauthorized access to premium educational content.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="relative overflow-hidden p-12 rounded-2xl glass-card text-center mt-8">
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-headline text-3xl font-bold text-on-background mb-4">Contact Us</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Questions regarding our data protocols? Reach out to our Privacy Node for an immediate clarification on our security architecture.
            </p>
            <a href="mailto:privacy@radia.digital" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-full font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">alternate_email</span>
              privacy@radia.digital
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
