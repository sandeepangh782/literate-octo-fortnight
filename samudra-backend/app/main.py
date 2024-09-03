from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api import auth, beaches, favorites, notifications
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
setup_logging()


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(beaches.router, prefix="/api/v1/beaches", tags=["beaches"])
app.include_router(favorites.router, prefix="/api/v1/favorites", tags=["favorites"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
# Handle trailing slashes
app.router.redirect_slashes = False


@app.on_event("startup")
async def startup_event():
    redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache:")


@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to the Beach Safety App API"}


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
