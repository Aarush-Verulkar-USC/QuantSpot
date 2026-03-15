import asyncio
from typing import AsyncGenerator

import strawberry

from app.graphql.types import Coin, GlobalStats, PricePoint, TopMover
from app.ingestion.market_poller import (
    subscribe_global_stats,
    subscribe_prices,
    unsubscribe_global_stats,
    unsubscribe_prices,
)
from app.services.market_service import (
    get_latest_coins,
    get_latest_global_stats,
    get_price_history,
    get_top_movers,
)


def _coin_from_dict(c: dict) -> Coin:
    sparkline = c.get("sparkline_in_7d", {})
    prices = sparkline.get("price", []) if isinstance(sparkline, dict) else []
    return Coin(
        id=c.get("id", ""),
        symbol=c.get("symbol", ""),
        name=c.get("name", ""),
        image=c.get("image", ""),
        current_price=c.get("current_price", 0) or 0,
        market_cap=c.get("market_cap", 0) or 0,
        total_volume=c.get("total_volume", 0) or 0,
        price_change_24h=c.get("price_change_24h", 0) or 0,
        price_change_percentage_24h=c.get("price_change_percentage_24h", 0) or 0,
        sparkline_7d=prices,
    )


@strawberry.type
class Query:
    @strawberry.field(description="Top coins by market cap")
    async def coins(self, limit: int = 50) -> list[Coin]:
        data = await get_latest_coins(limit)
        return [_coin_from_dict(c) for c in data]

    @strawberry.field(description="Global market statistics")
    async def global_stats(self) -> GlobalStats:
        data = await get_latest_global_stats()
        if not data:
            return GlobalStats(
                total_market_cap_usd=0,
                total_volume_24h_usd=0,
                btc_dominance=0,
                eth_dominance=0,
                active_cryptocurrencies=0,
                market_cap_change_percentage_24h=0,
            )
        return GlobalStats(
            total_market_cap_usd=data.get("total_market_cap_usd", 0),
            total_volume_24h_usd=data.get("total_volume_24h_usd", 0),
            btc_dominance=data.get("btc_dominance", 0),
            eth_dominance=data.get("eth_dominance", 0),
            active_cryptocurrencies=data.get("active_cryptocurrencies", 0),
            market_cap_change_percentage_24h=data.get(
                "market_cap_change_percentage_24h", 0
            ),
        )

    @strawberry.field(description="Top gainers or losers")
    async def top_movers(self, direction: str, limit: int = 5) -> list[TopMover]:
        data = await get_top_movers(direction, limit)
        return [
            TopMover(
                id=c.get("id", ""),
                symbol=c.get("symbol", ""),
                name=c.get("name", ""),
                image=c.get("image", ""),
                price_change_percentage_24h=c.get("price_change_percentage_24h", 0)
                or 0,
                current_price=c.get("current_price", 0) or 0,
            )
            for c in data
        ]

    @strawberry.field(description="24h price history for a specific coin")
    async def price_history(self, coin_id: str) -> list[PricePoint]:
        data = await get_price_history(coin_id)
        return [PricePoint(timestamp=p["timestamp"], price=p["price"]) for p in data]


@strawberry.type
class Subscription:
    @strawberry.subscription(description="Live coin price updates")
    async def prices_updated(self) -> AsyncGenerator[list[Coin], None]:
        queue = subscribe_prices()
        try:
            while True:
                coins_data = await queue.get()
                yield [_coin_from_dict(c) for c in coins_data]
        except asyncio.CancelledError:
            pass
        finally:
            unsubscribe_prices(queue)

    @strawberry.subscription(description="Live global stats updates")
    async def global_stats_updated(self) -> AsyncGenerator[GlobalStats, None]:
        queue = subscribe_global_stats()
        try:
            while True:
                data = await queue.get()
                yield GlobalStats(
                    total_market_cap_usd=data.get("total_market_cap_usd", 0),
                    total_volume_24h_usd=data.get("total_volume_24h_usd", 0),
                    btc_dominance=data.get("btc_dominance", 0),
                    eth_dominance=data.get("eth_dominance", 0),
                    active_cryptocurrencies=data.get("active_cryptocurrencies", 0),
                    market_cap_change_percentage_24h=data.get(
                        "market_cap_change_percentage_24h", 0
                    ),
                )
        except asyncio.CancelledError:
            pass
        finally:
            unsubscribe_global_stats(queue)
