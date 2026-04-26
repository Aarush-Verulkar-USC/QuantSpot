import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCoins } from "../../hooks/useCoins";
import { usePriceHistory } from "../../hooks/usePriceHistory";
import { useDashboardStore } from "../../stores/dashboardStore";
import { CHART_COLOR } from "../../utils/colors";
import { formatCurrency, formatLargeNumber } from "../../utils/formatters";
import { PriceChange } from "../shared/PriceChange";

export function CoinDetail() {
  const { selectedCoinId, clearSelection } = useDashboardStore();
  const { coins } = useCoins();
  const { priceHistory, loading } = usePriceHistory(selectedCoinId);

  if (!selectedCoinId) return null;

  const coin = coins.find((c) => c.id === selectedCoinId);
  if (!coin) return null;

  const chartData = priceHistory.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: p.price,
  }));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={clearSelection}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto animate-slide-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h2 className="text-lg font-bold text-white">
                  {coin.name}{" "}
                  <span className="text-gray-400 font-normal">
                    ({coin.symbol.toUpperCase()})
                  </span>
                </h2>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-white font-mono">
              {formatCurrency(coin.currentPrice)}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <PriceChange value={coin.priceChangePercentage24h} />
              <span className="text-gray-400 text-sm">
                ({formatCurrency(Math.abs(coin.priceChange24h))})
              </span>
            </div>
          </div>

          {/* 24h Chart */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              24h Price Chart
            </h3>
            {loading ? (
              <div className="h-48 bg-gray-900 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    width={65}
                    tickFormatter={(v: number) => formatCurrency(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={CHART_COLOR}
                    strokeWidth={2}
                    fill="url(#chartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Market Cap</span>
              <span className="text-white">{formatLargeNumber(coin.marketCap)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">24h Volume</span>
              <span className="text-white">
                {formatLargeNumber(coin.totalVolume)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
