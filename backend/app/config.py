from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGO_URL: str
    PORT: int = 8000
    DEBUG: bool = True
    APP_NAME: str = "Sahjanand Backend"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
