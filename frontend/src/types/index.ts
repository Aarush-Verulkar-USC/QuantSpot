export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  sparkline7d: number[];
}

export interface GlobalStats {
  totalMarketCapUsd: number;
  totalVolume24hUsd: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  marketCapChangePercentage24h: number;
}

export interface TopMover {
  id: string;
  symbol: string;
  name: string;
  image: string;
  priceChangePercentage24h: number;
  currentPrice: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export type SortField = "market_cap" | "price" | "change_24h";
export type SortDirection = "asc" | "desc";
