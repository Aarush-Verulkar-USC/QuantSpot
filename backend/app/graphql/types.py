import strawberry


@strawberry.type
class Coin:
    id: str
    symbol: str
    name: str
    image: str
    current_price: float
    market_cap: float
    total_volume: float
    price_change_24h: float
    price_change_percentage_24h: float
    sparkline_7d: list[float]


@strawberry.type
class GlobalStats:
    total_market_cap_usd: float
    total_volume_24h_usd: float
    btc_dominance: float
    eth_dominance: float
    active_cryptocurrencies: int
    market_cap_change_percentage_24h: float


@strawberry.type
class TopMover:
    id: str
    symbol: str
    name: str
    image: str
    price_change_percentage_24h: float
    current_price: float


@strawberry.type
class PricePoint:
    timestamp: float
    price: float
