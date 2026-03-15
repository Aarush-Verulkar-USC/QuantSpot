from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    db_name: str = "quantspot"
    coingecko_base_url: str = "https://api.coingecko.com/api/v3"
    poll_interval_seconds: int = 60
    frontend_origin: str = "http://localhost:3000"


settings = Settings()
