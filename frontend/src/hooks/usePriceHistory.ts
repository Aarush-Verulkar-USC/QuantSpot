import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { GET_PRICE_HISTORY } from "../graphql/queries";
import type { PricePoint } from "../types";

export function usePriceHistory(coinId: string | null) {
  const [fetchHistory, { data, loading, error }] = useLazyQuery<{
    priceHistory: PricePoint[];
  }>(GET_PRICE_HISTORY);

  useEffect(() => {
    if (coinId) {
      fetchHistory({ variables: { coinId } });
    }
  }, [coinId, fetchHistory]);

  return {
    priceHistory: data?.priceHistory ?? [],
    loading,
    error,
  };
}
