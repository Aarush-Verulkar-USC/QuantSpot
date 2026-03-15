import httpx

from app.config import settings
from app.db import get_db


async def get_latest_coins(limit: int = 50) -> list[dict]:
    db = get_db()
    doc = await db.market_snapshots.find_one(sort=[("timestamp", -1)])
    if not doc:
        return []
    return doc["coins"][:limit]


async def get_latest_global_stats() -> dict | None:
    db = get_db()
    doc = await db.global_stats.find_one(sort=[("timestamp", -1)])
    return doc


async def get_top_movers(direction: str, limit: int = 5) -> list[dict]:
    coins = await get_latest_coins(50)
    reverse = direction == "up"
    sorted_coins = sorted(
        coins,
        key=lambda c: c.get("price_change_percentage_24h") or 0,
        reverse=reverse,
    )
    return sorted_coins[:limit]


async def get_price_history(coin_id: str) -> list[dict]:
    """Fetch 24h price history from CoinGecko on demand."""
    url = f"{settings.coingecko_base_url}/coins/{coin_id}/market_chart"
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(url, params={"vs_currency": "usd", "days": 1})
        resp.raise_for_status()
        data = resp.json()

    return [
        {"timestamp": point[0], "price": point[1]}
        for point in data.get("prices", [])
    ]
