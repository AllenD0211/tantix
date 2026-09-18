import React from 'react';
import { NeumorphicLogin } from '../components/auth/NeumorphicLogin';
import type { UserSession } from '../types/auth';

import { Sun, Moon } from 'lucide-react';

export interface LoginProps {
  onLoginSuccess: (session: UserSession) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between relative min-h-[calc(100vh-80px)]">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Login View Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative max-w-7xl mx-auto w-full">
        {/* 2-Column Split Layout */}
        <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-fadeIn">
          {/* Left Side - Header & Hero Pitch */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left mb-6 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset w-fit mx-auto lg:mx-0 text-[var(--accent-cyan)] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
              <span>Institutional Risk Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--neu-text-primary)] tracking-tight leading-[1.15] mb-6">
              Smarter Calculations.<br />
              <span className="text-[var(--accent-cyan)] glow-cyan">
                Clearer Risk Analysis.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--neu-text-secondary)] font-mono-numbers leading-relaxed max-w-lg mx-auto lg:mx-0">
              Model margins, evaluate position risk, and execute trades with real-time institutional precision.
            </p>
          </div>

          {/* Right Side - Neumorphic Login Form */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <NeumorphicLogin theme={theme} onSuccessLogin={onLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
