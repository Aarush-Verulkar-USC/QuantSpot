from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.db_name]
    await create_indexes()


async def close_db():
    global client
    if client:
        client.close()


async def create_indexes():
    # market_snapshots: descending timestamp + 24h TTL
    await db.market_snapshots.create_index(
        [("timestamp", -1)],
        name="timestamp_desc",
    )
    await db.market_snapshots.create_index(
        "timestamp",
        name="timestamp_ttl",
        expireAfterSeconds=86400,
    )
    # global_stats: descending timestamp + 24h TTL
    await db.global_stats.create_index(
        [("timestamp", -1)],
        name="timestamp_desc",
    )
    await db.global_stats.create_index(
        "timestamp",
        name="timestamp_ttl",
        expireAfterSeconds=86400,
    )


def get_db() -> AsyncIOMotorDatabase:
    return db
