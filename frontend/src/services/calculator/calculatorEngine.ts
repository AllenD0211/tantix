import type {
  CalculatorInputs,
  CalculationResult,
  InstrumentSpec,
  InstrumentType,
} from '../../types/calculator';
import { forexCalculator } from './forexCalculator';
import { goldCalculator } from './goldCalculator';
import { stockCalculator } from './stockCalculator';
import { cryptoCalculator } from './cryptoCalculator';
import { indexCalculator } from './indexCalculator';

export const SUPPORTED_INSTRUMENTS: InstrumentSpec[] = [
  {
    id: 'forex',
    name: 'Forex Currencies',
    description: 'Major, Minor, and Cross Currency Pairs',
    standardLotUnit: '100,000 Base Units',
    standardLotSize: 100000,
    supported: true,
  },
  {
    id: 'gold',
    name: 'Gold & Metals',
    description: 'Spot Gold (XAU/USD) & Silver (XAG/USD)',
    standardLotUnit: '100 Troy Ounces',
    standardLotSize: 100,
    supported: true,
  },
  {
    id: 'stocks',
    name: 'Stocks / Equities',
    description: 'US & Global Equity Shares',
    standardLotUnit: '1 Share',
    standardLotSize: 1,
    supported: true,
  },
  {
    id: 'crypto',
    name: 'Crypto Futures',
    description: 'BTC, ETH & Major Perpetual Contracts',
    standardLotUnit: '1 Coin Unit',
    standardLotSize: 1,
    supported: true,
  },
  {
    id: 'indices',
    name: 'Equity Indices',
    description: 'US30, NAS100, SPX500, GER40',
    standardLotUnit: '1 Point Index Multiplier',
    standardLotSize: 1,
    supported: true,
  },
];

/**
 * Dispatches calculation request to the appropriate instrument engine.
 */
export function calculateTrade(inputs: CalculatorInputs): CalculationResult {
  switch (inputs.instrumentType) {
    case 'forex':
      return forexCalculator.calculate(inputs);
    case 'gold':
      return goldCalculator.calculate(inputs);
    case 'stocks':
      return stockCalculator.calculate(inputs);
    case 'crypto':
      return cryptoCalculator.calculate(inputs);
    case 'indices':
      return indexCalculator.calculate(inputs);
    default:
      throw new Error(`Calculation engine for instrument '${(inputs as any).instrumentType}' is not yet activated.`);
  }
}

/**
 * Dispatches validation request to the appropriate instrument engine.
 */
export function validateInputs(inputs: CalculatorInputs): Record<string, string> {
  switch (inputs.instrumentType) {
    case 'forex':
      return forexCalculator.validate(inputs);
    case 'gold':
      return goldCalculator.validate(inputs);
    case 'stocks':
      return stockCalculator.validate(inputs);
    case 'crypto':
      return cryptoCalculator.validate(inputs);
    case 'indices':
      return indexCalculator.validate(inputs);
    default:
      return {};
  }
}

/**
 * Returns default input values for a given instrument.
 */
export function getDefaultInputs(instrumentType: InstrumentType, balance: number = 10000): CalculatorInputs {
  switch (instrumentType) {
    case 'forex':
      return forexCalculator.getDefaults(balance);
    case 'gold':
      return goldCalculator.getDefaults(balance);
    case 'stocks':
      return stockCalculator.getDefaults(balance);
    case 'crypto':
      return cryptoCalculator.getDefaults(balance);
    case 'indices':
      return indexCalculator.getDefaults(balance);
    default:
      return forexCalculator.getDefaults(balance);
  }
}



