import type {
  CalculationResult,
  GoldInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';
import { validateGoldInputs } from '../../utils/validation';

export interface MetalSpec {
  symbol: string;
  name: string;
  metal: string;
  quote: string;
  ouncesPerLot: number;
  pipSize: number;
  digits: number;
  defaultPrice: number;
}

export const METAL_INSTRUMENTS: MetalSpec[] = [
  {
    symbol: 'XAU/USD',
    name: 'Spot Gold',
    metal: 'XAU',
    quote: 'USD',
    ouncesPerLot: 100,
    pipSize: 0.01,
    digits: 2,
    defaultPrice: 2750.0,
  },
  {
    symbol: 'XAG/USD',
    name: 'Spot Silver',
    metal: 'XAG',
    quote: 'USD',
    ouncesPerLot: 5000,
    pipSize: 0.001,
    digits: 3,
    defaultPrice: 31.5,
  },
  {
    symbol: 'XAU/EUR',
    name: 'Spot Gold / Euro',
    metal: 'XAU',
    quote: 'EUR',
    ouncesPerLot: 100,
    pipSize: 0.01,
    digits: 2,
    defaultPrice: 2535.0,
  },
];

export function findMetalInfo(symbol: string): MetalSpec {
  return METAL_INSTRUMENTS.find((m) => m.symbol === symbol) ?? METAL_INSTRUMENTS[0];
}

export class GoldCalculator implements InstrumentCalculatorService<GoldInputs> {
  public instrumentType = 'gold' as const;

  public getDefaults(_balance: number = 10000): GoldInputs {
    const metal = findMetalInfo('XAU/USD');
    return {
      instrumentType: 'gold',
      symbol: metal.symbol,
      accountCurrency: 'USD',
      accountBalance: 0,
      direction: 'BUY',
      leverage: 100,
      lotSize: 0,
      entryPrice: 0,
      stopLossPrice: undefined,
      takeProfitPrice: undefined,
    };
  }

  public validate(inputs: GoldInputs): Record<string, string> {
    return validateGoldInputs(inputs).errors;
  }

  public calculate(inputs: GoldInputs): CalculationResult {
    const metal = findMetalInfo(inputs.symbol);
    const ounces = inputs.lotSize * metal.ouncesPerLot;
    const { accountBalance, direction, leverage, entryPrice, stopLossPrice, takeProfitPrice } = inputs;
    const warnings: string[] = [];

    const positionValue = ounces * entryPrice;
    const requiredMargin = leverage > 0 ? positionValue / leverage : positionValue;
    const freeMarginRemaining = accountBalance - requiredMargin;
    const marginLevelPercent = requiredMargin > 0 ? (accountBalance / requiredMargin) * 100 : undefined;
    const pipValue = ounces * metal.pipSize;

    if (requiredMargin > accountBalance) {
      warnings.push(
        `Required margin ($${requiredMargin.toFixed(2)}) exceeds your account balance ($${accountBalance.toFixed(2)}). You would not have enough free margin to open this trade.`
      );
    }

    let potentialLoss: number | null = null;
    let stopLossDistancePips: number | null = null;
    let riskPercent: number | null = null;

    if (stopLossPrice !== undefined && stopLossPrice !== null && stopLossPrice > 0 && entryPrice > 0) {
      const slDiff = direction === 'BUY' ? entryPrice - stopLossPrice : stopLossPrice - entryPrice;
      stopLossDistancePips = Math.max(0, slDiff / metal.pipSize);
      potentialLoss = Math.max(0, slDiff * ounces);
      if (accountBalance > 0) {
        riskPercent = (potentialLoss / accountBalance) * 100;
      }
    }

    let potentialProfit: number | null = null;
    let takeProfitDistancePips: number | null = null;
    let rewardPercent: number | null = null;

    if (takeProfitPrice !== undefined && takeProfitPrice !== null && takeProfitPrice > 0 && entryPrice > 0) {
      const tpDiff = direction === 'BUY' ? takeProfitPrice - entryPrice : entryPrice - takeProfitPrice;
      takeProfitDistancePips = Math.max(0, tpDiff / metal.pipSize);
      potentialProfit = Math.max(0, tpDiff * ounces);
      if (accountBalance > 0) {
        rewardPercent = (potentialProfit / accountBalance) * 100;
      }
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    return {
      instrumentType: 'gold',
      direction,
      positionSizeUnits: ounces,
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

export const goldCalculator = new GoldCalculator();
