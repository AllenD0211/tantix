import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TickerItem } from '../../types/market';

const INITIAL_PAIRS: TickerItem[] = [
  // Major Forex Pairs
  { symbol: 'EUR/USD', bid: 1.08420, ask: 1.08432, change: 0.24, isPositive: true, spread: 1.2, digits: 5 },
  { symbol: 'GBP/USD', bid: 1.29150, ask: 1.29165, change: 0.18, isPositive: true, spread: 1.5, digits: 5 },
  { symbol: 'USD/JPY', bid: 154.210, ask: 154.225, change: -0.15, isPositive: false, spread: 1.5, digits: 3 },
  { symbol: 'AUD/USD', bid: 0.65840, ask: 0.65853, change: -0.32, isPositive: false, spread: 1.3, digits: 5 },
  { symbol: 'USD/CAD', bid: 1.38210, ask: 1.38224, change: 0.05, isPositive: true, spread: 1.4, digits: 5 },
  { symbol: 'NZD/USD', bid: 0.60120, ask: 0.60135, change: -0.14, isPositive: false, spread: 1.5, digits: 5 },
  { symbol: 'USD/CHF', bid: 0.87650, ask: 0.87665, change: 0.11, isPositive: true, spread: 1.5, digits: 5 },
  // Cross Pairs
  { symbol: 'EUR/GBP', bid: 0.83920, ask: 0.83938, change: 0.06, isPositive: true, spread: 1.8, digits: 5 },
  { symbol: 'EUR/JPY', bid: 167.180, ask: 167.200, change: 0.10, isPositive: true, spread: 2.0, digits: 3 },
  { symbol: 'GBP/JPY', bid: 199.230, ask: 199.260, change: -0.22, isPositive: false, spread: 3.0, digits: 3 },
  { symbol: 'AUD/JPY', bid: 101.560, ask: 101.580, change: -0.08, isPositive: false, spread: 2.0, digits: 3 },
  { symbol: 'EUR/AUD', bid: 1.64620, ask: 1.64645, change: 0.33, isPositive: true, spread: 2.5, digits: 5 },
  // Metals & Commodities
  { symbol: 'XAU/USD', bid: 2748.80, ask: 2749.15, change: 0.88, isPositive: true, spread: 35, digits: 2 },
  { symbol: 'XAG/USD', bid: 32.450, ask: 32.478, change: 0.52, isPositive: true, spread: 2.8, digits: 3 },
  // Crypto
  { symbol: 'BTC/USD', bid: 67420.50, ask: 67445.00, change: 1.24, isPositive: true, spread: 24.5, digits: 2 },
  { symbol: 'ETH/USD', bid: 3580.20, ask: 3582.80, change: -0.45, isPositive: false, spread: 2.6, digits: 2 },
  // Indices
  { symbol: 'US30', bid: 42850.50, ask: 42853.00, change: 0.34, isPositive: true, spread: 2.5, digits: 2 },
  { symbol: 'NAS100', bid: 19420.25, ask: 19422.75, change: 0.56, isPositive: true, spread: 2.5, digits: 2 },
];

export const TickerBar: React.FC = () => {
  const [pairs, setPairs] = useState<TickerItem[]>(INITIAL_PAIRS);
  const [updatedSymbol, setUpdatedSymbol] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) => {
        const targetIndex = Math.floor(Math.random() * prev.length);
        const item = prev[targetIndex];

        let multiplier = 0.00008;
        if (item.symbol === 'XAU/USD') multiplier = 0.35;
        else if (item.symbol === 'XAG/USD') multiplier = 0.015;
        else if (item.symbol === 'BTC/USD') multiplier = 15;
        else if (item.symbol === 'ETH/USD') multiplier = 1.5;
        else if (item.symbol === 'US30' || item.symbol === 'NAS100') multiplier = 3;
        else if (item.digits === 3) multiplier = 0.015;

        const delta = (Math.random() - 0.48) * multiplier;
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
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  // Track scroll position to show/hide arrows
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="w-full neu-raised-card px-2 sm:px-3 py-2 border border-[var(--neu-border-subtle)] relative group">
      <div className="flex items-center gap-2">
        {/* Live indicator dot */}
        <div className="flex items-center shrink-0">
          <div className="neu-inset px-2 py-1 rounded-lg flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-emerald)] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-emerald)]" />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--neu-text-muted)] hidden sm:inline">
              LIVE
            </span>
          </div>
        </div>

        {/* Left scroll arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[var(--neu-text-muted)] hover:text-[var(--accent-cyan)] hover:bg-[var(--neu-surface-active)] transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Scrollable ticker strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs min-w-0 flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {pairs.map((pair) => {
            const isFlashing = updatedSymbol === pair.symbol;
            return (
              <div
                key={pair.symbol}
                className={`neu-inset px-2 py-1 rounded-lg flex items-center gap-1.5 shrink-0 transition-all duration-200 ${
                  isFlashing
                    ? pair.isPositive
                      ? 'ring-1 ring-[var(--accent-emerald)]/50 bg-[var(--accent-emerald)]/5'
                      : 'ring-1 ring-[var(--accent-rose)]/50 bg-[var(--accent-rose)]/5'
                    : ''
                }`}
              >
                <span className="font-bold text-[var(--neu-text-primary)] tracking-tight text-[10px]">
                  {pair.symbol}
                </span>
                <span className="font-mono-numbers font-medium text-[var(--neu-text-secondary)] text-[10px]">
                  {pair.bid.toFixed(pair.digits)}
                </span>
                <span
                  className={`flex items-center text-[9px] font-mono-numbers font-semibold ${
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

        {/* Right scroll arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[var(--neu-text-muted)] hover:text-[var(--accent-cyan)] hover:bg-[var(--neu-surface-active)] transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
