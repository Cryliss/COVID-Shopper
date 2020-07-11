import constants
import livepopulartimes

# Handling the app routing
# Called from main.py
# Sends request to livepopulartimes package to get the
# live popular times for the store in question
def get_popular_times(placeID):
    return livepopulartimes.get_populartimes_by_PlaceID(constants.GOOGLE_API_KEY, placeID)
