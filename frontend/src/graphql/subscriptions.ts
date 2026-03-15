import { gql } from "@apollo/client";

export const PRICES_UPDATED = gql`
  subscription PricesUpdated {
    pricesUpdated {
      id
      symbol
      name
      image
      currentPrice
      marketCap
      totalVolume
      priceChange24h
      priceChangePercentage24h
      sparkline7d
    }
  }
`;

export const GLOBAL_STATS_UPDATED = gql`
  subscription GlobalStatsUpdated {
    globalStatsUpdated {
      totalMarketCapUsd
      totalVolume24hUsd
      btcDominance
      ethDominance
      activeCryptocurrencies
      marketCapChangePercentage24h
    }
  }
`;
