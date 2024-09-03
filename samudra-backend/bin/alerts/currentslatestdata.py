import json
import requests

def fetch_and_format_data_clat(api_url="https://samudra.incois.gov.in/incoismobileappdata/rest/incois/currentslatestdata"):
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
# Example usage
#api_url = "https://samudra.incois.gov.in/incoismobileappdata/rest/incois/currentslatestdata"
#formatted_data = fetch_and_format_data(api_url)

# Convert the structured data to a JSON string and print it
#formatted_json = json.dumps(formatted_data, indent=4)
#print(formatted_json)
