import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wifi } from 'lucide-react';
import type { TickerItem } from '../../types/market';

const INITIAL_PAIRS: TickerItem[] = [
  { symbol: 'EUR/USD', bid: 1.08420, ask: 1.08432, change: 0.24, isPositive: true, spread: 1.2, digits: 5 },
  { symbol: 'GBP/USD', bid: 1.29150, ask: 1.29165, change: 0.18, isPositive: true, spread: 1.5, digits: 5 },
  { symbol: 'USD/JPY', bid: 154.210, ask: 154.225, change: -0.15, isPositive: false, spread: 1.5, digits: 3 },
  { symbol: 'AUD/USD', bid: 0.65840, ask: 0.65853, change: -0.32, isPositive: false, spread: 1.3, digits: 5 },
  { symbol: 'XAU/USD', bid: 2748.80, ask: 2749.15, change: 0.88, isPositive: true, spread: 35, digits: 2 },
  { symbol: 'USD/CAD', bid: 1.38210, ask: 1.38224, change: 0.05, isPositive: true, spread: 1.4, digits: 5 },
];

export const TickerBar: React.FC = () => {
  const [pairs, setPairs] = useState<TickerItem[]>(INITIAL_PAIRS);
  const [updatedSymbol, setUpdatedSymbol] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) => {
        const targetIndex = Math.floor(Math.random() * prev.length);
        const item = prev[targetIndex];
        const delta = (Math.random() - 0.48) * (item.symbol === 'XAU/USD' ? 0.35 : 0.00008);
        const newBid = Math.max(0.0001, item.bid + delta);
        const newAsk = newBid + item.spread * (item.digits === 3 || item.digits === 2 ? 0.01 : 0.0001);
        const isUp = delta >= 0;

        setUpdatedSymbol(item.symbol);
        setTimeout(() => setUpdatedSymbol(null), 700);

        return prev.map((p, idx) =>
          idx === targetIndex
            ? { ...p, bid: newBid, ask: newAsk, isPositive: isUp }
            : p
        );
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full neu-raised-card px-3 sm:px-4 py-2.5 border border-[var(--neu-border-subtle)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="neu-inset px-2.5 py-1 rounded-lg flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-emerald)] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-emerald)]" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--neu-text-secondary)] font-mono-numbers">
              LD4 ECN FEED
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--neu-text-muted)] font-mono-numbers">
            <Wifi className="w-3 h-3 text-[var(--accent-cyan)]" />
            <span>1.2ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto py-0.5 text-xs scrollbar-none min-w-0 flex-1">
          {pairs.map((pair) => {
            const isFlashing = updatedSymbol === pair.symbol;
            return (
              <div
                key={pair.symbol}
                className={`neu-inset px-2.5 py-1 rounded-lg flex items-center gap-2 shrink-0 transition-all duration-200 ${
                  isFlashing
                    ? pair.isPositive
                      ? 'ring-1 ring-[var(--accent-emerald)]/50 bg-[var(--accent-emerald)]/5'
                      : 'ring-1 ring-[var(--accent-rose)]/50 bg-[var(--accent-rose)]/5'
                    : ''
                }`}
              >
                <span className="font-bold text-[var(--neu-text-primary)] tracking-tight text-[11px]">
                  {pair.symbol}
                </span>
                <span className="font-mono-numbers font-medium text-[var(--neu-text-secondary)] text-[11px]">
                  {pair.bid.toFixed(pair.digits)}
                </span>
                <span
                  className={`flex items-center text-[10px] font-mono-numbers font-semibold ${
                    pair.isPositive ? 'text-[var(--accent-emerald)]' : 'text-[var(--accent-rose)]'
                  }`}
                >
                  {pair.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {pair.isPositive ? '+' : ''}
                  {pair.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
