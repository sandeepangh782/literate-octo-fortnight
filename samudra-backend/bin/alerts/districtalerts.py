import json
from currentslatestdata import fetch_and_format_data_clat
from hwaalerts import fetch_and_format_data_hwa

def get_messages_for_district(district_name):
    # Fetch and format data from both sources
    clat_data = fetch_and_format_data_clat()
    hwa_data = fetch_and_format_data_hwa()
    
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
                if "High Wave Watch" in message:
                    messages["High Wave Watch"].append(message)
                elif "Swell Surge Watch" in message:
                    messages["Swell Surge Watch"].append(message)

    # Check if any section is empty and set "No Alerts" if true
    for key in messages:
        if not messages[key]:
            messages[key].append("No Alerts")

    return json.dumps(messages, indent=4)

def process_user_input(user_input):
    # Remove the word 'District' and convert to uppercase
    processed_input = user_input.replace('District', '').strip().upper()
    return processed_input

# Example usage
user_input = "Kanniyakumari District"
district_name = process_user_input(user_input)
messages = get_messages_for_district(district_name)
print(messages)