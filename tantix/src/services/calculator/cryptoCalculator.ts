import type {
  CalculationResult,
  CryptoInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';

export interface CryptoInfo {
  pair: string;
  name: string;
  baseCoin: string;
  defaultPrice: number;
  digits: number;
}

export const POPULAR_CRYPTO_PAIRS: CryptoInfo[] = [
  { pair: 'BTC/USD', name: 'Bitcoin Perpetual', baseCoin: 'BTC', defaultPrice: 65000.00, digits: 2 },
  { pair: 'ETH/USD', name: 'Ethereum Perpetual', baseCoin: 'ETH', defaultPrice: 3500.00, digits: 2 },
  { pair: 'SOL/USD', name: 'Solana Perpetual', baseCoin: 'SOL', defaultPrice: 150.00, digits: 2 },
  { pair: 'BNB/USD', name: 'BNB Perpetual', baseCoin: 'BNB', defaultPrice: 580.00, digits: 2 },
  { pair: 'XRP/USD', name: 'Ripple Perpetual', baseCoin: 'XRP', defaultPrice: 0.6000, digits: 4 },
  { pair: 'DOGE/USD', name: 'Dogecoin Perpetual', baseCoin: 'DOGE', defaultPrice: 0.12000, digits: 5 },
];

export function findCryptoInfo(pair: string): CryptoInfo {
  return POPULAR_CRYPTO_PAIRS.find((c) => c.pair === pair) || {
    pair: pair.toUpperCase(),
    name: `${pair.toUpperCase()} Contract`,
    baseCoin: pair.split('/')[0] || 'COIN',
    defaultPrice: 1000.00,
    digits: 2,
  };
}

export class CryptoCalculator implements InstrumentCalculatorService<CryptoInputs> {
  public instrumentType = 'crypto' as const;

  public getDefaults(balance: number = 10000): CryptoInputs {
    return {
      instrumentType: 'crypto',
      pair: 'BTC/USD',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 10,
      coinAmount: 0.5,
      entryPrice: 65000.00,
      stopLossPrice: 63000.00,
      takeProfitPrice: 70000.00,
    };
  }

  public validate(inputs: CryptoInputs): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!inputs.coinAmount || inputs.coinAmount <= 0) {
      errors.coinAmount = 'Coin amount must be greater than 0.';
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

  public calculate(inputs: CryptoInputs): CalculationResult {
    const coinAmount = inputs.coinAmount || 0;
    const entryPrice = inputs.entryPrice || 0;
    const positionValue = coinAmount * entryPrice;
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
      potentialLoss = Math.max(0, diff * coinAmount);
      stopLossDistancePips = Math.abs(entryPrice - inputs.stopLossPrice);
    }

    if (inputs.takeProfitPrice && inputs.takeProfitPrice > 0) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - entryPrice
        : entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * coinAmount);
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
      instrumentType: 'crypto',
      direction: inputs.direction,
      positionSizeUnits: coinAmount,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null && inputs.accountBalance > 0 ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null && inputs.accountBalance > 0 ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: coinAmount * 1.00, // $1.00 price move per coin unit
      stopLossDistancePips,
      takeProfitDistancePips,
      warnings,
    };
  }
}

export const cryptoCalculator = new CryptoCalculator();

