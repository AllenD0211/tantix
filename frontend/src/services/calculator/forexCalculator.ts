import type {
  CalculationResult,
  CurrencyPairInfo,
  ForexInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';
import { validateForexInputs } from '../../utils/validation';

export const POPULAR_FOREX_PAIRS: CurrencyPairInfo[] = [
  { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', pipSize: 0.0001, digits: 5, defaultPrice: 1.08500, category: 'major' },
  { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', pipSize: 0.0001, digits: 5, defaultPrice: 1.29200, category: 'major' },
  { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', pipSize: 0.01, digits: 3, defaultPrice: 154.200, category: 'major' },
  { symbol: 'USD/CHF', base: 'USD', quote: 'CHF', pipSize: 0.0001, digits: 5, defaultPrice: 0.88450, category: 'major' },
  { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', pipSize: 0.0001, digits: 5, defaultPrice: 0.65500, category: 'major' },
  { symbol: 'USD/CAD', base: 'USD', quote: 'CAD', pipSize: 0.0001, digits: 5, defaultPrice: 1.39800, category: 'major' },
  { symbol: 'NZD/USD', base: 'NZD', quote: 'USD', pipSize: 0.0001, digits: 5, defaultPrice: 0.59200, category: 'major' },
  { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', pipSize: 0.0001, digits: 5, defaultPrice: 0.83980, category: 'minor' },
  { symbol: 'EUR/JPY', base: 'EUR', quote: 'JPY', pipSize: 0.01, digits: 3, defaultPrice: 167.350, category: 'minor' },
  { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY', pipSize: 0.01, digits: 3, defaultPrice: 199.200, category: 'minor' },
];

export function findPairInfo(symbol: string): CurrencyPairInfo {
  const found = POPULAR_FOREX_PAIRS.find((p) => p.symbol === symbol);
  if (found) return found;

  const [base = 'EUR', quote = 'USD'] = symbol.split('/');
  const isJpy = quote === 'JPY';
  return {
    symbol,
    base,
    quote,
    pipSize: isJpy ? 0.01 : 0.0001,
    digits: isJpy ? 3 : 5,
    defaultPrice: isJpy ? 150.000 : 1.10000,
    category: 'minor',
  };
}

export class ForexCalculator implements InstrumentCalculatorService<ForexInputs> {
  public instrumentType = 'forex' as const;

  public getDefaults(balance: number = 10000): ForexInputs {
    return {
      instrumentType: 'forex',
      pair: 'EUR/USD',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 100,
      lotSize: 1.0,
      entryPrice: 1.08500,
      stopLossPrice: 1.08000,
      takeProfitPrice: 1.09500,
    };
  }

  public validate(inputs: ForexInputs): Record<string, string> {
    const result = validateForexInputs(inputs);
    return result.errors;
  }

  public calculate(inputs: ForexInputs): CalculationResult {
    const pairInfo = findPairInfo(inputs.pair);
    const { base, quote, pipSize } = pairInfo;
    const {
      accountCurrency,
      accountBalance,
      direction,
      leverage,
      lotSize,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
    } = inputs;

    const warnings: string[] = [];

    // Standard lot = 100,000 units of base currency
    const totalUnits = lotSize * 100000;

    // 1. Pip Value Calculation (in Account Currency, assuming USD)
    let pipValue = 0;
    if (quote === accountCurrency) {
      // E.g. EUR/USD with USD account -> Pip Value = Units * Pip Size
      pipValue = totalUnits * pipSize;
    } else if (base === accountCurrency) {
      // E.g. USD/JPY with USD account -> Pip Value = (Units * Pip Size) / Entry Price
      pipValue = entryPrice > 0 ? (totalUnits * pipSize) / entryPrice : 0;
    } else {
      // Cross rate (e.g. EUR/GBP with USD account): approximate or use quote/account conversion
      // For EUR/GBP, quote is GBP, GBP/USD is ~1.29
      const gbpUsdRate = 1.29200;
      const quoteInUsd = quote === 'GBP' ? gbpUsdRate : (quote === 'JPY' ? 1 / 154.2 : 1.0);
      pipValue = totalUnits * pipSize * quoteInUsd;
    }

    // 2. Position Value (Notional) & Required Margin
    let baseInAccountCurrency = entryPrice;
    if (base === accountCurrency) {
      baseInAccountCurrency = 1.0;
    } else if (quote !== accountCurrency) {
      // Cross currency: approximate base in USD
      if (base === 'EUR') baseInAccountCurrency = 1.0850;
      else if (base === 'GBP') baseInAccountCurrency = 1.2920;
      else baseInAccountCurrency = entryPrice;
    }

    const positionValue = totalUnits * baseInAccountCurrency;
    const requiredMargin = leverage > 0 ? positionValue / leverage : positionValue;
    const freeMarginRemaining = accountBalance - requiredMargin;
    const marginLevelPercent = requiredMargin > 0 ? (accountBalance / requiredMargin) * 100 : undefined;

    if (requiredMargin > accountBalance) {
      warnings.push(
        `Required margin ($${requiredMargin.toFixed(2)}) exceeds your account balance ($${accountBalance.toFixed(2)}). You would not have enough free margin to open this trade.`
      );
    }

    // 3. Stop Loss Calculations
    let potentialLoss: number | null = null;
    let stopLossDistancePips: number | null = null;
    let riskPercent: number | null = null;

    if (stopLossPrice !== undefined && stopLossPrice !== null && stopLossPrice > 0 && entryPrice > 0) {
      const isBuy = direction === 'BUY';
      const slDiff = isBuy ? entryPrice - stopLossPrice : stopLossPrice - entryPrice;
      stopLossDistancePips = Math.max(0, slDiff / pipSize);

      if (quote === accountCurrency) {
        potentialLoss = Math.max(0, slDiff * totalUnits);
      } else if (base === accountCurrency) {
        // In quote currency = slDiff * totalUnits. Converted back to account currency (USD) at SL price
        potentialLoss = stopLossPrice > 0 ? Math.max(0, (slDiff * totalUnits) / stopLossPrice) : 0;
      } else {
        const quoteInUsd = quote === 'GBP' ? 1.29200 : 1.0;
        potentialLoss = Math.max(0, slDiff * totalUnits * quoteInUsd);
      }

      if (accountBalance > 0) {
        riskPercent = (potentialLoss / accountBalance) * 100;
      }
    }

    // 4. Take Profit Calculations
    let potentialProfit: number | null = null;
    let takeProfitDistancePips: number | null = null;
    let rewardPercent: number | null = null;

    if (takeProfitPrice !== undefined && takeProfitPrice !== null && takeProfitPrice > 0 && entryPrice > 0) {
      const isBuy = direction === 'BUY';
      const tpDiff = isBuy ? takeProfitPrice - entryPrice : entryPrice - takeProfitPrice;
      takeProfitDistancePips = Math.max(0, tpDiff / pipSize);

      if (quote === accountCurrency) {
        potentialProfit = Math.max(0, tpDiff * totalUnits);
      } else if (base === accountCurrency) {
        potentialProfit = takeProfitPrice > 0 ? Math.max(0, (tpDiff * totalUnits) / takeProfitPrice) : 0;
      } else {
        const quoteInUsd = quote === 'GBP' ? 1.29200 : 1.0;
        potentialProfit = Math.max(0, tpDiff * totalUnits * quoteInUsd);
      }

      if (accountBalance > 0) {
        rewardPercent = (potentialProfit / accountBalance) * 100;
      }
    }

    // 5. Risk / Reward Ratio
    let riskRewardRatio: number | null = null;
    if (potentialProfit !== null && potentialLoss !== null && potentialLoss > 0) {
      riskRewardRatio = potentialProfit / potentialLoss;
    }

    return {
      instrumentType: 'forex',
      direction,
      positionSizeUnits: totalUnits,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      marginLevelPercent,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent,
      rewardPercent,
      riskRewardRatio,
      pipValue,
      stopLossDistancePips,
      takeProfitDistancePips,
      warnings,
    };
  }
}

export const forexCalculator = new ForexCalculator();
