import httpx
from fastapi import HTTPException
import logging
import asyncio
from bin.alerts.currentslatestdata import fetch_and_format_data_clat
from bin.alerts.hwaalerts import fetch_and_format_data_hwa

logger = logging.getLogger(__name__)

async def process_user_input(input_district: str) -> str:
    """Process user input to standardize district name."""
    processed_input = input_district.replace('District', '').strip().upper()
    return processed_input

async def get_messages_for_district(input_district: str) -> dict:
    
    """Get alert messages for a specific district."""
    district_name = await process_user_input(input_district)
    
    try:
        clat_data, hwa_data = await asyncio.gather(
            fetch_and_format_data_clat(),
            fetch_and_format_data_hwa()
        )
    except Exception as e:
        logger.error(f"Error fetching data: {e}")
        raise

    messages = {
        "High Wave Watch": [],
        "Swell Surge Watch": [],
        "Ocean Currents Watch": []
    }

    # Search for the district in CLAT data
    for state, districts in clat_data.items():
        if district_name in districts:
            message = districts[district_name]['Message']
            if "Ocean Currents Watch" in message:
                messages["Ocean Currents Watch"].append(message)

    # Search for the district in HWA data
    for alert_type, states in hwa_data.items():
        for state, districts in states.items():
            if district_name in districts:
                message = districts[district_name]['Message']
                messages[alert_type].append(message)
               
    for key in messages:
        if not messages[key]:
            messages[key].append("No Alerts")

    return messages