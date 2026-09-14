import type {
  CalculationResult,
  InstrumentCalculatorService,
  StockInputs,
} from '../../types/calculator';

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
      entryPrice: 220.00,
      stopLossPrice: 210.00,
      takeProfitPrice: 240.00,
    };
  }

  public validate(inputs: StockInputs): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!inputs.shares || inputs.shares <= 0) errors.shares = 'Share quantity must be at least 1.';
    if (!inputs.entryPrice || inputs.entryPrice <= 0) errors.entryPrice = 'Valid share price required.';
    return errors;
  }

  public calculate(inputs: StockInputs): CalculationResult {
    const positionValue = inputs.shares * inputs.entryPrice;
    const requiredMargin = inputs.leverage > 0 ? positionValue / inputs.leverage : positionValue;
    const freeMarginRemaining = inputs.accountBalance - requiredMargin;

    let potentialLoss: number | null = null;
    let potentialProfit: number | null = null;

    if (inputs.stopLossPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.entryPrice - inputs.stopLossPrice
        : inputs.stopLossPrice - inputs.entryPrice;
      potentialLoss = Math.max(0, diff * inputs.shares);
    }

    if (inputs.takeProfitPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - inputs.entryPrice
        : inputs.entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * inputs.shares);
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    return {
      instrumentType: 'stocks',
      direction: inputs.direction,
      positionSizeUnits: inputs.shares,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: inputs.shares * 0.01,
      stopLossDistancePips: null,
      takeProfitDistancePips: null,
    };
  }
}

export const stockCalculator = new StockCalculator();
