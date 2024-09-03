import json
import requests

def fetch_and_format_data_hwa(api_url="https://sarat.incois.gov.in/incoismobileappdata/rest/incois/hwassalatestdata"):
    # Fetch the data from the API
    response = requests.get(api_url)
    data = response.json()
    
    # Parse the JSON data
    hwa_data = json.loads(data['HWAJson'])
    ssa_data = json.loads(data['SSAJson'])
    
    # Initialize the final structured dictionary
    structured_data = {
        "High Wave Alert": {},
        "Swell Surge Alert": {}
    }
    
    # Process the High Wave Alert data
    for item in hwa_data:
        state = item['STATE']
        district = item['District']
        hwa_item = {
            "Message": item['Message'],
            "Color": item['Color'],
            "Issue Date": item['Issue Date'],
            "Alert": item['Alert']
        }
        
        # Create the state entry if it doesn't exist
        if state not in structured_data["High Wave Alert"]:
            structured_data["High Wave Alert"][state] = {}
        
        # Add the district data under the corresponding state
        structured_data["High Wave Alert"][state][district] = hwa_item
    
    # Process the Swell Surge Alert data
    for item in ssa_data:
        state = item['STATE']
        district = item['District']
        ssa_item = {
            "Message": item['Message'],
            "Color": item['Color'],
            "Issue Date": item['Issue Date'],
            "Alert": item['Alert']
        }
        
        # Create the state entry if it doesn't exist
        if state not in structured_data["Swell Surge Alert"]:
            structured_data["Swell Surge Alert"][state] = {}
        
        # Add the district data under the corresponding state
        structured_data["Swell Surge Alert"][state][district] = ssa_item

    
    return structured_data

# Example usage
#api_url = "https://sarat.incois.gov.in/incoismobileappdata/rest/incois/hwassalatestdata"
#formatted_data = fetch_and_format_data(api_url)
# Convert the structured data to a JSON string and print it
#formatted_json = json.dumps(formatted_data, indent=4)
#print(formatted_json)