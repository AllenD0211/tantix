import type { ForexInputs, GoldInputs } from '../types/calculator';
import { findPairInfo } from '../services/calculator/forexCalculator';
import { findMetalInfo } from '../services/calculator/goldCalculator';

export type ActiveCalculatorInputs = ForexInputs | GoldInputs;

export function getInstrumentSymbol(inputs: ActiveCalculatorInputs): string {
  return inputs.instrumentType === 'gold' ? inputs.symbol : inputs.pair;
}

export function getPriceDecimals(inputs: ActiveCalculatorInputs): number {
  if (inputs.instrumentType === 'gold') {
    return findMetalInfo(inputs.symbol).digits;
  }
  return findPairInfo(inputs.pair).digits;
}

export function getPositionUnitLabel(inputs: ActiveCalculatorInputs): string {
  return inputs.instrumentType === 'gold' ? 'troy oz' : 'units';
}
