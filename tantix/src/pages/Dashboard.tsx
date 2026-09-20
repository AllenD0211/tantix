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

  const sessionBalance = session?.balance || 10000;

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
          <section className="pt-8 pb-2 space-y-8">

            {/* Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-cyan)] mb-3 block">
                Trading Guide
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--neu-text-primary)] leading-[1.1]">
                How to Calculate{' '}
                <span className="text-[var(--accent-cyan)]">a Trade</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--neu-text-secondary)]">
                Configure your{' '}
                <strong className="text-[var(--neu-text-primary)] font-semibold">
                  instrument, balance, leverage, and position size
                </strong>
                . Set your entry, stop loss, and take profit levels the calculator
                instantly computes your margin, potential P&L, and risk to reward ratio.
              </p>
            </div>

            {/* Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

              <div>
                <h3 className="text-sm font-bold text-[var(--neu-text-primary)] mb-1.5">
                  Understanding Margin
                </h3>
                <p className="text-xs leading-[1.75] text-[var(--neu-text-secondary)]">
                  Margin is the capital required to open a leveraged position, determined by
                  <strong className="text-[var(--neu-text-primary)] font-medium"> position value, leverage, and asset type</strong>.
                  A $10,000 position at <strong className="text-[var(--neu-text-primary)] font-medium">1:5 leverage</strong> requires
                  roughly <strong className="text-[var(--neu-text-primary)] font-medium">$2,000 in margin</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[var(--neu-text-primary)] mb-1.5">
                  Managing Position Size
                </h3>
                <p className="text-xs leading-[1.75] text-[var(--neu-text-secondary)]">
                  Position size directly impacts your margin requirement and profit/loss exposure.
                  Larger positions amplify price movements always factor in your
                  <strong className="text-[var(--neu-text-primary)] font-medium"> available balance and intended risk tolerance</strong> before sizing a trade.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[var(--neu-text-primary)] mb-1.5">
                  Risk &amp; Reward Analysis
                </h3>
                <p className="text-xs leading-[1.75] text-[var(--neu-text-secondary)]">
                  The <strong className="text-[var(--neu-text-primary)] font-medium">risk-to-reward ratio</strong> compares
                  potential loss at your stop-loss to potential gain at your take-profit.
                  A $500 risk against a $1,250 reward gives a
                  <strong className="text-[var(--neu-text-primary)] font-medium"> 1:2.50 R:R</strong> a
                  favourable setup for consistent profitability.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[var(--neu-text-primary)] mb-1.5">
                  Price Movement Impact
                </h3>
                <p className="text-xs leading-[1.75] text-[var(--neu-text-secondary)]">
                  A $1 move on <strong className="text-[var(--neu-text-primary)] font-medium">50 shares</strong> changes
                  the position value by <strong className="text-[var(--neu-text-primary)] font-medium">$50</strong>.
                  Each asset class Forex, Gold, Crypto, Stocks has unique contract
                  specifications that affect how price movements translate to P&L.
                </p>
              </div>

            </div>

            {/* How It Works */}
            <div className="pt-6 border-t border-[var(--neu-border-subtle)]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--neu-text-muted)] mb-5">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[var(--accent-cyan)] text-xs font-bold font-mono-numbers">01</span>
                  <h4 className="text-xs font-bold text-[var(--neu-text-primary)] mt-1 mb-1">Enter Trade Details</h4>
                  <p className="text-[11px] leading-[1.65] text-[var(--neu-text-secondary)]">
                    Select an instrument from the tabs above and fill in your account balance,
                    entry price, stop-loss, and take-profit levels.
                  </p>
                </div>
                <div>
                  <span className="text-[var(--accent-cyan)] text-xs font-bold font-mono-numbers">02</span>
                  <h4 className="text-xs font-bold text-[var(--neu-text-primary)] mt-1 mb-1">Review the Results</h4>
                  <p className="text-[11px] leading-[1.65] text-[var(--neu-text-secondary)]">
                    The result summary shows your lot size, pip value, margin required,
                    and risk-to-reward ratio all updating in real time.
                  </p>
                </div>
                <div>
                  <span className="text-[var(--accent-cyan)] text-xs font-bold font-mono-numbers">03</span>
                  <h4 className="text-xs font-bold text-[var(--neu-text-primary)] mt-1 mb-1">Analyze the Outcome</h4>
                  <p className="text-[11px] leading-[1.65] text-[var(--neu-text-secondary)]">
                    Use the trade analysis chart to visualize your potential profit and loss
                    scenarios before committing to a position.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="pt-5 border-t border-[var(--neu-border-subtle)] text-[10px] leading-5 text-[var(--neu-text-muted)]">
              <strong className="text-[var(--neu-text-secondary)] font-semibold">Disclaimer:</strong>{' '}
              Tantix provides estimates based on user-entered values. Actual results may vary
              depending on market conditions, broker specifications, spreads, commissions, swap rates,
              contract specifications, and other trading costs. This tool is for educational purposes
              and does not constitute financial advice.
            </p>

          </section>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;