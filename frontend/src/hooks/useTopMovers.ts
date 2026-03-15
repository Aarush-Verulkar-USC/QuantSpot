import { useQuery, useSubscription } from "@apollo/client/react";
import { GET_TOP_MOVERS } from "../graphql/queries";
import { PRICES_UPDATED } from "../graphql/subscriptions";
import type { Coin, TopMover } from "../types";

export function useTopMovers(direction: "up" | "down", limit = 5) {
  const { data, loading, error, refetch } = useQuery<{ topMovers: TopMover[] }>(
    GET_TOP_MOVERS,
    { variables: { direction, limit } }
  );

  useSubscription<{ pricesUpdated: Coin[] }>(PRICES_UPDATED, {
    onData: () => {
      refetch();
    },
  });

  return { movers: data?.topMovers ?? [], loading, error };
}
