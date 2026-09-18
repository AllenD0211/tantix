import type {
  CalculationResult,
  IndexInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';

export class IndexCalculator implements InstrumentCalculatorService<IndexInputs> {
  public instrumentType = 'indices' as const;

  public getDefaults(balance: number = 10000): IndexInputs {
    return {
      instrumentType: 'indices',
      symbol: 'US30',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 100,
      contracts: 1,
      entryPrice: 42000,
      stopLossPrice: 41800,
      takeProfitPrice: 42400,
    };
  }

  public validate(inputs: IndexInputs): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!inputs.contracts || inputs.contracts <= 0) errors.contracts = 'Contract size must be greater than 0.';
    if (!inputs.entryPrice || inputs.entryPrice <= 0) errors.entryPrice = 'Valid entry price required.';
    return errors;
  }

  public calculate(inputs: IndexInputs): CalculationResult {
    // Multiplier: $1 per point per contract for US30/NAS100
    const multiplier = 1;
    const positionValue = inputs.contracts * multiplier * inputs.entryPrice;
    const requiredMargin = inputs.leverage > 0 ? positionValue / inputs.leverage : positionValue;
    const freeMarginRemaining = inputs.accountBalance - requiredMargin;

    let potentialLoss: number | null = null;
    let potentialProfit: number | null = null;

    if (inputs.stopLossPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.entryPrice - inputs.stopLossPrice
        : inputs.stopLossPrice - inputs.entryPrice;
      potentialLoss = Math.max(0, diff * multiplier * inputs.contracts);
    }

    if (inputs.takeProfitPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - inputs.entryPrice
        : inputs.entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * multiplier * inputs.contracts);
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    return {
      instrumentType: 'indices',
      direction: inputs.direction,
      positionSizeUnits: inputs.contracts * multiplier,
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

export const indexCalculator = new IndexCalculator();
