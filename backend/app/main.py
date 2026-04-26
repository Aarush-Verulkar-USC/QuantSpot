import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from app.config import settings
from app.db import close_db, connect_db
from app.graphql.schema import schema
from app.ingestion.market_poller import poll_market_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    logger.info("Connected to MongoDB")

    poller_task = asyncio.create_task(poll_market_data())
    logger.info("Started market data poller")

    yield

    poller_task.cancel()
    try:
        await poller_task
    except asyncio.CancelledError:
        pass
    await close_db()
    logger.info("Shut down cleanly")


app = FastAPI(title="QuantSpot API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173"],
    allow_origin_regex=r"https://.*\.up\.railway\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(
    schema, subscription_protocols=["graphql-transport-ws", "graphql-ws"]
)
app.include_router(graphql_app, prefix="/graphql")


@app.get("/health")
async def health():
    return {"status": "ok"}
