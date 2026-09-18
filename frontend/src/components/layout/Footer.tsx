import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--neu-border-subtle)] bg-[var(--neu-bg)]/80 backdrop-blur-sm px-4 py-3.5 text-center text-xs text-[var(--neu-text-muted)] transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
          <span className="font-mono-numbers">Tantix.FX v1.1.0</span>
        </div>
<p className="text-[10px] text-[var(--neu-text-muted)] opacity-80">
  © {new Date().getFullYear()} Tantix.FX. All rights reserved. Trading calculations and risk analysis are provided for informational purposes only and do not constitute financial or investment advice.
</p>
      </div>
    </footer>
  );
};
