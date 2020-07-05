import constants
import populartimes

def get_popular_times(placeID):
    return populartimes.get_id(constants.GOOGLE_API_KEY, placeID)

def get_rating(placeID):
    pass

def get_current_popularity(placeID):
    pass

def get_phone_number(placeID):
    pass
