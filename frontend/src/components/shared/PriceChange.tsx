import { formatPercentage } from "../../utils/formatters";

interface PriceChangeProps {
  value: number;
}

export function PriceChange({ value }: PriceChangeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isPositive ? "text-green-400" : "text-red-400"
      }`}
    >
      <span>{isPositive ? "\u25B2" : "\u25BC"}</span>
      <span>{formatPercentage(value)}</span>
    </span>
  );
}
