import React, { useState } from 'react';
import {
  Terminal,
  LogOut,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { TickerBar } from '../components/layout/TickerBar';
import type { UserSession } from '../types/auth';

interface DashboardPageProps {
  session: UserSession;
  onSignOut: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

interface QuickPair {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  isPositive: boolean;
}

const INITIAL_WATCHLIST: QuickPair[] = [
  { symbol: 'EUR/USD', bid: 1.08420, ask: 1.08432, spread: 1.2, change: 0.24, isPositive: true },
  { symbol: 'GBP/USD', bid: 1.29150, ask: 1.29165, spread: 1.5, change: 0.18, isPositive: true },
  { symbol: 'USD/JPY', bid: 154.210, ask: 154.225, spread: 1.5, change: -0.15, isPositive: false },
  { symbol: 'XAU/USD', bid: 2748.80, ask: 2749.15, spread: 35.0, change: 0.88, isPositive: true },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  session,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  const handleQuickOrder = (type: 'BUY' | 'SELL', symbol: string) => {
    setOrderNotification(`${type} 0.50 Lots ${symbol} executed at Market price.`);
    setTimeout(() => setOrderNotification(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative">
      {/* Topside Realtime Currency Ticker (Only rendered inside the Dashboard!) */}
      <TickerBar />

      {/* Main Trading Terminal Canvas */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
        {/* Terminal Header Card */}
        <div className="neu-raised-card p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl neu-convex flex items-center justify-center text-[var(--accent-emerald)] shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[var(--neu-text-primary)]">
                  Terminal Authorized
                </h1>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-emerald)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
                  LIVE ECN
                </span>
                {session.isDemo && (
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-amber)]">
                    DEMO
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--neu-text-secondary)] font-mono-numbers mt-0.5">
                {session.email} • {session.server}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-inset text-xs font-mono-numbers text-[var(--neu-text-secondary)]">
              <Activity className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span>Latency: 1.2ms</span>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-rose)] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Disconnect & Return to Sign In"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        {/* Quick Order Notification Toast */}
        {orderNotification && (
          <div className="p-3 rounded-xl neu-inset border border-[var(--accent-emerald)]/30 flex items-center justify-between text-xs text-[var(--accent-emerald)] animate-fadeIn font-mono-numbers">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{orderNotification}</span>
            </div>
            <span className="text-[10px] text-[var(--neu-text-muted)]">Order ID #89240</span>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="neu-inset p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
              Account Equity
            </div>
            <div className="text-lg font-bold font-mono-numbers text-[var(--accent-cyan)] mt-1">
              ${session.equity?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '102,450.00'}
            </div>
            <div className="text-[11px] text-[var(--accent-emerald)] font-mono-numbers mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+2.45% MTD</span>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
              Balance
            </div>
            <div className="text-lg font-bold font-mono-numbers text-[var(--neu-text-primary)] mt-1">
              ${session.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '100,000.00'}
            </div>
            <div className="text-[11px] text-[var(--neu-text-muted)] font-mono-numbers mt-0.5">
              Settled: USD
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
              Free Margin
            </div>
            <div className="text-lg font-bold font-mono-numbers text-[var(--neu-text-primary)] mt-1">
              $98,450.00
            </div>
            <div className="text-[11px] text-[var(--accent-emerald)] font-mono-numbers mt-0.5">
              Margin Level: 1,420%
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--neu-text-muted)]">
              Active Risk
            </div>
            <div className="text-lg font-bold font-mono-numbers text-[var(--accent-amber)] mt-1">
              1.00% ($1,000)
            </div>
            <div className="text-[11px] text-[var(--accent-cyan)] font-mono-numbers mt-0.5">
              Max Drawdown: 4.8%
            </div>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Live Watchlist & Quick Execution (2 Columns) */}
          <div className="lg:col-span-2 neu-raised-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent-cyan)]" />
                <h2 className="text-sm font-bold text-[var(--neu-text-primary)]">
                  Live Market Watch & Quick Execution
                </h2>
              </div>
              <span className="text-[11px] font-mono-numbers text-[var(--neu-text-muted)]">
                ECN Zero Spread Tier
              </span>
            </div>

            <div className="space-y-2.5">
              {INITIAL_WATCHLIST.map((pair) => (
                <div
                  key={pair.symbol}
                  className="neu-inset p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 transition-colors hover:bg-[var(--neu-surface-active)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg neu-convex flex items-center justify-center font-bold text-xs text-[var(--neu-text-primary)]">
                      {pair.symbol.split('/')[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[var(--neu-text-primary)]">
                        {pair.symbol}
                      </div>
                      <div className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
                        Spread: {pair.spread} pips
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono-numbers">
                      <div className="text-xs font-semibold text-[var(--neu-text-primary)]">
                        {pair.bid.toFixed(pair.symbol === 'XAU/USD' ? 2 : 5)}
                      </div>
                      <div
                        className={`text-[10px] font-semibold flex items-center justify-end ${
                          pair.isPositive ? 'text-[var(--accent-emerald)]' : 'text-[var(--accent-rose)]'
                        }`}
                      >
                        {pair.isPositive ? (
                          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                        )}
                        {pair.change > 0 ? '+' : ''}
                        {pair.change}%
                      </div>
                    </div>

                    {/* Quick Trade Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickOrder('SELL', pair.symbol)}
                        className="neu-btn px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownRight className="w-3 h-3" />
                        <span>SELL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickOrder('BUY', pair.symbol)}
                        className="neu-btn px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/10 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        <span>BUY</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Control & Handshake Status (1 Column) */}
          <div className="neu-raised-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--accent-amber)]" />
                <h2 className="text-sm font-bold text-[var(--neu-text-primary)]">
                  Risk Safeguards
                </h2>
              </div>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full neu-inset text-[var(--accent-emerald)]">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="neu-inset p-3 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-[var(--neu-text-primary)]">
                  Daily Loss Protector
                </div>
                <div className="text-[10px] text-[var(--neu-text-muted)]">
                  Auto-disconnects terminal if drawdown exceeds 3.00% ($3,000).
                </div>
                <div className="w-full bg-[var(--neu-bg)] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[var(--accent-cyan)] h-full rounded-full w-[33%]" />
                </div>
              </div>

              <div className="neu-inset p-3 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-[var(--neu-text-primary)]">
                  Leverage Cap
                </div>
                <div className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
                  Institutional 1:100 ECN Margin
                </div>
              </div>

              <div className="neu-inset p-3 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-[var(--neu-text-primary)]">
                  Encryption Handshake
                </div>
                <div className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
                  TLS 1.3 • AES-256-GCM Session Key
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
