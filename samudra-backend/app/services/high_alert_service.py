import json
import requests


def fetch_and_format_data(api_url):
    response = requests.get(api_url)
    data = response.json()

    currents_data = json.loads(data['CurrentsJson'])

    structured_data = {}

    for item in currents_data:
        state = item['STATE']
        district = item['District']
        district_data = {
            "Message": item['Message'],
            "Color": item['Color'],
            "Issue Date": item['Issue Date'],
            "Alert": item['Alert']
        }

        if state not in structured_data:
            structured_data[state] = {}

        structured_data[state][district] = district_data

    return structured_data


data = fetch_and_format_data("https://samudra.incois.gov.in/incoismobileappdata/rest/incois/currentslatestdata")
print(data)
