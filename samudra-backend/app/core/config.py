from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Samudra Suraksha"
    PROJECT_VERSION: str = "0.1.0"
    ALLOWED_ORIGINS: list = ["*"]
    DATABASE_URL: str = "postgresql://user:password@localhost/samudra_db"
    INCOIS_API_URL: str = "https://incois.gov.in/api"
    SECRET_KEY: str = "test"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GOOGLE_PLACES_API_KEY: str
    OPENWEATHERMAP_API_KEY: str
    GEMINI_API_KEY: str
    REDIS_URL: str = "redis://localhost"
    ONESIGNAL_APP_ID: str
    ONESIGNAL_REST_API_KEY: str
    SENDGRID_API_KEY: str
    FROM_EMAIL: str

    class Config:
        env_file = ".env"
        from_attributes = True


settings = Settings()
