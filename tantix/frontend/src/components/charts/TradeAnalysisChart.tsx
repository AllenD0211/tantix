import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';
import { formatCurrency, formatPips, formatRatio } from '../../utils/formatting';
import {
  getInstrumentSymbol,
  getPositionUnitLabel,
  getPriceDecimals,
  type ActiveCalculatorInputs,
} from '../../utils/instrumentDisplay';

interface TradeAnalysisChartProps {
  result: CalculationResult;
  inputs: ActiveCalculatorInputs;
}

export const TradeAnalysisChart: React.FC<TradeAnalysisChartProps> = ({ result, inputs }) => {
  const {
    direction,
    positionValue,
    requiredMargin,
    potentialProfit,
    potentialLoss,
    riskPercent,
    rewardPercent,
    riskRewardRatio,
    pipValue,
    stopLossDistancePips,
    takeProfitDistancePips,
  } = result;

  const symbol = getInstrumentSymbol(inputs);
  const priceDecimals = getPriceDecimals(inputs);
  const unitLabel = getPositionUnitLabel(inputs);
  const hasSl = inputs.stopLossPrice && inputs.stopLossPrice > 0;
  const hasTp = inputs.takeProfitPrice && inputs.takeProfitPrice > 0;

  // Calculate percentage distribution for the Risk vs Reward bar
  let riskBarPercent = 50;
  let rewardBarPercent = 50;
  if (potentialProfit !== null && potentialLoss !== null && (potentialProfit + potentialLoss) > 0) {
    const total = potentialProfit + potentialLoss;
    riskBarPercent = Math.min(Math.max((potentialLoss / total) * 100, 10), 90);
    rewardBarPercent = 100 - riskBarPercent;
  }

  // Margin percent of account balance
  const marginPercentOfBalance =
    inputs.accountBalance > 0 ? (requiredMargin / inputs.accountBalance) * 100 : 0;

  return (
    <div className="neu-raised-card p-5 sm:p-6 space-y-6 border border-[var(--neu-border-subtle)]">
      {/* Top Header & Instrument Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--neu-border-subtle)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--neu-text-primary)]">
                Trade Analysis & Outcome Visualizer
              </h2>
              <span
                className={`text-[10px] font-bold font-mono-numbers px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  direction === 'BUY'
                    ? 'bg-[var(--accent-emerald)]/15 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/30'
                    : 'bg-[var(--accent-rose)]/15 text-[var(--accent-rose)] border border-[var(--accent-rose)]/30'
                }`}
              >
                {direction === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {direction} {symbol}
              </span>
            </div>
            <p className="text-xs text-[var(--neu-text-muted)] font-mono-numbers mt-0.5">
              Position:{' '}
              {inputs.instrumentType === 'stocks'
                ? `${result.positionSizeUnits.toLocaleString()} Shares`
                : inputs.instrumentType === 'crypto'
                ? `${result.positionSizeUnits} ${inputs.pair.split('/')[0]} Coins`
                : inputs.instrumentType === 'indices'
                ? `${result.positionSizeUnits.toLocaleString()} Contracts`
                : `${(inputs as any).lotSize} Lots (${result.positionSizeUnits.toLocaleString()} ${unitLabel})`}{' '}
              • Leverage 1:{inputs.leverage}
            </p>
          </div>
        </div>

        {/* Dynamic Risk/Reward Pill */}
        <div className="flex items-center gap-2">
          {riskRewardRatio !== null ? (
            <div className="neu-inset px-3.5 py-1.5 rounded-xl text-right">
              <div className="text-[10px] uppercase font-bold text-[var(--neu-text-muted)]">
                Risk : Reward
              </div>
              <div className="text-sm font-bold font-mono-numbers text-[var(--accent-cyan)]">
                {formatRatio(riskRewardRatio)}
              </div>
            </div>
          ) : (
            <span className="text-xs text-[var(--neu-text-muted)] italic">
              Set SL & TP to view R:R
            </span>
          )}
        </div>
      </div>

      {/* 4 Primary Outcome Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* 1. Potential Profit */}
        <div className="neu-inset p-3.5 rounded-xl border border-[var(--accent-emerald)]/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--neu-text-muted)]">
            <span>Potential Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
          </div>
          <div className="text-lg font-bold font-mono-numbers text-[var(--accent-emerald)] mt-1">
            {potentialProfit !== null ? formatCurrency(potentialProfit, inputs.accountCurrency) : '—'}
          </div>
          <div className="text-[11px] text-[var(--accent-emerald)] font-mono-numbers mt-0.5 flex items-center gap-1">
            {rewardPercent !== null && <span>+{rewardPercent.toFixed(2)}% of account</span>}
            {takeProfitDistancePips !== null && (
              <span>
                (
                {inputs.instrumentType === 'crypto' || inputs.instrumentType === 'stocks'
                  ? `$${takeProfitDistancePips.toLocaleString()}`
                  : inputs.instrumentType === 'indices'
                  ? `${takeProfitDistancePips.toFixed(1)} pts`
                  : formatPips(takeProfitDistancePips)}
                )
              </span>
            )}
          </div>
        </div>

        {/* 2. Potential Loss / Risk */}
        <div className="neu-inset p-3.5 rounded-xl border border-[var(--accent-rose)]/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--neu-text-muted)]">
            <span>Potential Loss</span>
            <TrendingDown className="w-3.5 h-3.5 text-[var(--accent-rose)]" />
          </div>
          <div className="text-lg font-bold font-mono-numbers text-[var(--accent-rose)] mt-1">
            {potentialLoss !== null ? `-${formatCurrency(potentialLoss, inputs.accountCurrency)}` : '—'}
          </div>
          <div className="text-[11px] text-[var(--accent-rose)] font-mono-numbers mt-0.5 flex items-center gap-1">
            {riskPercent !== null && <span>-{riskPercent.toFixed(2)}% risk</span>}
            {stopLossDistancePips !== null && (
              <span>
                (
                {inputs.instrumentType === 'crypto' || inputs.instrumentType === 'stocks'
                  ? `$${stopLossDistancePips.toLocaleString()}`
                  : inputs.instrumentType === 'indices'
                  ? `${stopLossDistancePips.toFixed(1)} pts`
                  : formatPips(stopLossDistancePips)}
                )
              </span>
            )}
          </div>
        </div>

        {/* 3. Required Margin */}
        <div className="neu-inset p-3.5 rounded-xl border border-[var(--accent-cyan)]/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--neu-text-muted)]">
            <span>Required Margin</span>
            <Shield className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          </div>
          <div className="text-lg font-bold font-mono-numbers text-[var(--accent-cyan)] mt-1">
            {formatCurrency(requiredMargin, inputs.accountCurrency)}
          </div>
          <div className="text-[11px] text-[var(--neu-text-muted)] font-mono-numbers mt-0.5">
            {marginPercentOfBalance.toFixed(1)}% of balance locked
          </div>
        </div>

        {/* 4. Position Notional Value */}
        <div className="neu-inset p-3.5 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--neu-text-muted)]">
            <span>Notional Value</span>
            <Layers className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
          </div>
          <div className="text-lg font-bold font-mono-numbers text-[var(--neu-text-primary)] mt-1">
            {formatCurrency(positionValue, inputs.accountCurrency)}
          </div>
          <div className="text-[11px] text-[var(--neu-text-muted)] font-mono-numbers mt-0.5">
            {inputs.instrumentType === 'crypto'
              ? '$1.00 Move'
              : inputs.instrumentType === 'stocks'
              ? '$0.01 Move'
              : inputs.instrumentType === 'indices'
              ? '1 Point Move'
              : '1 Pip'}{' '}
            = {formatCurrency(pipValue, inputs.accountCurrency)}
          </div>
        </div>
      </div>

      {/* Visual Risk vs Reward Proportion Bar */}
      {hasSl && hasTp && potentialProfit !== null && potentialLoss !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--accent-rose)] flex items-center gap-1.5 font-mono-numbers">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-rose)]" />
              Risk: {formatCurrency(potentialLoss, inputs.accountCurrency)} ({riskBarPercent.toFixed(0)}%)
            </span>
            <span className="text-[var(--neu-text-muted)] text-[11px]">Outcome Distribution</span>
            <span className="text-[var(--accent-emerald)] flex items-center gap-1.5 font-mono-numbers">
              Reward: {formatCurrency(potentialProfit, inputs.accountCurrency)} ({rewardBarPercent.toFixed(0)}%)
              <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            </span>
          </div>

          <div className="w-full h-3.5 neu-inset rounded-full overflow-hidden flex p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-rose)] to-[var(--accent-rose)]/80 rounded-l-full transition-all duration-300"
              style={{ width: `${riskBarPercent}%` }}
              title={`Risk: ${formatCurrency(potentialLoss, inputs.accountCurrency)}`}
            />
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-emerald)]/80 to-[var(--accent-emerald)] rounded-r-full transition-all duration-300"
              style={{ width: `${rewardBarPercent}%` }}
              title={`Reward: ${formatCurrency(potentialProfit, inputs.accountCurrency)}`}
            />
          </div>
        </div>
      )}

      {/* Price Ladder Map (Visualizing Stop Loss, Entry Price, Take Profit) */}
      <div className="neu-inset p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--neu-text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Price Ladder Map</span>
          <span className="font-mono-numbers text-[11px]">
            {inputs.instrumentType === 'stocks' ? 'Share Price ($)' : 'Pip Scale'} ({priceDecimals} decimals)
          </span>
        </div>

        <div className="space-y-2 relative font-mono-numbers text-xs">
          {/* Take Profit Row */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] shrink-0" />
              <span className="font-bold text-[var(--accent-emerald)]">
                Take Profit {direction === 'BUY' ? '▲' : '▼'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-bold text-[var(--neu-text-primary)]">
                {inputs.takeProfitPrice ? inputs.takeProfitPrice.toFixed(priceDecimals) : 'Not Set'}
              </div>
              {takeProfitDistancePips !== null && (
                <div className="text-[10px] text-[var(--accent-emerald)]">
                  +{inputs.instrumentType === 'stocks' ? `$${takeProfitDistancePips.toFixed(2)}` : formatPips(takeProfitDistancePips)} • +{formatCurrency(potentialProfit, inputs.accountCurrency)}
                </div>
              )}
            </div>
          </div>

          {/* Entry Price Row */}
          <div className="flex items-center justify-between p-2.5 rounded-lg neu-convex border border-[var(--accent-cyan)]/40 shadow-[0_0_12px_var(--accent-cyan-glow)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse shrink-0" />
              <span className="font-bold text-[var(--accent-cyan)]">
                Entry Price (Market / Order)
              </span>
            </div>
            <div className="text-right">
              <div className="font-bold text-[var(--neu-text-primary)] text-sm">
                {inputs.entryPrice.toFixed(priceDecimals)}
              </div>
              <div className="text-[10px] text-[var(--neu-text-muted)]">
                Direction: {direction}
              </div>
            </div>
          </div>

          {/* Stop Loss Row */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--accent-rose)]/10 border border-[var(--accent-rose)]/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-rose)] shrink-0" />
              <span className="font-bold text-[var(--accent-rose)]">
                Stop Loss {direction === 'BUY' ? '▼' : '▲'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-bold text-[var(--neu-text-primary)]">
                {inputs.stopLossPrice ? inputs.stopLossPrice.toFixed(priceDecimals) : 'Not Set'}
              </div>
              {stopLossDistancePips !== null && (
                <div className="text-[10px] text-[var(--accent-rose)]">
                  -{inputs.instrumentType === 'stocks' ? `$${stopLossDistancePips.toFixed(2)}` : formatPips(stopLossDistancePips)} • -{formatCurrency(potentialLoss, inputs.accountCurrency)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Warnings / Context Notice */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30 text-xs text-[var(--accent-amber)] space-y-1">
          {result.warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="shrink-0 font-bold">⚠</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
