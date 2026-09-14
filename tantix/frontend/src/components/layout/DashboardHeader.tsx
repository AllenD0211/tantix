import React from 'react';
import { Calculator, LogOut, Sun, Moon } from 'lucide-react';
import type { UserSession } from '../../types/auth';

interface DashboardHeaderProps {
  session: UserSession;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  session,
  theme,
  onToggleTheme,
  onSignOut,
}) => {
  return (
    <header className="w-full border-b border-[var(--neu-border-subtle)] bg-[var(--neu-bg)]/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-cyan)] shrink-0 shadow-[0_0_15px_var(--accent-cyan-glow)]">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-[var(--neu-text-primary)]">
                TANTIX Trade Outcome Calculator
              </h1>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-emerald)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
                REAL-TIME MATH
              </span>
              {session.isDemo && (
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-amber)]">
                  DEMO SIMULATOR
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--neu-text-secondary)] font-mono-numbers mt-0.5">
              Model margin, profit/loss, and risk/reward before entering real market positions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="neu-btn p-2 rounded-xl text-xs text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-rose)] flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Return to Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
