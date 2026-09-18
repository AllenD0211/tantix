import type {
  CalculationResult,
  InstrumentCalculatorService,
  StockInputs,
} from '../../types/calculator';

export interface StockInfo {
  symbol: string;
  name: string;
  defaultPrice: number;
  currency: string;
}

export const POPULAR_STOCKS: StockInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', defaultPrice: 225.00, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', defaultPrice: 120.00, currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', defaultPrice: 230.00, currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', defaultPrice: 420.00, currency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', defaultPrice: 185.00, currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', defaultPrice: 175.00, currency: 'USD' },
  { symbol: 'META', name: 'Meta Platforms Inc.', defaultPrice: 510.00, currency: 'USD' },
];

export function findStockInfo(symbol: string): StockInfo {
  return POPULAR_STOCKS.find((s) => s.symbol === symbol) || {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Equity`,
    defaultPrice: 100.00,
    currency: 'USD',
  };
}

export class StockCalculator implements InstrumentCalculatorService<StockInputs> {
  public instrumentType = 'stocks' as const;

  public getDefaults(balance: number = 10000): StockInputs {
    return {
      instrumentType: 'stocks',
      symbol: 'AAPL',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 5,
      shares: 50,
      entryPrice: 225.00,
      stopLossPrice: 215.00,
      takeProfitPrice: 250.00,
    };
  }

  public validate(inputs: StockInputs): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!inputs.shares || inputs.shares <= 0) {
      errors.shares = 'Share quantity must be at least 1 share.';
    }
    if (!inputs.entryPrice || inputs.entryPrice <= 0) {
      errors.entryPrice = 'Valid entry share price required.';
    }

    if (inputs.stopLossPrice && inputs.stopLossPrice > 0) {
      if (inputs.direction === 'BUY' && inputs.stopLossPrice >= inputs.entryPrice) {
        errors.stopLossPrice = 'BUY Stop Loss must be lower than Entry Price.';
      } else if (inputs.direction === 'SELL' && inputs.stopLossPrice <= inputs.entryPrice) {
        errors.stopLossPrice = 'SELL Stop Loss must be higher than Entry Price.';
      }
    }

    if (inputs.takeProfitPrice && inputs.takeProfitPrice > 0) {
      if (inputs.direction === 'BUY' && inputs.takeProfitPrice <= inputs.entryPrice) {
        errors.takeProfitPrice = 'BUY Take Profit must be higher than Entry Price.';
      } else if (inputs.direction === 'SELL' && inputs.takeProfitPrice >= inputs.entryPrice) {
        errors.takeProfitPrice = 'SELL Take Profit must be lower than Entry Price.';
      }
    }

    return errors;
  }

  public calculate(inputs: StockInputs): CalculationResult {
    const shares = inputs.shares || 0;
    const entryPrice = inputs.entryPrice || 0;
    const positionValue = shares * entryPrice;
    const leverage = inputs.leverage > 0 ? inputs.leverage : 1;
    const requiredMargin = positionValue / leverage;
    const freeMarginRemaining = inputs.accountBalance - requiredMargin;

    let potentialLoss: number | null = null;
    let potentialProfit: number | null = null;
    let stopLossDistancePips: number | null = null;
    let takeProfitDistancePips: number | null = null;

    if (inputs.stopLossPrice && inputs.stopLossPrice > 0) {
      const diff = inputs.direction === 'BUY'
        ? entryPrice - inputs.stopLossPrice
        : inputs.stopLossPrice - entryPrice;
      potentialLoss = Math.max(0, diff * shares);
      stopLossDistancePips = Math.abs(entryPrice - inputs.stopLossPrice);
    }

    if (inputs.takeProfitPrice && inputs.takeProfitPrice > 0) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - entryPrice
        : entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * shares);
      takeProfitDistancePips = Math.abs(inputs.takeProfitPrice - entryPrice);
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    const warnings: string[] = [];
    if (requiredMargin > inputs.accountBalance) {
      warnings.push(`Required margin (${requiredMargin.toFixed(2)} USD) exceeds your available account balance.`);
    }

    return {
      instrumentType: 'stocks',
      direction: inputs.direction,
      positionSizeUnits: shares,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null && inputs.accountBalance > 0 ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null && inputs.accountBalance > 0 ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: shares * 0.01, // $0.01 price move per share
      stopLossDistancePips,
      takeProfitDistancePips,
      warnings,
    };
  }
}

export const stockCalculator = new StockCalculator();

