from pydantic import BaseSettings


class Settings(BaseSettings):
    client_id: str
    client_secret: str
    primary_key: str
    backend_url: str
    frontend_url: str
    mongodb_url: str

    class Config:
        env_file = ".env"


settings = Settings()