import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';
import type { ActiveCalculatorInputs } from '../../utils/instrumentDisplay';
import { findPairInfo } from '../../services/calculator/forexCalculator';
import { findMetalInfo } from '../../services/calculator/goldCalculator';

interface InstrumentInfoProps {
  inputs: ActiveCalculatorInputs;
}

export const InstrumentInfo: React.FC<InstrumentInfoProps> = ({ inputs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isForex = inputs.instrumentType === 'forex';
  const displaySymbol = isForex ? inputs.pair : inputs.symbol;
  
  let base = '';
  let quote = '';
  let pipSize = 0;
  let digits = 0;
  let unitsPerLot = 0;
  let unitLabel = '';

  if (isForex) {
    const info = findPairInfo(inputs.pair);
    base = info.base;
    quote = info.quote;
    pipSize = info.pipSize;
    digits = info.digits;
    unitsPerLot = 100000;
    unitLabel = base;
  } else {
    const info = findMetalInfo(inputs.symbol);
    base = info.metal;
    quote = info.quote;
    pipSize = info.pipSize;
    digits = info.digits;
    unitsPerLot = info.ouncesPerLot;
    unitLabel = 'oz';
  }

  return (
    <div className="neu-raised-card p-5 sm:p-6 space-y-4 border border-[var(--neu-border-subtle)]">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg neu-convex flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--neu-text-primary)]">
              Instrument Specification & Mathematical Formulas
            </h4>
            <p className="text-[11px] text-[var(--neu-text-muted)]">
              Understand the contract rules, pip valuations, and margin formulas for {displaySymbol}.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-xs text-[var(--neu-text-secondary)] hover:text-[var(--accent-cyan)] flex items-center gap-1 font-semibold"
        >
          <span>{isExpanded ? 'Hide Guide' : 'View Formulas'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-[var(--neu-border-subtle)] animate-fadeIn text-xs">
          {/* Contract Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="neu-inset p-3 rounded-xl font-mono-numbers">
              <div className="text-[10px] text-[var(--neu-text-muted)] uppercase">Base / Quote</div>
              <div className="text-xs font-bold text-[var(--neu-text-primary)] mt-0.5">
                {base} / {quote}
              </div>
            </div>

            <div className="neu-inset p-3 rounded-xl font-mono-numbers">
              <div className="text-[10px] text-[var(--neu-text-muted)] uppercase">Standard Lot</div>
              <div className="text-xs font-bold text-[var(--neu-text-primary)] mt-0.5">
                {unitsPerLot.toLocaleString()} {unitLabel}
              </div>
            </div>

            <div className="neu-inset p-3 rounded-xl font-mono-numbers">
              <div className="text-[10px] text-[var(--neu-text-muted)] uppercase">1 Pip Size</div>
              <div className="text-xs font-bold text-[var(--neu-text-primary)] mt-0.5">
                {pipSize} ({digits} decimals)
              </div>
            </div>

            <div className="neu-inset p-3 rounded-xl font-mono-numbers">
              <div className="text-[10px] text-[var(--neu-text-muted)] uppercase">Margin Model</div>
              <div className="text-xs font-bold text-[var(--accent-cyan)] mt-0.5">
                1:{inputs.leverage} Leverage
              </div>
            </div>
          </div>

          {/* Formulas Explanation */}
          <div className="space-y-2.5 neu-inset p-4 rounded-xl text-[var(--neu-text-secondary)] leading-relaxed">
            <div className="font-bold text-[var(--neu-text-primary)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span>Calculation Formulas Used:</span>
            </div>

            <ul className="list-disc list-inside space-y-1.5 font-mono-numbers text-[11px]">
              <li>
                <strong className="text-[var(--neu-text-primary)] font-sans">Required Margin ($):</strong>{' '}
                <span className="text-[var(--accent-cyan)]">
                  (Position Units × Base Price in USD) ÷ Leverage
                </span>
                <div className="text-[10px] text-[var(--neu-text-muted)] pl-4">
                  = ({inputs.lotSize} × {unitsPerLot.toLocaleString()} × {inputs.entryPrice}) ÷ {inputs.leverage}
                </div>
              </li>

              <li>
                <strong className="text-[var(--neu-text-primary)] font-sans">1 Pip Value ($):</strong>{' '}
                <span className="text-[var(--accent-cyan)]">
                  Position Units × Pip Size (0.0001 or 0.01 for JPY)
                </span>
                <div className="text-[10px] text-[var(--neu-text-muted)] pl-4">
                  = ({inputs.lotSize} × {unitsPerLot.toLocaleString()}) × {pipSize}
                </div>
              </li>

              <li>
                <strong className="text-[var(--neu-text-primary)] font-sans">Potential Profit / Loss ($):</strong>{' '}
                <span className="text-[var(--accent-cyan)]">
                  Distance in Pips × 1 Pip Value
                </span>
              </li>

              <li>
                <strong className="text-[var(--neu-text-primary)] font-sans">Risk / Reward Ratio:</strong>{' '}
                <span className="text-[var(--accent-cyan)]">
                  Potential Profit ÷ Potential Loss (expressed as 1 : R)
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
