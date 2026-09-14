import React from 'react';
import { Sun, Moon, Shield, Wifi } from 'lucide-react';

interface LoginHeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="w-full border-b border-[var(--neu-border-subtle)] bg-[var(--neu-bg)]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-cyan)] shadow-sm">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base text-[var(--neu-text-primary)]">
                TANTIX<span className="text-[var(--accent-cyan)]">.FX</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full neu-inset text-[var(--accent-cyan)] font-mono-numbers">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-[var(--neu-text-muted)] hidden sm:block">
              Institutional FX Gateway
            </p>
          </div>
        </div>

        {/* Right side: Gateway Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-mono-numbers text-[var(--accent-emerald)]">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] font-medium text-[var(--neu-text-secondary)]">LD4 Gateway Online</span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="neu-btn w-9 h-9 rounded-xl flex items-center justify-center text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
