import { useQuery, useSubscription } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_GLOBAL_STATS } from "../graphql/queries";
import { GLOBAL_STATS_UPDATED } from "../graphql/subscriptions";
import type { GlobalStats } from "../types";

export function useGlobalStats() {
  const { data, loading, error } = useQuery<{ globalStats: GlobalStats }>(GET_GLOBAL_STATS);
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    if (data?.globalStats) {
      setStats(data.globalStats);
    }
  }, [data]);

  useSubscription<{ globalStatsUpdated: GlobalStats }>(GLOBAL_STATS_UPDATED, {
    onData: ({ data: subData }) => {
      if (subData.data?.globalStatsUpdated) {
        setStats(subData.data.globalStatsUpdated);
      }
    },
  });

  return { stats, loading, error };
}
