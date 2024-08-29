from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api import auth

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


@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to the Beach Safety App API"}


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
