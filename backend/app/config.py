import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGO_URL: str
    BACKEND_PORT: int = 8000
    DEBUG: bool = True
    APP_NAME: str = "Sahjanand Backend"
    JWT_SECRET: str = "supersecretjwtkey12345"
    ADMIN_ID: str = "Admin"
    ADMIN_PASSWORD: str = "Admin123"

    model_config = SettingsConfigDict(
        env_file=os.path.join(Path(__file__).parent.parent.parent, ".env"),
        extra="ignore"
    )


settings = Settings()
