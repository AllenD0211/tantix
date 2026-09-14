import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--neu-border-subtle)] bg-[var(--neu-bg)]/80 backdrop-blur-sm px-4 py-3.5 text-center text-xs text-[var(--neu-text-muted)] transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
          <span className="flex items-center gap-1.5 text-[var(--neu-text-secondary)]">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--accent-amber)] shrink-0" />
            <span>High-Risk Warning: Forex and CFD derivatives involve substantial risk of loss.</span>
          </span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="font-mono-numbers">Tantix.FX Core v1.1.0</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span>Equinix LD4 London Hub</span>
        </div>
        <p className="text-[10px] text-[var(--neu-text-muted)] opacity-80">
          © {new Date().getFullYear()} Tantix.FX Technologies Ltd. All algorithmic trading calculations are provided for professional risk management modeling.
        </p>
      </div>
    </footer>
  );
};
