import { useSubscription } from "@apollo/client/react";
import { PRICES_UPDATED } from "../../graphql/subscriptions";
import type { Coin } from "../../types";

export function ConnectionStatus() {
  const { error } = useSubscription<{ pricesUpdated: Coin[] }>(PRICES_UPDATED);

  const connected = !error;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          connected ? "bg-green-400 animate-pulse" : "bg-red-400"
        }`}
      />
      <span className={connected ? "text-green-400" : "text-red-400"}>
        {connected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}
