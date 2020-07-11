import constants
import livepopulartimes
import recommender

def get_popular_times(placeID):
    return livepopulartimes.get_populartimes_by_PlaceID(constants.GOOGLE_API_KEY, placeID)

def get_rating(placeID):
    pass

def get_current_popularity(placeID):
    pass

def get_phone_number(placeID):
    pass
