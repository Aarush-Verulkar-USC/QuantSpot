import { useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GET_COINS } from "../graphql/queries";
import { PRICES_UPDATED } from "../graphql/subscriptions";
import type { Coin } from "../types";

export function useCoins() {
  const { data, loading, error } = useQuery<{ coins: Coin[] }>(GET_COINS);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [flashMap, setFlashMap] = useState<Record<string, "up" | "down">>({});
  const prevPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    if (data?.coins) {
      setCoins(data.coins);
      const prices: Record<string, number> = {};
      for (const coin of data.coins) {
        prices[coin.id] = coin.currentPrice;
      }
      prevPrices.current = prices;
    }
  }, [data]);

  const handleFlash = useCallback((updatedCoins: Coin[]) => {
    const flashes: Record<string, "up" | "down"> = {};
    for (const coin of updatedCoins) {
      const prev = prevPrices.current[coin.id];
      if (prev !== undefined && coin.currentPrice !== prev) {
        flashes[coin.id] = coin.currentPrice > prev ? "up" : "down";
      }
      prevPrices.current[coin.id] = coin.currentPrice;
    }
    setFlashMap(flashes);
    setTimeout(() => setFlashMap({}), 1000);
  }, []);

  useSubscription<{ pricesUpdated: Coin[] }>(PRICES_UPDATED, {
    onData: ({ data: subData }) => {
      if (subData.data?.pricesUpdated) {
        handleFlash(subData.data.pricesUpdated);
        setCoins(subData.data.pricesUpdated);
      }
    },
  });

  return { coins, loading, error, flashMap };
}
