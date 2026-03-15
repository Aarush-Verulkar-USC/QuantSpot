import { useGlobalStats } from "../../hooks/useGlobalStats";
import { formatLargeNumber, formatPercentage } from "../../utils/formatters";
import { PriceChange } from "../shared/PriceChange";
import { StatsBarSkeleton } from "../shared/LoadingSkeleton";

export function GlobalStatsBar() {
  const { stats, loading } = useGlobalStats();

  if (loading || !stats) return <StatsBarSkeleton />;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3 border-b border-gray-800 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Market Cap:</span>
        <span className="text-white font-medium">
          {formatLargeNumber(stats.totalMarketCapUsd)}
        </span>
        <PriceChange value={stats.marketCapChangePercentage24h} />
      </div>
      <div>
        <span className="text-gray-400">24h Vol: </span>
        <span className="text-white font-medium">
          {formatLargeNumber(stats.totalVolume24hUsd)}
        </span>
      </div>
      <div>
        <span className="text-gray-400">BTC: </span>
        <span className="text-white font-medium">
          {formatPercentage(stats.btcDominance).replace("+", "")}
        </span>
      </div>
      <div>
        <span className="text-gray-400">ETH: </span>
        <span className="text-white font-medium">
          {formatPercentage(stats.ethDominance).replace("+", "")}
        </span>
      </div>
    </div>
  );
}
