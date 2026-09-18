export interface TickerItem {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  isPositive: boolean;
  spread: number;
  digits: number;
  lastUpdate?: number;
}
