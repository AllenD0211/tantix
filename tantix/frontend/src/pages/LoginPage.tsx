import React from 'react';
import { LoginHeader } from '../components/layout/LoginHeader';
import { NeumorphicLogin } from '../components/auth/NeumorphicLogin';
import type { UserSession } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between relative">
      {/* Sleek Top Header for Login (NO currency ticker here, as requested) */}
      <LoginHeader theme={theme} onToggleTheme={onToggleTheme} />

      {/* Main Login View Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
        {/* Subtle Ambient Decorative FX Candlesticks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-around opacity-[0.035]">
          <div className="w-14 h-64 border border-current rounded-lg animate-float-slow" />
          <div
            className="w-16 h-80 border border-current rounded-lg animate-float-slow"
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className="w-12 h-56 border border-current rounded-lg animate-float-slow"
            style={{ animationDelay: '3s' }}
          />
        </div>

        {/* Clean Login Card */}
        <div className="w-full relative z-10 animate-fadeIn">
          <NeumorphicLogin onSuccessLogin={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};
