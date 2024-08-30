import json
import os
import random
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import ProgrammingError
from app.models.beach import Beach
from app.db.database import Base
from app.core.config import settings
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# List of possible beach activities
ACTIVITIES = [
    "swimming",
    "surfing",
    "sunbathing",
    "beach volleyball",
    "fishing",
    "snorkeling",
    "kayaking",
    "paddle boarding",
    "jet skiing",
    "beach combing",
    "kite flying",
    "picnicking",
    "beach yoga",
    "sand castle building",
    "bird watching",
]


def enable_postgis(engine):
    try:
        with engine.connect() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            connection.commit()
            logger.info("PostGIS extension enabled successfully.")
    except ProgrammingError as e:
        logger.error(f"Error enabling PostGIS: {str(e)}")
        logger.info("You may need to enable PostGIS manually as a superuser.")
        logger.info(
            "Run: sudo -u postgres psql -d your_database_name -c 'CREATE EXTENSION postgis;'"
        )
        raise


def load_json_file(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


def get_random_activities(n=3):
    return random.sample(ACTIVITIES, k=min(n, len(ACTIVITIES)))


def process_beach_feature(feature):
    props = feature["properties"]
    geometry = feature["geometry"]

    return Beach(
        name=props.get("name"),
        state=props.get("state"),
        state_district=props.get("state_district"),
        city=props.get("city"),
        postcode=props.get("postcode"),
        latitude=props.get("lat"),
        longitude=props.get("lon"),
        formatted_address=props.get("formatted"),
        categories=props.get("categories", []),
        activities=get_random_activities(),
        datasource=props.get("datasource", {}),
        geom=from_shape(Point(geometry["coordinates"]), srid=4326),
    )


def populate_beaches():
    try:
        logger.info("Enabling PostGIS extension...")
        enable_postgis(engine)

        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

        try:
            # Get all JSON files in the 'bin' directory
            json_files = [
                f
                for f in os.listdir("bin")
                if f.startswith("beaches_data_") and f.endswith(".json")
            ]

            total_beaches = 0
            for file_name in json_files:
                file_path = os.path.join("bin", file_name)
                data = load_json_file(file_path)

                beaches = []
                for feature in data["features"]:
                    beach = process_beach_feature(feature)
                    beaches.append(beach)

                db.bulk_save_objects(beaches)
                total_beaches += len(beaches)
                logger.info(f"Processed {len(beaches)} beaches from {file_name}")

            db.commit()
            logger.info(f"Total beaches inserted: {total_beaches}")
        except Exception as e:
            logger.error(f"An error occurred while processing beaches: {str(e)}")
            db.rollback()
        finally:
            db.close()
    except Exception as e:
        logger.error(f"A critical error occurred: {str(e)}")
        logger.info("Beach data population failed.")
    else:
        logger.info("Beach data population completed successfully.")


if __name__ == "__main__":
    logger.info("Starting beach data population...")
    populate_beaches()
