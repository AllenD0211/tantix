import type { ForexInputs, GoldInputs, TradeDirection } from '../types/calculator';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

/**
 * Validates Forex calculator inputs with clear, actionable error messages.
 */
export function validateForexInputs(inputs: ForexInputs): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // 1. Account Balance
  if (inputs.accountBalance === undefined || isNaN(inputs.accountBalance) || inputs.accountBalance <= 0) {
    errors.accountBalance = 'Account balance must be greater than 0.';
  }

  // 2. Leverage
  if (!inputs.leverage || isNaN(inputs.leverage) || inputs.leverage < 1) {
    errors.leverage = 'Leverage must be at least 1:1.';
  } else if (inputs.leverage > 2000) {
    errors.leverage = 'Leverage cannot exceed 1:2000.';
  }

  // 3. Lot Size
  if (!inputs.lotSize || isNaN(inputs.lotSize) || inputs.lotSize <= 0) {
    errors.lotSize = 'Position size must be greater than 0.';
  } else if (inputs.lotSize < 0.01) {
    errors.lotSize = 'Minimum lot size is 0.01 (micro lot).';
  } else if (inputs.lotSize > 100) {
    warnings.push('Position size is very large (over 100 lots). Ensure this matches your broker limits.');
  }

  // 4. Entry Price
  if (!inputs.entryPrice || isNaN(inputs.entryPrice) || inputs.entryPrice <= 0) {
    errors.entryPrice = 'Entry price must be a valid positive number.';
  }

  // 5. Direction-specific Stop Loss & Take Profit logic
  const { direction, entryPrice, stopLossPrice, takeProfitPrice } = inputs;

  if (entryPrice && entryPrice > 0) {
    if (stopLossPrice !== undefined && stopLossPrice !== null && !isNaN(stopLossPrice) && stopLossPrice > 0) {
      if (direction === 'BUY' && stopLossPrice >= entryPrice) {
        errors.stopLossPrice = `For a BUY order, Stop Loss (${stopLossPrice}) must be below Entry (${entryPrice}).`;
      } else if (direction === 'SELL' && stopLossPrice <= entryPrice) {
        errors.stopLossPrice = `For a SELL order, Stop Loss (${stopLossPrice}) must be above Entry (${entryPrice}).`;
      }
    }

    if (takeProfitPrice !== undefined && takeProfitPrice !== null && !isNaN(takeProfitPrice) && takeProfitPrice > 0) {
      if (direction === 'BUY' && takeProfitPrice <= entryPrice) {
        errors.takeProfitPrice = `For a BUY order, Take Profit (${takeProfitPrice}) must be above Entry (${entryPrice}).`;
      } else if (direction === 'SELL' && takeProfitPrice >= entryPrice) {
        errors.takeProfitPrice = `For a SELL order, Take Profit (${takeProfitPrice}) must be below Entry (${entryPrice}).`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates Gold / metals calculator inputs with the same SL/TP direction rules as FX.
 */
export function validateGoldInputs(inputs: GoldInputs): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (inputs.accountBalance === undefined || isNaN(inputs.accountBalance) || inputs.accountBalance <= 0) {
    errors.accountBalance = 'Account balance must be greater than 0.';
  }

  if (!inputs.leverage || isNaN(inputs.leverage) || inputs.leverage < 1) {
    errors.leverage = 'Leverage must be at least 1:1.';
  } else if (inputs.leverage > 2000) {
    errors.leverage = 'Leverage cannot exceed 1:2000.';
  }

  if (!inputs.lotSize || isNaN(inputs.lotSize) || inputs.lotSize <= 0) {
    errors.lotSize = 'Position size must be greater than 0.';
  } else if (inputs.lotSize < 0.01) {
    errors.lotSize = 'Minimum lot size is 0.01.';
  } else if (inputs.lotSize > 100) {
    warnings.push('Position size is very large (over 100 lots). Confirm this matches your broker contract.');
  }

  if (!inputs.entryPrice || isNaN(inputs.entryPrice) || inputs.entryPrice <= 0) {
    errors.entryPrice = 'Entry price must be a valid positive number.';
  }

  const { direction, entryPrice, stopLossPrice, takeProfitPrice } = inputs;

  if (entryPrice && entryPrice > 0) {
    if (stopLossPrice !== undefined && stopLossPrice !== null && !isNaN(stopLossPrice) && stopLossPrice > 0) {
      if (direction === 'BUY' && stopLossPrice >= entryPrice) {
        errors.stopLossPrice = `For a BUY order, Stop Loss (${stopLossPrice}) must be below Entry (${entryPrice}).`;
      } else if (direction === 'SELL' && stopLossPrice <= entryPrice) {
        errors.stopLossPrice = `For a SELL order, Stop Loss (${stopLossPrice}) must be above Entry (${entryPrice}).`;
      }
    }

    if (takeProfitPrice !== undefined && takeProfitPrice !== null && !isNaN(takeProfitPrice) && takeProfitPrice > 0) {
      if (direction === 'BUY' && takeProfitPrice <= entryPrice) {
        errors.takeProfitPrice = `For a BUY order, Take Profit (${takeProfitPrice}) must be above Entry (${entryPrice}).`;
      } else if (direction === 'SELL' && takeProfitPrice >= entryPrice) {
        errors.takeProfitPrice = `For a SELL order, Take Profit (${takeProfitPrice}) must be below Entry (${entryPrice}).`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates whether a target price is mathematically valid for a direction.
 */
export function isPriceValidForDirection(
  price: number,
  entry: number,
  targetType: 'SL' | 'TP',
  direction: TradeDirection
): boolean {
  if (!price || !entry || isNaN(price) || isNaN(entry)) return false;
  if (targetType === 'SL') {
    return direction === 'BUY' ? price < entry : price > entry;
  }
  return direction === 'BUY' ? price > entry : price < entry;
}
