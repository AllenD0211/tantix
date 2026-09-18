export type InstrumentType = 'forex' | 'gold' | 'stocks' | 'crypto' | 'indices';

export type TradeDirection = 'BUY' | 'SELL';

export interface CurrencyPairInfo {
  symbol: string;
  base: string;
  quote: string;
  pipSize: number;
  digits: number;
  defaultPrice: number;
  category: 'major' | 'minor' | 'exotic';
}

export interface BaseCalculatorInputs {
  instrumentType: InstrumentType;
  accountCurrency: string;
  accountBalance: number;
  direction: TradeDirection;
  entryPrice: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
}

export interface ForexInputs extends BaseCalculatorInputs {
  instrumentType: 'forex';
  pair: string;
  lotSize: number;
  leverage: number;
  lotType?: 'standard' | 'mini' | 'micro';
}

export interface GoldInputs extends BaseCalculatorInputs {
  instrumentType: 'gold';
  symbol: string;
  lotSize: number;
  leverage: number;
}

export interface StockInputs extends BaseCalculatorInputs {
  instrumentType: 'stocks';
  symbol: string;
  shares: number;
  leverage: number;
}

export interface CryptoInputs extends BaseCalculatorInputs {
  instrumentType: 'crypto';
  pair: string;
  coinAmount: number;
  leverage: number;
}

export interface IndexInputs extends BaseCalculatorInputs {
  instrumentType: 'indices';
  symbol: string;
  contracts: number;
  leverage: number;
}

export type CalculatorInputs =
  | ForexInputs
  | GoldInputs
  | StockInputs
  | CryptoInputs
  | IndexInputs;

export interface CalculationResult {
  instrumentType: InstrumentType;
  direction: TradeDirection;
  
  // Position & Margin
  positionSizeUnits: number;
  positionValue: number;
  requiredMargin: number;
  freeMarginRemaining: number;
  marginLevelPercent?: number;

  // Potential Outcomes
  potentialProfit: number | null;
  potentialLoss: number | null;
  riskAmount: number | null;
  riskPercent: number | null;
  rewardPercent: number | null;
  riskRewardRatio: number | null;

  // Distance & Unit Values
  pipValue: number | null;
  stopLossDistancePips: number | null;
  takeProfitDistancePips: number | null;

  // Metadata / Warnings
  warnings?: string[];
}

export interface InstrumentSpec {
  id: InstrumentType;
  name: string;
  description: string;
  standardLotUnit: string;
  standardLotSize: number;
  supported: boolean;
}

export interface InstrumentCalculatorService<TInput extends BaseCalculatorInputs> {
  instrumentType: InstrumentType;
  calculate(inputs: TInput): CalculationResult;
  validate(inputs: TInput): Record<string, string>;
  getDefaults(balance?: number): TInput;
}
