import type { ForexInputs, GoldInputs, StockInputs, CryptoInputs, IndexInputs } from '../types/calculator';
import { findPairInfo } from '../services/calculator/forexCalculator';
import { findMetalInfo } from '../services/calculator/goldCalculator';
import { findCryptoInfo } from '../services/calculator/cryptoCalculator';
import { findPointIndexInfo } from '../services/calculator/indexCalculator';

export type ActiveCalculatorInputs = ForexInputs | GoldInputs | StockInputs | CryptoInputs | IndexInputs;

export function getInstrumentSymbol(inputs: ActiveCalculatorInputs): string {
  if (inputs.instrumentType === 'gold') return inputs.symbol;
  if (inputs.instrumentType === 'stocks') return inputs.symbol;
  if (inputs.instrumentType === 'indices') return inputs.symbol;
  if (inputs.instrumentType === 'crypto') return inputs.pair;
  return inputs.pair;
}

export function getPriceDecimals(inputs: ActiveCalculatorInputs): number {
  if (inputs.instrumentType === 'gold') {
    return findMetalInfo(inputs.symbol).digits;
  }
  if (inputs.instrumentType === 'stocks') {
    return 2;
  }
  if (inputs.instrumentType === 'indices') {
    return findPointIndexInfo(inputs.symbol).digits;
  }
  if (inputs.instrumentType === 'crypto') {
    return findCryptoInfo(inputs.pair).digits;
  }
  return findPairInfo(inputs.pair).digits;
}

export function getPositionUnitLabel(inputs: ActiveCalculatorInputs): string {
  if (inputs.instrumentType === 'gold') return 'troy oz';
  if (inputs.instrumentType === 'stocks') return 'shares';
  if (inputs.instrumentType === 'crypto') return 'coins';
  if (inputs.instrumentType === 'indices') return 'contracts';
  return 'units';
}



