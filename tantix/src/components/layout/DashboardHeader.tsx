import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import type { UserSession } from '../../types/auth';
import logoLight from '../../assets/1.png';
import logoDark from '../../assets/2.png';

interface DashboardHeaderProps {
  session: UserSession | null;
  theme: 'dark' | 'light';
  onToggleTheme: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onSignOut?: () => void;
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
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Tantix.FX Logo"
            className="h-5 sm:h-6 w-auto object-contain shrink-0"
          />
          {session && (
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-cyan)]">
                  {session.email}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="neu-btn p-2 rounded-xl text-xs text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] cursor-pointer transition-transform duration-300"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {session && (
            <button
              type="button"
              onClick={onSignOut}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-rose)] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
