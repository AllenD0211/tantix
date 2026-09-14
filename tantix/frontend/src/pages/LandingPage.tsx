import React from 'react';
import {
  Calculator,
  Shield,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LoginHeader } from '../components/layout/LoginHeader';
import { Button } from '../components/ui/Button';
import type { UserSession } from '../types/auth';

interface LandingPageProps {
  onStartAsGuest: () => void;
  onGoToLogin: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAsGuest,
  onGoToLogin,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between relative">
      <LoginHeader theme={theme} onToggleTheme={onToggleTheme} />

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
        {/* Badge */}
        <div className="neu-inset px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--accent-cyan)] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Trading Math & Risk Modeling Suite</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--neu-text-primary)]">
            Calculate Outcomes Before You{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-emerald)] to-[var(--accent-cyan)]">
              Risk Real Capital
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--neu-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            TANTIX is a dedicated financial calculator. Model required margin, potential profit/loss,
            pip values, and risk-to-reward ratios with 100% mathematical precision.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartAsGuest}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Free Calculator
          </Button>

          <Button variant="secondary" size="lg" onClick={onGoToLogin}>
            Sign In with Broker Account
          </Button>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 text-left">
          <div className="neu-raised-card p-5 space-y-2 border border-[var(--neu-border-subtle)]">
            <div className="w-9 h-9 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-cyan)]">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
              Deterministic Math
            </h3>
            <p className="text-xs text-[var(--neu-text-muted)] leading-relaxed">
              Formulas calibrated to standard broker specifications for lots, pips, and margin tiers.
            </p>
          </div>

          <div className="neu-raised-card p-5 space-y-2 border border-[var(--neu-border-subtle)]">
            <div className="w-9 h-9 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-emerald)]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
              Real-Time Visual Analysis
            </h3>
            <p className="text-xs text-[var(--neu-text-muted)] leading-relaxed">
              Instant visual risk vs reward proportions and dynamic price ladder mapping.
            </p>
          </div>

          <div className="neu-raised-card p-5 space-y-2 border border-[var(--neu-border-subtle)]">
            <div className="w-9 h-9 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-rose)]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
              Strict Risk Safeguards
            </h3>
            <p className="text-xs text-[var(--neu-text-muted)] leading-relaxed">
              Pre-trade capital protection modeling with margin call checks and risk percentages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
