const compactFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const standardFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return compactFormatter.format(value);
  }
  if (value >= 1) {
    return standardFormatter.format(value);
  }
  // Very small prices like $0.00004
  const digits = Math.max(2, -Math.floor(Math.log10(Math.abs(value))) + 2);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatLargeNumber(value: number): string {
  return compactFormatter.format(value);
}
