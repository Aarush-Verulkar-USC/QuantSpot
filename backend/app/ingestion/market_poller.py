import asyncio
import logging
from datetime import datetime, timezone

import httpx

from app.config import settings
from app.db import get_db

logger = logging.getLogger(__name__)

# Broadcast: list of asyncio.Queues for active subscribers
_price_subscribers: list[asyncio.Queue] = []
_global_stats_subscribers: list[asyncio.Queue] = []


def subscribe_prices() -> asyncio.Queue:
    queue: asyncio.Queue = asyncio.Queue()
    _price_subscribers.append(queue)
    return queue


def unsubscribe_prices(queue: asyncio.Queue):
    _price_subscribers.remove(queue)


def subscribe_global_stats() -> asyncio.Queue:
    queue: asyncio.Queue = asyncio.Queue()
    _global_stats_subscribers.append(queue)
    return queue


def unsubscribe_global_stats(queue: asyncio.Queue):
    _global_stats_subscribers.remove(queue)


async def _broadcast_prices(coins: list[dict]):
    for queue in _price_subscribers:
        await queue.put(coins)


async def _broadcast_global_stats(stats: dict):
    for queue in _global_stats_subscribers:
        await queue.put(stats)


async def poll_market_data():
    """Background task that polls CoinGecko every POLL_INTERVAL_SECONDS."""
    base_url = settings.coingecko_base_url

    async with httpx.AsyncClient(timeout=30.0) as client:
        while True:
            try:
                await _poll_cycle(client, base_url)
            except asyncio.CancelledError:
                logger.info("Market poller cancelled")
                break
            except Exception:
                logger.exception("Error in poll cycle")

            await asyncio.sleep(settings.poll_interval_seconds)


async def _poll_cycle(client: httpx.AsyncClient, base_url: str):
    db = get_db()
    now = datetime.now(timezone.utc)

    # Fetch top 50 coins
    coins_resp = await client.get(
        f"{base_url}/coins/markets",
        params={
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": 50,
            "sparkline": "true",
        },
    )

    # Check rate limit
    remaining = coins_resp.headers.get("x-ratelimit-remaining")
    if remaining and int(remaining) < 5:
        logger.warning("Approaching CoinGecko rate limit, skipping this cycle")
        return

    coins_resp.raise_for_status()
    coins_data = coins_resp.json()

    # Store market snapshot
    snapshot = {"timestamp": now, "coins": coins_data}
    await db.market_snapshots.insert_one(snapshot)
    logger.info("Stored market snapshot with %d coins", len(coins_data))

    # Broadcast to price subscribers
    await _broadcast_prices(coins_data)

    # Fetch global stats
    global_resp = await client.get(f"{base_url}/global")
    global_resp.raise_for_status()
    global_data = global_resp.json().get("data", {})

    global_doc = {
        "timestamp": now,
        "total_market_cap_usd": global_data.get("total_market_cap", {}).get("usd", 0),
        "total_volume_24h_usd": global_data.get("total_volume", {}).get("usd", 0),
        "btc_dominance": global_data.get("market_cap_percentage", {}).get("btc", 0),
        "eth_dominance": global_data.get("market_cap_percentage", {}).get("eth", 0),
        "active_cryptocurrencies": global_data.get("active_cryptocurrencies", 0),
        "market_cap_change_percentage_24h": global_data.get(
            "market_cap_change_percentage_24h_usd", 0
        ),
    }
    await db.global_stats.insert_one(global_doc)
    logger.info("Stored global stats")

    # Broadcast to global stats subscribers
    await _broadcast_global_stats(global_doc)
