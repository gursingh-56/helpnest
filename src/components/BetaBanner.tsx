import React from 'react';

export function BetaBanner() {
  return (
    <div className="bg-primary-container/20 border-b border-primary/30 text-primary-dim px-6 py-2 text-center text-sm font-medium z-[60] relative backdrop-blur-md">
      <div className="max-w-7xl mx-auto text-on-surface flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary text-sm">construction</span>
          <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
            Radia is currently in beta. You might experience slower performance or minor bugs. Please submit any feedback to help us improve.
          </p>
        </div>
        <button className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4">
          Report Bug <span className="material-symbols-outlined text-sm">arrow_outward</span>
        </button>
      </div>
    </div>
  );
}
