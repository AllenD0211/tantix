import React, { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { UserSession } from '../../types/auth';
import { supabase } from '../../../lib/supabase';
import logoLight from '../../assets/1.png';
import logoDark from '../../assets/2.png';

interface NeumorphicLoginProps {
  onSuccessLogin?: (userData: UserSession) => void;
  theme?: 'dark' | 'light';
}

export const NeumorphicLogin: React.FC<NeumorphicLoginProps> = ({ onSuccessLogin, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
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

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
      return null;
    }

    console.log('Logged in:', data.user);
    return data;
  };

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
      return null;
    }

    console.log('Account created:', data.user);
    return data;
  };

  const handleResetPassword = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
      return null;
    }

    console.log('Reset email sent to:', email);
    return data;
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    setLoadingStep('Connecting to Google...');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error(error.message);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.';
      setErrorMessage(message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please provide your Trader ID / Email.');
      return;
    }

    if (activeTab !== 'forgot' && !password) {
      setErrorMessage('Please provide your Password.');
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        setLoadingStep('Authenticating with Supabase...');
        const result = await handleLogin();
        if (result && result.user) {
          const user = result.user;
          setSuccessMessage('Terminal authorized. Redirecting to workspace...');
          setTimeout(() => {
            setIsLoading(false);
            if (onSuccessLogin) {
              onSuccessLogin({
                email: user.email || email,
                server,
                isDemo: false,
                balance: 100000.0,
                equity: 102450.0,
                freeMargin: 98450.0,
                marginLevel: 1420,
                activeRiskPercent: 1.0,
              });
            }
          }, 500);
        }
      } else if (activeTab === 'register') {
        setLoadingStep('Creating Supabase Account...');
        const result = await handleSignup();
        if (result && result.user) {
          const user = result.user;
          setSuccessMessage('Account created! Loading workspace...');
          setTimeout(() => {
            setIsLoading(false);
            if (onSuccessLogin) {
              onSuccessLogin({
                email: user.email || email,
                server,
                isDemo: false,
                balance: 100000.0,
                equity: 102450.0,
                freeMargin: 98450.0,
                marginLevel: 1420,
                activeRiskPercent: 1.0,
              });
            }
          }, 500);
        }
      } else if (activeTab === 'forgot') {
        setLoadingStep('Sending Reset Link...');
        const result = await handleResetPassword();
        if (result) {
          setSuccessMessage('Password reset link sent! Check your email inbox.');
        }
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Connection failed. Please retry.';
      setErrorMessage(message);
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
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Tantix.FX Logo"
            className="h-6 sm:h-7 w-auto object-contain mb-2 transition-transform hover:scale-105 duration-200"
          />
          <p className="text-xs text-[var(--neu-text-muted)] mt-1">
            Calculate. Analyze. Decide.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="neu-inset-pill p-1 flex items-center mb-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
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
              setSuccessMessage('');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'register'
                ? 'neu-convex text-[var(--accent-cyan)]'
                : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Forgot Password Header Description */}
        {activeTab === 'forgot' && (
          <div className="mb-4 text-center animate-fadeIn relative z-10">
            <h3 className="text-xs font-bold text-[var(--neu-text-primary)] mb-1 uppercase tracking-wider">
              Forgot Password
            </h3>
            <p className="text-[11px] text-[var(--neu-text-secondary)]">
              Enter your registered Trader ID / Email to receive password recovery instructions.
            </p>
          </div>
        )}

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

          {/* Password - Hidden in Forgot Password Mode */}
          {activeTab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[var(--neu-text-secondary)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                  <span>Security Password</span>
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  required={activeTab !== 'forgot'}
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
            </div>
          )}

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

          {/* Remember me & Forgot Password - ONLY in Trader Sign In tab */}
          {activeTab === 'login' && (
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
              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-[var(--accent-cyan)] hover:underline cursor-pointer bg-transparent border-none p-0 text-[11px]"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Back link in Forgot Password Mode */}
          {activeTab === 'forgot' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-[11px] text-[var(--accent-cyan)] hover:underline cursor-pointer bg-transparent border-none p-0 font-semibold"
              >
                ← Back to Trader Sign In
              </button>
            </div>
          )}

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
                <span>
                  {activeTab === 'login'
                    ? 'Authorize & Connect'
                    : activeTab === 'register'
                    ? 'Create Account'
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Social Authentication Section */}
        {activeTab !== 'forgot' && (
          <div className="mt-4 relative z-10">
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-[var(--neu-border-dark)] opacity-40" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--neu-text-muted)]">
                Or continue with
              </span>
              <div className="flex-1 h-[1px] bg-[var(--neu-border-dark)] opacity-40" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl neu-convex hover:neu-raised flex items-center justify-center gap-2.5 text-xs font-semibold text-[var(--neu-text-primary)] transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {activeTab === 'register' ? 'Sign up with Google / Gmail' : 'Sign in with Google / Gmail'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
