import React from 'react';
import {
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import type { TradeDirection } from '../../types/calculator';
import { POPULAR_FOREX_PAIRS, findPairInfo } from '../../services/calculator/forexCalculator';
import { METAL_INSTRUMENTS, findMetalInfo } from '../../services/calculator/goldCalculator';
import { POPULAR_STOCKS, findStockInfo } from '../../services/calculator/stockCalculator';
import { POPULAR_CRYPTO_PAIRS, findCryptoInfo } from '../../services/calculator/cryptoCalculator';
import { POPULAR_EQUITY_INDICES, findPointIndexInfo } from '../../services/calculator/indexCalculator';
import type { ActiveCalculatorInputs } from '../../utils/instrumentDisplay';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CalculatorFormProps {
  inputs: ActiveCalculatorInputs;
  errors: Record<string, string>;
  onChange: (inputs: ActiveCalculatorInputs) => void;
  onReset: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  errors,
  onChange,
  onReset,
}) => {
  const isGold = inputs.instrumentType === 'gold';
  const isStocks = inputs.instrumentType === 'stocks';
  const isCrypto = inputs.instrumentType === 'crypto';
  const isIndices = inputs.instrumentType === 'indices';
  const isForex = inputs.instrumentType === 'forex';

  const metalInfo = isGold ? findMetalInfo(inputs.symbol) : null;
  const stockInfo = isStocks ? findStockInfo(inputs.symbol) : null;
  const cryptoInfo = isCrypto ? findCryptoInfo(inputs.pair) : null;
  const indexInfo = isIndices ? findPointIndexInfo(inputs.symbol) : null;
  const pairInfo = isForex ? findPairInfo(inputs.pair) : null;

  const pipSize = isGold
    ? metalInfo!.pipSize
    : isStocks
    ? 0.01
    : isCrypto
    ? Math.pow(10, -cryptoInfo!.digits)
    : isIndices
    ? Math.pow(10, -indexInfo!.digits)
    : pairInfo!.pipSize;

  const digits = isGold
    ? metalInfo!.digits
    : isStocks
    ? 2
    : isCrypto
    ? cryptoInfo!.digits
    : isIndices
    ? indexInfo!.digits
    : pairInfo!.digits;

  const defaultPrice = isGold
    ? metalInfo!.defaultPrice
    : isStocks
    ? stockInfo!.defaultPrice
    : isCrypto
    ? cryptoInfo!.defaultPrice
    : isIndices
    ? indexInfo!.defaultPrice
    : pairInfo!.defaultPrice;

  const lotUnitLabel = isGold
    ? `1 Lot = ${metalInfo!.ouncesPerLot.toLocaleString()} troy oz`
    : isStocks
    ? '1 Share = 1 Equity Unit'
    : isCrypto
    ? `1 Unit = 1 ${cryptoInfo?.baseCoin || 'Coin'} Contract`
    : isIndices
    ? '1 Contract = $1 Per Point Multiplier'
    : '1 Lot = 100,000 units';

  const applyInstrumentChange = (next: ActiveCalculatorInputs) => onChange(next);

  const handleForexPairChange = (symbol: string) => {
    if (inputs.instrumentType !== 'forex') return;
    const pair = findPairInfo(symbol);
    const isBuy = inputs.direction === 'BUY';
    const entry = pair.defaultPrice;
    const pipDiff = pair.pipSize * 50;
    const tpDiff = pair.pipSize * 100;

    applyInstrumentChange({
      ...inputs,
      pair: symbol,
      entryPrice: entry,
      stopLossPrice: isBuy
        ? Number((entry - pipDiff).toFixed(pair.digits))
        : Number((entry + pipDiff).toFixed(pair.digits)),
      takeProfitPrice: isBuy
        ? Number((entry + tpDiff).toFixed(pair.digits))
        : Number((entry - tpDiff).toFixed(pair.digits)),
    });
  };

  const handleMetalChange = (symbol: string) => {
    if (inputs.instrumentType !== 'gold') return;
    const metal = findMetalInfo(symbol);
    const isBuy = inputs.direction === 'BUY';
    const entry = metal.defaultPrice;
    const slDiff = metal.pipSize * 100;
    const tpDiff = metal.pipSize * 200;

    applyInstrumentChange({
      ...inputs,
      symbol,
      entryPrice: entry,
      stopLossPrice: isBuy
        ? Number((entry - slDiff).toFixed(metal.digits))
        : Number((entry + slDiff).toFixed(metal.digits)),
      takeProfitPrice: isBuy
        ? Number((entry + tpDiff).toFixed(metal.digits))
        : Number((entry - tpDiff).toFixed(metal.digits)),
    });
  };

  const handleStockChange = (symbol: string) => {
    if (inputs.instrumentType !== 'stocks') return;
    const stock = findStockInfo(symbol);
    const isBuy = inputs.direction === 'BUY';
    const entry = stock.defaultPrice;
    const slDiff = 10;
    const tpDiff = 25;

    applyInstrumentChange({
      ...inputs,
      symbol,
      entryPrice: entry,
      stopLossPrice: isBuy
        ? Number((entry - slDiff).toFixed(2))
        : Number((entry + slDiff).toFixed(2)),
      takeProfitPrice: isBuy
        ? Number((entry + tpDiff).toFixed(2))
        : Number((entry - tpDiff).toFixed(2)),
    });
  };

  const handleCryptoChange = (pair: string) => {
    if (inputs.instrumentType !== 'crypto') return;
    const crypto = findCryptoInfo(pair);
    const isBuy = inputs.direction === 'BUY';
    const entry = crypto.defaultPrice;
    const slDiff = entry * 0.05; // 5% default SL
    const tpDiff = entry * 0.10; // 10% default TP

    applyInstrumentChange({
      ...inputs,
      pair,
      entryPrice: entry,
      stopLossPrice: isBuy
        ? Number((entry - slDiff).toFixed(crypto.digits))
        : Number((entry + slDiff).toFixed(crypto.digits)),
      takeProfitPrice: isBuy
        ? Number((entry + tpDiff).toFixed(crypto.digits))
        : Number((entry - tpDiff).toFixed(crypto.digits)),
    });
  };

  const handleIndexChange = (symbol: string) => {
    if (inputs.instrumentType !== 'indices') return;
    const index = findPointIndexInfo(symbol);
    const isBuy = inputs.direction === 'BUY';
    const entry = index.defaultPrice;
    const slDiff = symbol === 'SPX500' ? 50 : 200;
    const tpDiff = symbol === 'SPX500' ? 100 : 400;

    applyInstrumentChange({
      ...inputs,
      symbol,
      entryPrice: entry,
      stopLossPrice: isBuy
        ? Number((entry - slDiff).toFixed(index.digits))
        : Number((entry + slDiff).toFixed(index.digits)),
      takeProfitPrice: isBuy
        ? Number((entry + tpDiff).toFixed(index.digits))
        : Number((entry - tpDiff).toFixed(index.digits)),
    });
  };

  const handleDirectionChange = (direction: TradeDirection) => {
    if (direction === inputs.direction) return;

    const entry = inputs.entryPrice;
    const currentSlDist = inputs.stopLossPrice
      ? Math.abs(entry - inputs.stopLossPrice)
      : isStocks
      ? 10
      : isCrypto
      ? entry * 0.05
      : isIndices
      ? 200
      : pipSize * (isGold ? 100 : 50);
    const currentTpDist = inputs.takeProfitPrice
      ? Math.abs(entry - inputs.takeProfitPrice)
      : isStocks
      ? 25
      : isCrypto
      ? entry * 0.10
      : isIndices
      ? 400
      : pipSize * (isGold ? 200 : 100);

    const newSl = direction === 'BUY' ? entry - currentSlDist : entry + currentSlDist;
    const newTp = direction === 'BUY' ? entry + currentTpDist : entry - currentTpDist;

    applyInstrumentChange({
      ...inputs,
      direction,
      stopLossPrice: Number(newSl.toFixed(digits)),
      takeProfitPrice: Number(newTp.toFixed(digits)),
    });
  };

  const applyPipsToStopLoss = (presetVal: number) => {
    const isBuy = inputs.direction === 'BUY';
    const delta = isStocks || isCrypto || isIndices ? presetVal : presetVal * pipSize;
    const newSl = isBuy ? inputs.entryPrice - delta : inputs.entryPrice + delta;
    applyInstrumentChange({
      ...inputs,
      stopLossPrice: Number(newSl.toFixed(digits)),
    });
  };

  const applyPipsToTakeProfit = (presetVal: number) => {
    const isBuy = inputs.direction === 'BUY';
    const delta = isStocks || isCrypto || isIndices ? presetVal : presetVal * pipSize;
    const newTp = isBuy ? inputs.entryPrice + delta : inputs.entryPrice - delta;
    applyInstrumentChange({
      ...inputs,
      takeProfitPrice: Number(newTp.toFixed(digits)),
    });
  };

  const getSlPresets = () => {
    if (isGold) return [50, 100, 200, 500];
    if (isStocks) return [2, 5, 10, 20];
    if (isCrypto) {
      const base = inputs.entryPrice || 1000;
      return [
        Number((base * 0.02).toFixed(digits > 2 ? digits : 0)),
        Number((base * 0.05).toFixed(digits > 2 ? digits : 0)),
        Number((base * 0.10).toFixed(digits > 2 ? digits : 0)),
      ];
    }
    if (isIndices) {
      return inputs.symbol === 'SPX500' ? [20, 50, 100, 200] : [50, 100, 200, 500];
    }
    return [20, 30, 50, 100];
  };

  const getTpPresets = () => {
    if (isGold) return [100, 200, 500, 1000];
    if (isStocks) return [5, 15, 25, 50];
    if (isCrypto) {
      const base = inputs.entryPrice || 1000;
      return [
        Number((base * 0.05).toFixed(digits > 2 ? digits : 0)),
        Number((base * 0.10).toFixed(digits > 2 ? digits : 0)),
        Number((base * 0.20).toFixed(digits > 2 ? digits : 0)),
      ];
    }
    if (isIndices) {
      return inputs.symbol === 'SPX500' ? [50, 100, 200, 400] : [100, 200, 500, 1000];
    }
    return [30, 50, 100, 150];
  };

  const slPresets = getSlPresets();
  const tpPresets = getTpPresets();

  return (
    <div className="neu-raised-card p-5 sm:p-6 space-y-5 border border-[var(--neu-border-subtle)]">
      <div className="flex items-center justify-between border-b border-[var(--neu-border-subtle)] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[var(--neu-text-primary)]">
            Manual Trade Input Parameters
          </h3>
          <p className="text-xs text-[var(--neu-text-muted)] mt-0.5">
            {isGold
              ? 'Model spot gold and silver contracts using troy-ounce lots, margin, and P/L.'
              : isStocks
              ? 'Model equity shares, position size, margin requirements, and risk-to-reward.'
              : isCrypto
              ? 'Model crypto perpetual futures contracts, coin size, and leverage margins.'
              : isIndices
              ? 'Model global equity index contracts (US30, NAS100, SPX500) using point valuation and margin.'
              : 'Enter your trade parameters to compute real-time margins and P/L.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-[var(--neu-text-muted)] hover:text-[var(--accent-cyan)] flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Reset to default values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            Trade Direction (Order Type)
          </label>
          <div className="grid grid-cols-2 gap-2 neu-inset p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleDirectionChange('BUY')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputs.direction === 'BUY'
                  ? 'bg-[var(--accent-emerald)] text-[#0c0f17] shadow-[0_2px_10px_var(--accent-emerald-glow)]'
                  : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>BUY (LONG)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDirectionChange('SELL')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputs.direction === 'SELL'
                  ? 'bg-[var(--accent-rose)] text-[#ffffff] shadow-[0_2px_10px_var(--accent-rose-glow)]'
                  : 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>SELL (SHORT)</span>
            </button>
          </div>
        </div>

        {isGold ? (
          <Select
            label="Metal Contract"
            value={inputs.symbol}
            onChange={(e) => handleMetalChange(e.target.value)}
            options={METAL_INSTRUMENTS.map((m) => ({
              value: m.symbol,
              label: m.symbol,
              subLabel: `${m.name} · ${m.defaultPrice.toFixed(m.digits)}`,
            }))}
            error={errors.symbol}
          />
        ) : isStocks ? (
          <Select
            label="Stock Symbol"
            value={inputs.symbol}
            onChange={(e) => handleStockChange(e.target.value)}
            options={POPULAR_STOCKS.map((s) => ({
              value: s.symbol,
              label: `${s.symbol} - ${s.name}`,
              subLabel: `Ref Price: $${s.defaultPrice.toFixed(2)}`,
            }))}
            error={errors.symbol}
          />
        ) : isCrypto ? (
          <Select
            label="Crypto Perpetual Contract"
            value={inputs.pair}
            onChange={(e) => handleCryptoChange(e.target.value)}
            options={POPULAR_CRYPTO_PAIRS.map((c) => ({
              value: c.pair,
              label: `${c.pair} (${c.name})`,
              subLabel: `Ref Price: $${c.defaultPrice.toLocaleString()}`,
            }))}
            error={errors.pair}
          />
        ) : isIndices ? (
          <Select
            label="Equity Index Instrument"
            value={inputs.symbol}
            onChange={(e) => handleIndexChange(e.target.value)}
            options={POPULAR_EQUITY_INDICES.map((i) => ({
              value: i.symbol,
              label: `${i.symbol} - ${i.name}`,
              subLabel: `Ref Index: ${i.defaultPrice.toLocaleString()}`,
            }))}
            error={errors.symbol}
          />
        ) : (
          <Select
            label="Currency Pair"
            value={inputs.pair}
            onChange={(e) => handleForexPairChange(e.target.value)}
            options={POPULAR_FOREX_PAIRS.map((p) => ({
              value: p.symbol,
              label: p.symbol,
              subLabel: `Ref: ${p.defaultPrice.toFixed(p.digits)}`,
            }))}
            error={errors.pair}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Account Balance"
          type="number"
          prefix="$"
          suffix="USD"
          min="1"
          step="100"
          value={inputs.accountBalance || ''}
          onChange={(e) =>
            applyInstrumentChange({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })
          }
          error={errors.accountBalance}
        />

        <Select
          label="Account Leverage"
          value={inputs.leverage}
          onChange={(e) =>
            applyInstrumentChange({ ...inputs, leverage: parseInt(e.target.value, 10) || 1 })
          }
          options={
            isStocks
              ? [
                  { value: 1, label: '1:1 (No Leverage / Cash)' },
                  { value: 2, label: '1:2 (Reg T Margin)' },
                  { value: 5, label: '1:5 (Standard CFD / Equity)' },
                  { value: 10, label: '1:10 (Day Trading Margin)' },
                  { value: 20, label: '1:20 (Max Equity CFD)' },
                ]
              : isCrypto
              ? [
                  { value: 1, label: '1:1 (Spot / 1x)' },
                  { value: 2, label: '1:2 (2x Low Margin)' },
                  { value: 5, label: '1:5 (5x Standard)' },
                  { value: 10, label: '1:10 (10x Leverage)' },
                  { value: 20, label: '1:20 (20x Perpetual)' },
                  { value: 50, label: '1:50 (50x High Risk)' },
                  { value: 100, label: '1:100 (100x Max Degen)' },
                ]
              : isIndices
              ? [
                  { value: 10, label: '1:10 (Conservative Margin)' },
                  { value: 20, label: '1:20 (EU/UK Retail Cap)' },
                  { value: 50, label: '1:50 (Standard Index ECN)' },
                  { value: 100, label: '1:100 (Standard ECN)' },
                  { value: 200, label: '1:200 (Professional)' },
                ]
              : [
                  { value: 20, label: '1:20 (Metals Retail)' },
                  { value: 30, label: '1:30 (Retail Standard EU/UK)' },
                  { value: 50, label: '1:50 (US Regulated Cap)' },
                  { value: 100, label: '1:100 (Standard ECN)' },
                  { value: 200, label: '1:200 (Professional)' },
                  { value: 500, label: '1:500 (High Leverage)' },
                ]
          }
          error={errors.leverage}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            {isStocks
              ? 'Position Size (Share Quantity)'
              : isCrypto
              ? 'Position Size (Coin Amount)'
              : isIndices
              ? 'Position Size (Contract Quantity)'
              : 'Position Size (Lot Size)'}
          </label>
          <span className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">
            {lotUnitLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[140px]">
            {isStocks ? (
              <Input
                type="number"
                step="1"
                min="1"
                max="100000"
                suffix="Shares"
                value={(inputs as any).shares || ''}
                onChange={(e) =>
                  applyInstrumentChange({ ...inputs, shares: parseInt(e.target.value, 10) || 0 } as any)
                }
                error={errors.shares}
              />
            ) : isCrypto ? (
              <Input
                type="number"
                step="0.01"
                min="0.001"
                max="10000"
                suffix={cryptoInfo?.baseCoin || 'Coins'}
                value={(inputs as any).coinAmount || ''}
                onChange={(e) =>
                  applyInstrumentChange({ ...inputs, coinAmount: parseFloat(e.target.value) || 0 } as any)
                }
                error={(errors as any).coinAmount}
              />
            ) : isIndices ? (
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                suffix="Contracts"
                value={(inputs as any).contracts || ''}
                onChange={(e) =>
                  applyInstrumentChange({ ...inputs, contracts: parseFloat(e.target.value) || 0 } as any)
                }
                error={(errors as any).contracts}
              />
            ) : (
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                suffix="Lots"
                value={(inputs as any).lotSize || ''}
                onChange={(e) =>
                  applyInstrumentChange({ ...inputs, lotSize: parseFloat(e.target.value) || 0 } as any)
                }
                error={errors.lotSize}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isStocks
              ? [10, 50, 100, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyInstrumentChange({ ...inputs, shares: preset } as any)}
                    className={`neu-btn px-2.5 py-2 rounded-lg text-xs font-mono-numbers cursor-pointer transition-colors ${
                      (inputs as any).shares === preset
                        ? 'text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
                        : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))
              : isCrypto
              ? [0.05, 0.1, 0.5, 1.0, 5.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyInstrumentChange({ ...inputs, coinAmount: preset } as any)}
                    className={`neu-btn px-2.5 py-2 rounded-lg text-xs font-mono-numbers cursor-pointer transition-colors ${
                      (inputs as any).coinAmount === preset
                        ? 'text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
                        : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
                    }`}
                  >
                    {preset} {cryptoInfo?.baseCoin || ''}
                  </button>
                ))
              : isIndices
              ? [0.1, 0.5, 1.0, 2.0, 5.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyInstrumentChange({ ...inputs, contracts: preset } as any)}
                    className={`neu-btn px-2.5 py-2 rounded-lg text-xs font-mono-numbers cursor-pointer transition-colors ${
                      (inputs as any).contracts === preset
                        ? 'text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
                        : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))
              : [0.01, 0.1, 0.5, 1.0, 2.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyInstrumentChange({ ...inputs, lotSize: preset } as any)}
                    className={`neu-btn px-2.5 py-2 rounded-lg text-xs font-mono-numbers cursor-pointer transition-colors ${
                      (inputs as any).lotSize === preset
                        ? 'text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
                        : 'text-[var(--neu-text-secondary)] hover:text-[var(--neu-text-primary)]'
                    }`}
                  >
                    {preset.toFixed(2)}
                  </button>
                ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            {isStocks
              ? 'Entry Share Price'
              : isCrypto
              ? 'Entry Coin Price'
              : isIndices
              ? 'Entry Index Price'
              : 'Entry Price'}
          </label>
          <button
            type="button"
            onClick={() => applyInstrumentChange({ ...inputs, entryPrice: defaultPrice })}
            className="text-[10px] text-[var(--accent-cyan)] hover:underline cursor-pointer flex items-center gap-1 font-mono-numbers"
          >
            <Sparkles className="w-3 h-3" />
            Set to {defaultPrice.toLocaleString()}
          </button>
        </div>

        <Input
          type="number"
          step={pipSize}
          value={inputs.entryPrice || ''}
          onChange={(e) =>
            applyInstrumentChange({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })
          }
          error={errors.entryPrice}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            label="Stop Loss Price"
            type="number"
            step={pipSize}
            hint={inputs.direction === 'BUY' ? 'Must be below Entry' : 'Must be above Entry'}
            value={inputs.stopLossPrice ?? ''}
            onChange={(e) =>
              applyInstrumentChange({
                ...inputs,
                stopLossPrice: e.target.value === '' ? undefined : parseFloat(e.target.value),
              })
            }
            error={errors.stopLossPrice}
          />

          <div className="flex items-center gap-1 text-[10px] text-[var(--neu-text-muted)] flex-wrap">
            <span className="font-semibold">Quick SL:</span>
            {slPresets.map((presetVal) => (
              <button
                key={presetVal}
                type="button"
                onClick={() => applyPipsToStopLoss(presetVal)}
                className="neu-btn px-2 py-0.5 rounded text-[10px] font-mono-numbers text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 cursor-pointer"
              >
                -{isStocks || isCrypto ? `$${presetVal}` : isIndices ? `${presetVal} pts` : `${presetVal} pips`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Input
            label="Take Profit Price"
            type="number"
            step={pipSize}
            hint={inputs.direction === 'BUY' ? 'Must be above Entry' : 'Must be below Entry'}
            value={inputs.takeProfitPrice ?? ''}
            onChange={(e) =>
              applyInstrumentChange({
                ...inputs,
                takeProfitPrice: e.target.value === '' ? undefined : parseFloat(e.target.value),
              })
            }
            error={errors.takeProfitPrice}
          />

          <div className="flex items-center gap-1 text-[10px] text-[var(--neu-text-muted)] flex-wrap">
            <span className="font-semibold">Quick TP:</span>
            {tpPresets.map((presetVal) => (
              <button
                key={presetVal}
                type="button"
                onClick={() => applyPipsToTakeProfit(presetVal)}
                className="neu-btn px-2 py-0.5 rounded text-[10px] font-mono-numbers text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/10 cursor-pointer"
              >
                +{isStocks || isCrypto ? `$${presetVal}` : isIndices ? `${presetVal} pts` : `${presetVal} pips`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



