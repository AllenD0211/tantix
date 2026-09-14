import React, { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  Server,
  ShieldCheck,
} from 'lucide-react';
import type { UserSession } from '../../types/auth';
import { evaluatePasswordStrength } from '../../utils/passwordPolicy';

interface NeumorphicLoginProps {
  onSuccessLogin?: (userData: UserSession) => void;
}

export const NeumorphicLogin: React.FC<NeumorphicLoginProps> = ({ onSuccessLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [server, setServer] = useState('tantix-live-01');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength derived via pure domain utility
  const pwdStrength = evaluatePasswordStrength(password);

  // Quick 1-Click Demo Autofill
  const handleQuickDemo = () => {
    setEmail('trader.pro@tantix.fx');
    setPassword('TantixAlpha2026!');
    setServer('tantix-demo-ecn');
    setErrorMessage('');
    setSuccessMessage('Demo credentials autofilled.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both Trader ID and Password.');
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      setLoadingStep('Authenticating with London LD4 Gateway...');
      await new Promise((resolve) => setTimeout(resolve, 450));

      setLoadingStep('Verifying 256-bit encryption session...');
      await new Promise((resolve) => setTimeout(resolve, 450));

      setSuccessMessage(
        activeTab === 'login'
          ? 'Terminal authorized. Redirecting to workspace...'
          : 'Demo Account provisioned! Loading workspace...'
      );

      setTimeout(() => {
        setIsLoading(false);
        if (onSuccessLogin) {
          onSuccessLogin({
            email,
            server,
            isDemo: server.includes('demo') || activeTab === 'register',
            balance: 100000.0,
            equity: 102450.0,
            freeMargin: 98450.0,
            marginLevel: 1420,
            activeRiskPercent: 1.0,
          });
        }
      }, 500);
    } catch {
      setIsLoading(false);
      setErrorMessage('Connection failed. Please retry.');
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-6">
      {/* Modern Card Container */}
      <div className="neu-raised-card p-6 sm:p-8 relative overflow-hidden transition-all duration-200">
        {/* Subtle Ambient Background Accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-[var(--accent-cyan-glow)] blur-3xl pointer-events-none opacity-40" />

        {/* Brand Crest & Title */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl neu-convex flex items-center justify-center text-[var(--accent-cyan)] mb-3 shadow-sm transition-transform hover:scale-105 duration-200">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-black tracking-tight text-[var(--neu-text-primary)]">
              TANTIX<span className="text-[var(--accent-cyan)]">.FX</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full neu-inset text-[var(--accent-cyan)] font-mono-numbers">
              TERMINAL
            </span>
          </div>
          <p className="text-xs text-[var(--neu-text-muted)] mt-1">
            Institutional Forex & Risk Management Engine
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="neu-inset-pill p-1 flex items-center mb-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'login'
                ? 'neu-convex text-[var(--accent-cyan)]'
                : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
            }`}
          >
            Trader Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'register'
                ? 'neu-convex text-[var(--accent-cyan)]'
                : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
            }`}
          >
            Create Demo Account
          </button>
        </div>

        {/* 1-Click Demo Quick Fill */}
        <div className="mb-5 p-2.5 neu-inset rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg neu-convex flex items-center justify-center text-[var(--accent-amber)] shrink-0">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[var(--neu-text-primary)] leading-tight">
                Demo Environment
              </div>
              <div className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
                $100,000 Simulated Capital
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-bold text-[var(--accent-cyan)] hover:text-[var(--neu-text-primary)] cursor-pointer"
          >
            Autofill
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl neu-inset border border-[var(--accent-rose)]/40 flex items-start gap-2 text-xs text-[var(--accent-rose)] animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl neu-inset border border-[var(--accent-emerald)]/40 flex items-start gap-2 text-xs text-[var(--accent-emerald)] animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {/* Server Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--neu-text-secondary)] mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                Trading Gateway
              </span>
              <span className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">Equinix LD4</span>
            </label>
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl neu-input-field cursor-pointer font-mono-numbers"
            >
              <option value="tantix-live-01">Tantix-Live-01 (Direct ECN)</option>
              <option value="tantix-demo-ecn">Tantix-Demo-ECN (Sandbox)</option>
              <option value="tantix-ny4-backup">Tantix-NY4-Failover (Secured)</option>
            </select>
          </div>

          {/* Email / Trader ID */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--neu-text-secondary)] mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span>Trader ID / Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@tantix.fx"
              autoComplete="username"
              required
              className="w-full px-3 py-2 text-xs rounded-xl neu-input-field font-mono-numbers placeholder:text-[var(--neu-text-muted)]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[var(--neu-text-secondary)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                <span>Security Password</span>
              </label>
              {password && pwdStrength.label && (
                <span className={`text-[10px] font-semibold font-mono-numbers ${pwdStrength.colorClass.split(' ')[1] || ''}`}>
                  {pwdStrength.label}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                required
                className="w-full px-3 py-2 pr-9 text-xs rounded-xl neu-input-field font-mono-numbers placeholder:text-[var(--neu-text-muted)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)] cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Clean Segmented Strength Bar */}
            {password && (
              <div className="mt-1.5 flex gap-1 h-1">
                <div
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    pwdStrength.score >= 25 ? pwdStrength.colorClass.split(' ')[0] : 'bg-[var(--neu-border-subtle)]'
                  }`}
                />
                <div
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    pwdStrength.score >= 70 ? pwdStrength.colorClass.split(' ')[0] : 'bg-[var(--neu-border-subtle)]'
                  }`}
                />
                <div
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    pwdStrength.score >= 100 ? pwdStrength.colorClass.split(' ')[0] : 'bg-[var(--neu-border-subtle)]'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Confirm Password for Register */}
          {activeTab === 'register' && (
            <div className="animate-fadeIn">
              <label className="block text-[11px] font-semibold text-[var(--neu-text-secondary)] mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                <span>Confirm Security Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 text-xs rounded-xl neu-input-field font-mono-numbers"
              />
            </div>
          )}

          {/* Remember me option */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-[var(--neu-text-secondary)]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[var(--accent-cyan)] cursor-pointer"
              />
              <span>Remember Trader Session</span>
            </label>
            <a href="#reset" className="text-[var(--accent-cyan)] hover:underline">
              Forgot Key?
            </a>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl neu-btn-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-mono-numbers text-[11px]">
                <span className="w-3 h-3 border-2 border-[var(--neu-bg)] border-t-transparent rounded-full animate-spin" />
                <span>{loadingStep || 'Authorizing...'}</span>
              </span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Authorize & Connect' : 'Provision Demo Terminal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
