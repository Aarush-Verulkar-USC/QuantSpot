import { useTopMovers } from "../../hooks/useTopMovers";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

function MoverCard({
  name,
  symbol,
  image,
  price,
  change,
}: {
  name: string;
  symbol: string;
  image: string;
  price: number;
  change: number;
}) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 min-w-[160px]">
      <img src={image} alt={name} className="h-8 w-8 rounded-full" />
      <div>
        <div className="text-sm font-medium text-white">{symbol.toUpperCase()}</div>
        <div className="text-xs text-gray-400">{formatCurrency(price)}</div>
      </div>
      <span
        className={`ml-auto text-sm font-semibold ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {formatPercentage(change)}
      </span>
    </div>
  );
}

export function TopMovers() {
  const { movers: gainers, loading: gLoading } = useTopMovers("up", 3);
  const { movers: losers, loading: lLoading } = useTopMovers("down", 3);

  if (gLoading || lLoading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4">
      <div>
        <h3 className="text-sm font-medium text-green-400 mb-2">Top Gainers</h3>
        <div className="flex flex-col gap-2">
          {gainers.map((m) => (
            <MoverCard
              key={m.id}
              name={m.name}
              symbol={m.symbol}
              image={m.image}
              price={m.currentPrice}
              change={m.priceChangePercentage24h}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-red-400 mb-2">Top Losers</h3>
        <div className="flex flex-col gap-2">
          {losers.map((m) => (
            <MoverCard
              key={m.id}
              name={m.name}
              symbol={m.symbol}
              image={m.image}
              price={m.currentPrice}
              change={m.priceChangePercentage24h}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
