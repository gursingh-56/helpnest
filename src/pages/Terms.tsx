import React from 'react';

export function Terms() {
  return (
    <div className="px-6 max-w-5xl mx-auto w-full">
      {/* Header Section */}
      <header className="mb-20">
        <div className="inline-block px-3 py-1 rounded bg-surface-container-highest border border-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold mb-6">
          Legal Documentation
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-none">
          Terms of <span className="text-primary">Service</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Last updated: October 24, 2023. These terms outline the rules and regulations for the use of Radia's educational radiology software and learning tools.
        </p>
      </header>

      {/* Bento Grid Legal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Side Navigation */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="sticky top-40 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">On this page</div>
            <nav className="flex flex-col gap-3">
              <a href="#user-agreement" className="text-primary hover:text-primary-container transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-sm bg-primary group-hover:scale-125 transition-transform"></span>
                User Agreement
              </a>
              <a href="#intellectual-property" className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-sm bg-outline-variant group-hover:bg-primary transition-colors"></span>
                Intellectual Property
              </a>
              <a href="#liability" className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-sm bg-outline-variant group-hover:bg-primary transition-colors"></span>
                Limitation of Liability
              </a>
              <a href="#governing-law" className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-sm bg-outline-variant group-hover:bg-primary transition-colors"></span>
                Governing Law
              </a>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-9 space-y-16">
          {/* User Agreement Section */}
          <section id="user-agreement" className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded bg-surface-container-high items-center justify-center border border-outline-variant text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">person_check</span>
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">User Agreement</h2>
                <div className="bg-surface-container rounded-lg p-8 border border-outline-variant/30">
                  <p className="font-body text-on-surface-variant leading-relaxed mb-4">
                    By accessing Radia, you acknowledge that you have read, understood, and agreed to be bound by these terms. This interface is designed for educational purposes and radiology positioning training.
                  </p>
                  <ul className="space-y-4 text-on-surface-variant">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Users must understand that this software is strictly for educational use and not for actual patient diagnosis.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Account security is the sole responsibility of the user. Educational progress data should not be manipulated.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Prohibited uses include utilizing the software in clinical settings for diagnostic decision-making.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property Section */}
          <section id="intellectual-property" className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded bg-surface-container-high items-center justify-center border border-outline-variant text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">copyright</span>
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Intellectual Property</h2>
                <div className="bg-surface-container rounded-lg p-8 border border-outline-variant/30">
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    All proprietary 3D anatomical models, positioning guides, and educational materials are the exclusive property of Radia Digital. Users are granted a limited, non-exclusive, non-transferable license to view and interact with educational visualizations through the authorized Radia client.
                  </p>
                  <div className="mt-8 p-6 rounded bg-surface-container-highest/50 border border-primary/20 flex items-center gap-6">
                    <div className="flex-grow">
                      <p className="text-xs font-bold text-primary uppercase tracking-tighter mb-1">Protection Notice</p>
                      <p className="text-sm text-on-surface-variant italic">Trademarks, logos, and service marks displayed on the service are registered and unregistered trademarks of Radia.</p>
                    </div>
                    <div className="w-16 h-16 shrink-0 opacity-20">
                      <span className="material-symbols-outlined text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability Section */}
          <section id="liability" className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded bg-surface-container-high items-center justify-center border border-outline-variant text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Limitation of Liability</h2>
                <div className="bg-surface-container rounded-lg p-8 border border-outline-variant/30">
                  <p className="font-body text-on-surface-variant leading-relaxed uppercase text-xs font-bold tracking-wide border-b border-outline-variant/30 pb-4 mb-4">
                    READ CAREFULLY: THIS SECTION LIMITS OUR LEGAL RESPONSIBILITY.
                  </p>
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    In no event shall Radia Digital, nor its directors, employees, or partners, be liable for any clinical decisions, indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of the educational service in a professional practice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law Section */}
          <section id="governing-law" className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded bg-surface-container-high items-center justify-center border border-outline-variant text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Governing Law</h2>
                <div className="bg-surface-container-highest rounded-lg p-8 border border-primary/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="font-body text-on-surface leading-relaxed">
                      These Terms shall be governed and construed in accordance with the laws of the jurisdiction of Digital Asset Regulation, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in courts located within our primary operational node.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5">
                    <span className="material-symbols-outlined text-[120px]">account_balance</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support CTA */}
          <section className="mt-20 pt-16 border-t border-outline-variant/30">
            <div className="bg-surface-container-high rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/20">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Have questions about our terms?</h3>
                <p className="font-body text-on-surface-variant">Our legal team is available for clarification on data processing and usage rights.</p>
              </div>
              <button className="whitespace-nowrap px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-colors">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
