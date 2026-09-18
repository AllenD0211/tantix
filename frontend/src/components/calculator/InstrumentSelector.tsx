import React from 'react';
import { Coins, CircleDollarSign, TrendingUp, Bitcoin, BarChart3 } from 'lucide-react';
import type { InstrumentType } from '../../types/calculator';
import { SUPPORTED_INSTRUMENTS } from '../../services/calculator/calculatorEngine';

interface InstrumentSelectorProps {
  selected: InstrumentType;
  onSelect: (type: InstrumentType) => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ selected, onSelect }) => {
  const getIcon = (id: InstrumentType) => {
    switch (id) {
      case 'forex':
        return <CircleDollarSign className="w-4 h-4" />;
      case 'gold':
        return <Coins className="w-4 h-4" />;
      case 'stocks':
        return <TrendingUp className="w-4 h-4" />;
      case 'crypto':
        return <Bitcoin className="w-4 h-4" />;
      case 'indices':
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[var(--neu-text-secondary)]">
          Select Trading Asset Class
        </span>
        <span className="text-[10px] text-[var(--accent-cyan)] font-mono-numbers">
          Active: {selected.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 neu-inset p-1.5 rounded-2xl">
        {SUPPORTED_INSTRUMENTS.map((spec) => {
          const isSelected = selected === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => {
                if (spec.supported) {
                  onSelect(spec.id);
                }
              }}
              disabled={!spec.supported}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform active:scale-95 cursor-pointer select-none ${
                isSelected
                  ? 'neu-btn-primary shadow-[0_4px_16px_var(--accent-cyan-glow)] scale-[1.03] z-10 font-bold'
                  : spec.supported
                  ? 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)] hover:scale-[1.02] hover:bg-[var(--neu-surface-elevated)]'
                  : 'opacity-40 cursor-not-allowed text-[var(--neu-text-muted)]'
              }`}
            >
              <span className={`transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                {getIcon(spec.id)}
              </span>
              <span className="truncate">{spec.name.split(' ')[0]}</span>
              {!spec.supported && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--neu-surface-active)] text-[var(--neu-text-muted)] font-mono-numbers">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
