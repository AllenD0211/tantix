import React from 'react';
import {
  ShieldCheck,
  DollarSign,
  Percent,
  Compass,
  Scale,
  Activity,
  Layers,
} from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';
import { formatCurrency, formatPips, formatRatio } from '../../utils/formatting';
import { getPositionUnitLabel, type ActiveCalculatorInputs } from '../../utils/instrumentDisplay';

interface ResultSummaryProps {
  result: CalculationResult;
  inputs: ActiveCalculatorInputs;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result, inputs }) => {
  const isHealthyMargin = result.freeMarginRemaining > 0;
  const unitLabel = getPositionUnitLabel(inputs);

  return (
    <div className="neu-raised-card p-5 sm:p-6 space-y-5 border border-[var(--neu-border-subtle)]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[var(--accent-cyan)]" />
          <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
            Detailed Calculation Breakdown
          </h3>
        </div>
        <span className="text-[10px] font-mono-numbers text-[var(--neu-text-muted)]">
          Deterministic Mathematical Engine
        </span>
      </div>

      {/* Two Column Grid: Margin & Position vs Risk & Return */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Left Column: Position & Margin Capital */}
        <div className="neu-inset p-4 rounded-xl space-y-3 font-mono-numbers">
          <div className="text-[11px] font-bold text-[var(--neu-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>Capital & Margin Requirements</span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Account Balance</span>
              <span className="font-semibold text-[var(--neu-text-primary)]">
                {formatCurrency(inputs.accountBalance, inputs.accountCurrency)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Required Margin</span>
              <span className="font-bold text-[var(--accent-cyan)]">
                {formatCurrency(result.requiredMargin, inputs.accountCurrency)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Free Margin Remaining</span>
              <span
                className={`font-semibold ${
                  isHealthyMargin ? 'text-[var(--accent-emerald)]' : 'text-[var(--accent-rose)]'
                }`}
              >
                {formatCurrency(result.freeMarginRemaining, inputs.accountCurrency)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Position Units</span>
              <span className="font-semibold text-[var(--neu-text-primary)]">
                {result.positionSizeUnits.toLocaleString()} units ({inputs.lotSize} lots)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--neu-text-muted)]">Notional Position Value</span>
              <span className="font-semibold text-[var(--neu-text-primary)]">
                {formatCurrency(result.positionValue, inputs.accountCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Risk, Return & Pip Valuation */}
        <div className="neu-inset p-4 rounded-xl space-y-3 font-mono-numbers">
          <div className="text-[11px] font-bold text-[var(--neu-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Compass className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            <span>Risk, Reward & Pip Dynamics</span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">1 Pip Value</span>
              <span className="font-bold text-[var(--neu-text-primary)]">
                {formatCurrency(result.pipValue, inputs.accountCurrency)} / pip
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Risk Amount (Loss at SL)</span>
              <span className="font-semibold text-[var(--accent-rose)]">
                {result.potentialLoss !== null
                  ? `-${formatCurrency(result.potentialLoss, inputs.accountCurrency)} (${result.riskPercent?.toFixed(2)}%)`
                  : 'SL not set'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Reward Amount (Gain at TP)</span>
              <span className="font-semibold text-[var(--accent-emerald)]">
                {result.potentialProfit !== null
                  ? `+${formatCurrency(result.potentialProfit, inputs.accountCurrency)} (${result.rewardPercent?.toFixed(2)}%)`
                  : 'TP not set'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)]/50 pb-1.5">
              <span className="text-[var(--neu-text-muted)]">Stop Loss Distance</span>
              <span className="font-semibold text-[var(--neu-text-primary)]">
                {formatPips(result.stopLossDistancePips)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--neu-text-muted)]">Risk : Reward Ratio</span>
              <span className="font-bold text-[var(--accent-cyan)]">
                {formatRatio(result.riskRewardRatio)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
