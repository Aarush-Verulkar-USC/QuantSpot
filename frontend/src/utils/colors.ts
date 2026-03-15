export const POSITIVE_COLOR = "#22c55e";
export const NEGATIVE_COLOR = "#ef4444";
export const CHART_COLOR = "#8b5cf6";

export function getPriceColor(change: number): string {
  return change >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR;
}
