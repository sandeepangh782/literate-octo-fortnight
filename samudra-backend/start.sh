set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting the FastAPI application..."
if [ -f "/app/samudra-backend/app/main.py" ]; then
    uvicorn app.main:app --host 0.0.0.0 --port 8000
else
    echo "Error: main.py not found in expected location"
    exit 1
fi