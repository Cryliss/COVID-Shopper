import json
import livepopulartimes
from .database import database
from .usersearch import usersearch

GOOGLE_API_KEY = 'AIzaSyBMZ6xYlzyjMEZTWiXWF7F6KlvOI-rvWm0'

# create recs --> recommender = Recommender(search)
# target_search_recommendations = recommender.user_search_recs
# nearby_search_recommendations = recommender.nearby_search_recs

# loads the JSON & get the results returned from the search
# send them to UserSearch for handling
# updates the JSON file with the new recommendation

def getPrecautions(plusCode):
    return database(plusCode)

def getRecommendations(place):
    recs = usersearch.UserSearch(place)
    user_search_recs = recs.recs
    nearby_search_recs = recs.nsr

    j_recs = {
        "usersearch" : user_search_recs,
        "nearbysearch" : nearby_search_recs
    }

    return j_recs
