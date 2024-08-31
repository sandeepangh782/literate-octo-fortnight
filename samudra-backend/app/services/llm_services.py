import google.generativeai as genai
from fastapi import HTTPException
import logging
from app.core.config import settings
import json
from datetime import datetime
from pydantic import BaseModel

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

SYSTEM_PROMPT = """
You are an AI beach safety expert. Your role is to analyze beach conditions and provide concise, important safety points for visitors.
Focus on the most critical safety aspects based on the given information.
Your advice should be clear, actionable, and relevant to the specific conditions of the beach.
"""

USER_PROMPT_TEMPLATE = """
Given the following beach details, provide three important safety points for visitors:

{beach_details}

Based on these conditions, provide three concise and important safety points for beach visitors.
Format the response as a list of three points, each starting with a hyphen (-).
"""


class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, BaseModel):
            return obj.dict()
        return super().default(obj)


def convert_to_dict(obj):
    if isinstance(obj, BaseModel):
        return obj.dict()
    elif isinstance(obj, dict):
        return {k: convert_to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_dict(v) for v in obj]
    else:
        return obj


async def generate_safety_points(beach_details):
    beach_details_dict = convert_to_dict(beach_details)

    # Convert the beach details dictionary to a formatted string, handling datetime objects and Pydantic models
    beach_details_str = json.dumps(beach_details_dict, indent=2, cls=EnhancedJSONEncoder)

    user_prompt = USER_PROMPT_TEMPLATE.format(beach_details=beach_details_str)

    try:
        response = await model.generate_content_async([SYSTEM_PROMPT, user_prompt])
        safety_points = response.text.strip().split('\n')
        # Ensure we have exactly 3 points and they start with a hyphen
        safety_points = [point.strip()[2:] for point in safety_points if point.strip().startswith('-')][:3]

        # If we don't have exactly 3 points, pad with generic safety advice
        while len(safety_points) < 3:
            safety_points.append("Always follow lifeguard instructions and beach safety signs.")

        return safety_points
    except Exception as e:
        logger.error(f"Error generating safety points: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate safety points")
