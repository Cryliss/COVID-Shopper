import json
import time
import urllib.request as url_req

# Method to begin a nearby search
# Calls Google Places API and returns the results
def nearbysearch(loc, type, apikey):
    api_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    radius = 5000                                  # meters : ~3.1 miles
    return search_nearby(api_url, loc, radius, type, apikey)

# Method for URL request handling
def request_api(url):
    response = url_req.urlopen(url)
    json_raw = response.read()
    json_data = json.loads(json_raw)
    return json_data

# Generate the URL needed to do a nearby search.
# Perform the search & returns the results
def search_nearby(api_url, loc, radius, type, apikey):
    search_url = ('%s'
        '?location=%s'
        '&radius=%s'
        '&type=%s'
        '&key=%s') % (api_url, loc, radius, type, apikey)

    results = []
    api_response = request_api(search_url)
    results = results + api_response['results']

    time.sleep(1)
    return results
