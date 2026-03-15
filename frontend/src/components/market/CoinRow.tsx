import { memo } from "react";
import type { Coin } from "../../types";
import { formatCurrency, formatLargeNumber } from "../../utils/formatters";
import { PriceChange } from "../shared/PriceChange";
import { SparklineChart } from "../shared/SparklineChart";

interface CoinRowProps {
  coin: Coin;
  rank: number;
  flash: "up" | "down" | undefined;
  onClick: () => void;
}

export const CoinRow = memo(function CoinRow({
  coin,
  rank,
  flash,
  onClick,
}: CoinRowProps) {
  let flashClass = "";
  if (flash === "up") flashClass = "flash-green";
  if (flash === "down") flashClass = "flash-red";

  return (
    <tr
      className={`border-b border-gray-800/50 hover:bg-gray-900/50 cursor-pointer transition-colors ${flashClass}`}
      onClick={onClick}
    >
      <td className="px-4 py-3 text-gray-400 text-sm">{rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="h-6 w-6 rounded-full"
          />
          <div>
            <span className="text-white font-medium">{coin.name}</span>
            <span className="text-gray-400 text-sm ml-2">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-white text-right font-mono">
        {formatCurrency(coin.currentPrice)}
      </td>
      <td className="px-4 py-3 text-right">
        <PriceChange value={coin.priceChangePercentage24h} />
      </td>
      <td className="px-4 py-3 text-gray-300 text-right">
        {formatLargeNumber(coin.marketCap)}
      </td>
      <td className="px-4 py-3">
        <SparklineChart data={coin.sparkline7d} />
      </td>
    </tr>
  );
});
