import type {
  CalculationResult,
  CryptoInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';

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
      coinAmount: 0.1,
      entryPrice: 65000,
      stopLossPrice: 63000,
      takeProfitPrice: 70000,
    };
  }

  public validate(inputs: CryptoInputs): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!inputs.coinAmount || inputs.coinAmount <= 0) errors.coinAmount = 'Coin amount must be greater than 0.';
    if (!inputs.entryPrice || inputs.entryPrice <= 0) errors.entryPrice = 'Valid entry price required.';
    return errors;
  }

  public calculate(inputs: CryptoInputs): CalculationResult {
    const positionValue = inputs.coinAmount * inputs.entryPrice;
    const requiredMargin = inputs.leverage > 0 ? positionValue / inputs.leverage : positionValue;
    const freeMarginRemaining = inputs.accountBalance - requiredMargin;

    let potentialLoss: number | null = null;
    let potentialProfit: number | null = null;

    if (inputs.stopLossPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.entryPrice - inputs.stopLossPrice
        : inputs.stopLossPrice - inputs.entryPrice;
      potentialLoss = Math.max(0, diff * inputs.coinAmount);
    }

    if (inputs.takeProfitPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - inputs.entryPrice
        : inputs.entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * inputs.coinAmount);
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    return {
      instrumentType: 'crypto',
      direction: inputs.direction,
      positionSizeUnits: inputs.coinAmount,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: null,
      stopLossDistancePips: null,
      takeProfitDistancePips: null,
    };
  }
}

export const cryptoCalculator = new CryptoCalculator();
