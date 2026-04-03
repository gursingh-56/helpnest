import React from 'react';

export function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="px-8 pt-16 pb-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-8 leading-[0.95]">
          Master <span className="text-gradient">X-Ray Positioning</span> with Interactive Clarity
        </h1>
        <div className="flex gap-6 mb-16 relative z-10">
          <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" className="btn-primary text-on-primary px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 active:scale-95 transition-transform cursor-pointer">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
            Download
          </a>
        </div>
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-150"></div>
          <div className="mobile-frame">
            <img alt="High-fidelity mobile app interface of Radia showing bioluminescent skeletal diagnostic data and medical telemetry in an Obsidian Forest theme" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu20o96xOzcZ8T_oeVTYdT3R_UK4sq-MIT3v-MvmbpKBzad5sIvgrHe57mozPrgERT-uEEB5gt8DjWeESNWjV8Fie1UW5KphVWp3Ay9qFFKqQzShNNca6HgsFIz03wpL_8aS4Qcz7a23EJU4KxYSz6LwdW9gDV4UQqv6h-J-zV6u48HiEOx1HTFbCEPLOazU4ight7UunebSuQ-1OqiSJi7BIjO1SeIaDHhkzRds9miwkAtY740Dp2U699B6ohAO7RO5zv8RqeBXco"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101412] via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-10 left-6 right-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xs">analytics</span>
                </div>
                <div className="text-[10px] font-bold tracking-widest text-primary uppercase">Live Analysis</div>
              </div>
              <h4 className="text-lg font-bold mb-2">Neural Load: 84%</h4>
              <div className="h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="px-8 py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <label className="text-xs font-label uppercase tracking-widest text-primary mb-2 block">Educational Tools</label>
            <h2 className="text-4xl font-bold tracking-tight">Precision Engineered Learning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interactive Positioning */}
            <div className="bg-surface-container p-8 rounded-xl border-b-2 border-primary/20 hover:bg-surface-bright transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>360</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Positioning</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Learn exact patient positioning and central ray angles for all standard X-ray projections.</p>
            </div>
            {/* Anatomical Overlays */}
            <div className="bg-surface-container p-8 rounded-xl border-b-2 border-primary/20 hover:bg-surface-bright transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>accessibility_new</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Anatomical Overlays</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Visualize skeletal structures beneath the skin to understand the 'why' behind each position.</p>
            </div>
            {/* Simulated Exposures */}
            <div className="bg-surface-container p-8 rounded-xl border-b-2 border-primary/20 hover:bg-surface-bright transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>radiology</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Simulated Exposures</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Practice collimation and exposure settings in a risk-free virtual environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-32 bg-surface">
        <div className="max-w-4xl mx-auto text-center bg-primary-container/20 p-16 rounded-2xl border border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)", backgroundSize: "24px 24px"}}></div>
          <h2 className="text-5xl font-bold tracking-tighter mb-8 relative z-10">Step into the Light.</h2>
          <div className="relative z-10">
            <a href="https://github.com/gursingh-56/helpnest/releases/download/v1.0.1/radia.apk" download className="btn-primary text-on-primary px-10 py-5 rounded-md font-bold text-xl active:scale-95 transition-transform">Get Started</a>
          </div>
        </div>
      </section>
    </div>
  );
}
