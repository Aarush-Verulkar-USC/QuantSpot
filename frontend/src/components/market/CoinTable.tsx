import { useMemo } from "react";
import { useCoins } from "../../hooks/useCoins";
import { useDashboardStore } from "../../stores/dashboardStore";
import type { Coin, SortDirection, SortField } from "../../types";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { CoinRow } from "./CoinRow";

function SortHeader({
  label,
  field,
  currentField,
  currentDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField, direction: SortDirection) => void;
}) {
  const isActive = field === currentField;
  const arrow = isActive ? (currentDirection === "asc" ? " \u25B2" : " \u25BC") : "";

  return (
    <th
      className="px-4 py-3 text-right text-sm font-medium text-gray-400 cursor-pointer hover:text-white select-none"
      onClick={() =>
        onSort(field, isActive && currentDirection === "desc" ? "asc" : "desc")
      }
    >
      {label}
      {arrow}
    </th>
  );
}

function sortCoins(coins: Coin[], field: SortField, direction: SortDirection): Coin[] {
  const sorted = [...coins].sort((a, b) => {
    let diff = 0;
    switch (field) {
      case "market_cap":
        diff = a.marketCap - b.marketCap;
        break;
      case "price":
        diff = a.currentPrice - b.currentPrice;
        break;
      case "change_24h":
        diff = a.priceChangePercentage24h - b.priceChangePercentage24h;
        break;
    }
    return direction === "asc" ? diff : -diff;
  });
  return sorted;
}

export function CoinTable() {
  const { coins, loading, flashMap } = useCoins();
  const { sortField, sortDirection, setSort, selectCoin } = useDashboardStore();

  const sortedCoins = useMemo(
    () => sortCoins(coins, sortField, sortDirection),
    [coins, sortField, sortDirection]
  );

  if (loading) return <div className="px-6"><LoadingSkeleton rows={15} /></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">#</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Coin
            </th>
            <SortHeader
              label="Price"
              field="price"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={setSort}
            />
            <SortHeader
              label="24h %"
              field="change_24h"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={setSort}
            />
            <SortHeader
              label="Market Cap"
              field="market_cap"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={setSort}
            />
            <th className="px-4 py-3 text-sm font-medium text-gray-400">7d</th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin, i) => (
            <CoinRow
              key={coin.id}
              coin={coin}
              rank={i + 1}
              flash={flashMap[coin.id]}
              onClick={() => selectCoin(coin.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
