import json
import requests

def fetch_and_format_data(api_url):
    # Fetch the data from the API
    response = requests.get(api_url)
    data = response.json()
    
    # Parse the JSON data
    currents_data = json.loads(data['CurrentsJson'])
    
    # Initialize the final structured dictionary
    structured_data = {}
    
    # Iterate through each item in the currents data
    for item in currents_data:
        state = item['STATE']
        district = item['District']
        district_data = {
            "Message": item['Message'],
            "Color": item['Color'],
            "Issue Date": item['Issue Date'],
            "Alert": item['Alert']
        }
        
        # Create the state entry if it doesn't exist
        if state not in structured_data:
            structured_data[state] = {}
        
        # Add the district data under the corresponding state
        structured_data[state][district] = district_data
    
    return structured_data