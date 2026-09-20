import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Coins, CircleDollarSign, TrendingUp, Bitcoin, BarChart3 } from 'lucide-react';
import type { InstrumentType } from '../../types/calculator';
import { SUPPORTED_INSTRUMENTS } from '../../services/calculator/calculatorEngine';

interface InstrumentSelectorProps {
  selected: InstrumentType;
  onSelect: (type: InstrumentType) => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ selected, onSelect }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<InstrumentType, HTMLButtonElement | null>>>({});
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [animatePill, setAnimatePill] = useState(false);

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

  const updatePill = useCallback(() => {
    const track = trackRef.current;
    const button = buttonRefs.current[selected];
    if (!track || !button) return;

    const trackBox = track.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();

    setPill({
      left: buttonBox.left - trackBox.left,
      top: buttonBox.top - trackBox.top,
      width: buttonBox.width,
      height: buttonBox.height,
    });
  }, [selected]);

  useLayoutEffect(() => {
    updatePill();
    const frame = requestAnimationFrame(() => setAnimatePill(true));
    return () => cancelAnimationFrame(frame);
  }, [updatePill]);

  useEffect(() => {
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

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

      <div
        ref={trackRef}
        className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 neu-inset p-1.5 rounded-2xl"
      >
        <span
          aria-hidden
          className={`asset-class-pill pointer-events-none absolute z-0 rounded-xl ${
            animatePill ? 'asset-class-pill-ready' : ''
          }`}
          style={{
            transform: `translate3d(${pill.left}px, ${pill.top}px, 0)`,
            width: pill.width,
            height: pill.height,
          }}
        />

        {SUPPORTED_INSTRUMENTS.map((spec) => {
          const isSelected = selected === spec.id;
          return (
            <button
              key={spec.id}
              ref={(node) => {
                buttonRefs.current[spec.id] = node;
              }}
              type="button"
              onClick={() => {
                if (spec.supported) {
                  onSelect(spec.id);
                }
              }}
              disabled={!spec.supported}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold select-none ${
                isSelected
                  ? 'text-[#0c0f17] font-bold'
                  : spec.supported
                  ? 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)] cursor-pointer'
                  : 'opacity-40 cursor-not-allowed text-[var(--neu-text-muted)]'
              }`}
            >
              {getIcon(spec.id)}
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
