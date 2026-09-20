import React, { useState, useMemo, useEffect } from 'react';
import type { UserSession } from '../types/auth';
import type { InstrumentType } from '../types/calculator';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { TickerBar } from '../components/layout/TickerBar';
import { InstrumentSelector } from '../components/calculator/InstrumentSelector';
import { TradeAnalysisChart } from '../components/charts/TradeAnalysisChart';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ResultSummary } from '../components/calculator/ResultSummary';
import {
  Info,
  Calculator,
  ShieldCheck,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { NeumorphicLogin } from '../components/auth/NeumorphicLogin';
import {
  calculateTrade,
  getDefaultInputs,
  validateInputs,
} from '../services/calculator/calculatorEngine';
import type { ActiveCalculatorInputs } from '../utils/instrumentDisplay';
import { supabase } from '../../lib/supabase';

export interface DashboardProps {
  session: UserSession | null;
  onLoginSuccess: (session: UserSession) => void;
  onSignOut: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  session,
  onLoginSuccess,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [selectedInstrument, setSelectedInstrument] =
    useState<InstrumentType>('forex');

  const [showLoginPanel, setShowLoginPanel] = useState(false);

  const sessionBalance = session?.balance || 10000;

  // Close login panel automatically after successful login
  useEffect(() => {
    if (session) {
      setShowLoginPanel(false);
    }
  }, [session]);

  // Listen for Supabase authentication changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, supabaseSession) => {
        if (supabaseSession?.user && !session) {
          const user = supabaseSession.user;

          onLoginSuccess({
            email: user.email || '',
            server: 'tantix-live-01',
            isDemo: false,
            balance: 100000.0,
            equity: 102450.0,
            freeMargin: 98450.0,
            marginLevel: 1420,
            activeRiskPercent: 1.0,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [session, onLoginSuccess]);

  // Calculator inputs
  const [inputs, setInputs] =
    useState<ActiveCalculatorInputs>(() =>
      getDefaultInputs(
        'forex',
        sessionBalance
      ) as ActiveCalculatorInputs
    );

  // Change instrument
  const handleSelectInstrument = (type: InstrumentType) => {
    setSelectedInstrument(type);

    setInputs(
      getDefaultInputs(
        type,
        sessionBalance
      ) as ActiveCalculatorInputs
    );
  };

  // Validate calculator inputs
  const validationErrors = useMemo(() => {
    return validateInputs(inputs);
  }, [inputs]);

  // Calculate trade results
  const calculationResult = useMemo(() => {
    return calculateTrade(inputs);
  }, [inputs]);

  // Reset calculator
  const handleReset = () => {
    setInputs(
      getDefaultInputs(
        selectedInstrument,
        sessionBalance
      ) as ActiveCalculatorInputs
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative pb-8">

      {/* =========================================================
          DASHBOARD HEADER
      ========================================================= */}
      <DashboardHeader
        session={session}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSignOut={session ? onSignOut : undefined}
        onSignIn={() => setShowLoginPanel(true)}
      />

      {/* =========================================================
          MAIN DASHBOARD CONTENT
      ========================================================= */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">

        {/* Market Ticker */}
        <TickerBar />

        {/* Instrument Selector */}
        <InstrumentSelector
          selected={selectedInstrument}
          onSelect={handleSelectInstrument}
        />

        {/* =======================================================
            INSTRUMENT CONTENT
        ======================================================= */}
        <div
          key={selectedInstrument}
          className="space-y-6 animate-fadeIn"
        >

          {/* =====================================================
              TRADE ANALYSIS
          ===================================================== */}
          <section aria-label="Trade Outcome Analysis">
            <TradeAnalysisChart
              result={calculationResult}
              inputs={inputs}
            />
          </section>

          {/* =====================================================
              CALCULATOR + RESULT SUMMARY
          ===================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Calculator Form */}
            <div className="lg:col-span-7">
              <CalculatorForm
                inputs={inputs}
                errors={validationErrors}
                onChange={setInputs}
                onReset={handleReset}
              />
            </div>

            {/* Result Summary */}
            <div className="lg:col-span-5 space-y-6">
              <ResultSummary
                result={calculationResult}
                inputs={inputs}
              />
            </div>

          </div>

          {/* =====================================================
              TRADING GUIDE
          ===================================================== */}
          <section className="pt-6">

            <div className="neu-card p-6 sm:p-8">

              {/* -------------------------------------------------
                  GUIDE HEADER
              ------------------------------------------------- */}
              <div className="mb-10">

                <div className="flex items-center gap-2 mb-3">
                  <Info
                    className="w-4 h-4 text-[var(--accent-cyan)]"
                  />

                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-cyan)]">
                    Trading Guide
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--neu-text-primary)]">
                  How to Calculate a Trade
                </h2>

                <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 text-[var(--neu-text-secondary)]">
                  Select your{' '}
                  <strong className="text-[var(--neu-text-primary)]">
                    trading asset, instrument, account balance, leverage,
                    and position size
                  </strong>
                  . Enter your entry, stop-loss, and take-profit prices,
                  then click Calculate to view your estimated margin,
                  potential profit or loss, and risk-to-reward ratio.
                </p>

              </div>

              {/* -------------------------------------------------
                  GUIDE CARDS
              ------------------------------------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Understanding Margin */}
                <div className="neu-card p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="neu-icon p-2 rounded-xl">
                      <Calculator
                        className="w-4 h-4 text-[var(--accent-cyan)]"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[var(--neu-text-primary)]">
                      Understanding Margin
                    </h3>

                  </div>

                  <p className="text-sm leading-6 text-[var(--neu-text-secondary)]">
                    Margin is the amount of funds required to open a
                    leveraged position. It depends on the{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      position value, leverage, and asset type
                    </strong>
                    .
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--neu-text-secondary)]">
                    For example, a $10,000 position with{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      1:5 leverage
                    </strong>{' '}
                    would require approximately{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      $2,000 in margin
                    </strong>
                    , before asset-specific requirements or trading
                    costs.
                  </p>

                </div>

                {/* Managing Position Size */}
                <div className="neu-card p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="neu-icon p-2 rounded-xl">
                      <Scale
                        className="w-4 h-4 text-[var(--accent-cyan)]"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[var(--neu-text-primary)]">
                      Managing Position Size
                    </h3>

                  </div>

                  <p className="text-sm leading-6 text-[var(--neu-text-secondary)]">
                    Your position size affects both the required margin
                    and the potential profit or loss. A larger position
                    means greater exposure to price movements.
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--neu-text-secondary)]">
                    Consider your available balance and planned risk
                    when choosing your position size.
                  </p>

                </div>

                {/* Understanding Risk & Reward */}
                <div className="neu-card p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="neu-icon p-2 rounded-xl">
                      <ShieldCheck
                        className="w-4 h-4 text-[var(--accent-cyan)]"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[var(--neu-text-primary)]">
                      Understanding Risk &amp; Reward
                    </h3>

                  </div>

                  <p className="text-sm leading-6 text-[var(--neu-text-secondary)]">
                    The{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      Risk-to-Reward Ratio
                    </strong>{' '}
                    compares the potential loss at your stop-loss with
                    the potential gain at your take-profit.
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--neu-text-secondary)]">
                    For example, a potential loss of{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      $500
                    </strong>{' '}
                    and a potential profit of{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      $1,250
                    </strong>{' '}
                    gives a{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      1:2.50 risk-to-reward ratio
                    </strong>
                    .
                  </p>

                </div>

                {/* Understanding Price Movement */}
                <div className="neu-card p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="neu-icon p-2 rounded-xl">
                      <TrendingUp
                        className="w-4 h-4 text-[var(--accent-cyan)]"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[var(--neu-text-primary)]">
                      Understanding Price Movement
                    </h3>

                  </div>

                  <p className="text-sm leading-6 text-[var(--neu-text-secondary)]">
                    The effect of a price change depends on the{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      asset and position size
                    </strong>
                    .
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--neu-text-secondary)]">
                    For example, if you hold{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      50 shares
                    </strong>{' '}
                    and the price moves by{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      $1
                    </strong>
                    , the position value changes by{' '}
                    <strong className="text-[var(--neu-text-primary)]">
                      $50
                    </strong>
                    .
                  </p>

                  <p className="mt-3 text-xs leading-5 text-[var(--neu-text-muted)]">
                    Price movement calculations may differ across Forex,
                    Gold, Stocks, Crypto, and other assets based on their
                    contract or unit specifications.
                  </p>

                </div>

              </div>
              <div className="mt-8 border-t border-[var(--neu-shadow-dark)] pt-7">

                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--neu-text-primary)] mb-5">
                  How It Works
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                  {/* Step 1 */}
                  <div className="flex gap-3">

                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-cyan)] text-black text-xs font-bold">
                      1
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--neu-text-primary)]">
                        Enter Trade Details
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-[var(--neu-text-secondary)]">
                        Select your asset and enter the values for your
                        planned position.
                      </p>
                    </div>

                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">

                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-cyan)] text-black text-xs font-bold">
                      2
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--neu-text-primary)]">
                        Review the Results
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-[var(--neu-text-secondary)]">
                        Check your margin, risk, reward, and position
                        details.
                      </p>
                    </div>

                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">

                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-cyan)] text-black text-xs font-bold">
                      3
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--neu-text-primary)]">
                        Analyze the Outcome
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-[var(--neu-text-secondary)]">
                        Use the chart to understand the potential
                        profit and loss scenarios.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* -------------------------------------------------
                  DISCLAIMER
              ------------------------------------------------- */}
              <p className="mt-7 text-[11px] leading-5 text-[var(--neu-text-muted)]">
                Tantix.FX provides estimates based on the values entered
                by the user. Actual results may vary depending on market
                conditions, broker specifications, spreads, commissions,
                contract specifications, and other trading costs.
              </p>

            </div>

          </section>

        </div>
      </div>

      {/* =========================================================
          LOGIN PANEL OVERLAY
      ========================================================= */}
      {showLoginPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 cursor-pointer"
            onClick={() => setShowLoginPanel(false)}
          />

          {/* Slide-in Login Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-[480px] z-50 flex flex-col bg-[var(--neu-bg)] shadow-2xl overflow-y-auto animate-slideInRight">

            {/* Close Button */}
            <div className="flex justify-end p-4">

              <button
                type="button"
                onClick={() => setShowLoginPanel(false)}
                className="neu-btn p-2 rounded-xl text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)] cursor-pointer text-xs"
              >
                ✕ Close
              </button>

            </div>

            {/* Login Content */}
            <div className="flex-1 flex flex-col justify-center px-4 py-4">

              {/* Hero Copy */}
              <div className="mb-6 text-center">

                <h2 className="text-2xl font-black text-[var(--neu-text-primary)] tracking-tight mb-2">
                  Smarter Calculations.{' '}
                  <span className="text-[var(--accent-cyan)] glow-cyan">
                    Clearer Risk.
                  </span>
                </h2>

                <p className="text-sm text-[var(--neu-text-secondary)] leading-relaxed">
                  Get a clearer view of your margins, position risk,
                  and potential trade outcomes.
                </p>

              </div>

              {/* Login Component */}
              <NeumorphicLogin
                theme={theme}
                onSuccessLogin={(userData) => {
                  onLoginSuccess(userData);
                  setShowLoginPanel(false);
                }}
              />

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;