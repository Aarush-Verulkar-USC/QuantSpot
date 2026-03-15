import { gql } from "@apollo/client";

export const GET_COINS = gql`
  query GetCoins($limit: Int) {
    coins(limit: $limit) {
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

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStats {
      totalMarketCapUsd
      totalVolume24hUsd
      btcDominance
      ethDominance
      activeCryptocurrencies
      marketCapChangePercentage24h
    }
  }
`;

export const GET_TOP_MOVERS = gql`
  query GetTopMovers($direction: String!, $limit: Int) {
    topMovers(direction: $direction, limit: $limit) {
      id
      symbol
      name
      image
      priceChangePercentage24h
      currentPrice
    }
  }
`;

export const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($coinId: String!) {
    priceHistory(coinId: $coinId) {
      timestamp
      price
    }
  }
`;
