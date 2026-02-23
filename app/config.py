import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


def build_database_url() -> str:
    dialect = os.getenv("DB_DIALECT", "postgresql")
    user = os.getenv("DB_USER", "capricorn_admin")
    password = os.getenv("DB_PASSWORD", "")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "expense-tracker")
    return f"{dialect}://{user}:{password}@{host}:{port}/{name}"


class Settings(BaseSettings):
    database_url: str = build_database_url()
    cors_origins: str = "https://ranvijay.capricorn.online,http://ranvijay.capricorn.online"
    app_port: int = int(os.getenv("PORT", "5007"))

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
