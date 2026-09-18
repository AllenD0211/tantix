import type {
  CalculationResult,
  IndexInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';

export interface IndexInfo {
  symbol: string;
  name: string;
  defaultPrice: number;
  multiplier: number;
  digits: number;
}

export const POPULAR_EQUITY_INDICES: IndexInfo[] = [
  { symbol: 'US30', name: 'Dow Jones Industrial Average', defaultPrice: 42000.00, multiplier: 1, digits: 1 },
  { symbol: 'NAS100', name: 'Nasdaq 100 Tech Index', defaultPrice: 20000.00, multiplier: 1, digits: 2 },
  { symbol: 'SPX500', name: 'S&P 500 Index', defaultPrice: 5600.00, multiplier: 1, digits: 2 },
  { symbol: 'GER40', name: 'Germany DAX 40', defaultPrice: 18500.00, multiplier: 1, digits: 1 },
  { symbol: 'UK100', name: 'UK FTSE 100', defaultPrice: 8200.00, multiplier: 1, digits: 1 },
  { symbol: 'JPN225', name: 'Japan Nikkei 225', defaultPrice: 38000.00, multiplier: 1, digits: 1 },
];

export function findPointIndexInfo(symbol: string): IndexInfo {
  return POPULAR_EQUITY_INDICES.find((i) => i.symbol === symbol) || {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Index`,
    defaultPrice: 10000.00,
    multiplier: 1,
    digits: 1,
  };
}

export class IndexCalculator implements InstrumentCalculatorService<IndexInputs> {
  public instrumentType = 'indices' as const;

  public getDefaults(balance: number = 10000): IndexInputs {
    return {
      instrumentType: 'indices',
      symbol: 'US30',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 50,
      contracts: 1,
      entryPrice: 42000.00,
      stopLossPrice: 41800.00,
      takeProfitPrice: 42400.00,
    };
  }

  public validate(inputs: IndexInputs): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!inputs.contracts || inputs.contracts <= 0) {
      errors.contracts = 'Contract size must be at least 0.01.';
    }
    if (!inputs.entryPrice || inputs.entryPrice <= 0) {
      errors.entryPrice = 'Valid entry price required.';
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

  public calculate(inputs: IndexInputs): CalculationResult {
    const indexMeta = findPointIndexInfo(inputs.symbol);
    const contracts = inputs.contracts || 0;
    const entryPrice = inputs.entryPrice || 0;
    const multiplier = indexMeta.multiplier;
    const positionValue = contracts * multiplier * entryPrice;
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
      potentialLoss = Math.max(0, diff * multiplier * contracts);
      stopLossDistancePips = Math.abs(entryPrice - inputs.stopLossPrice);
    }

    if (inputs.takeProfitPrice && inputs.takeProfitPrice > 0) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - entryPrice
        : entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * multiplier * contracts);
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
      instrumentType: 'indices',
      direction: inputs.direction,
      positionSizeUnits: contracts,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null && inputs.accountBalance > 0 ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null && inputs.accountBalance > 0 ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: contracts * multiplier * 1.00, // $1.00 per point move per contract
      stopLossDistancePips,
      takeProfitDistancePips,
      warnings,
    };
  }
}

export const indexCalculator = new IndexCalculator();

