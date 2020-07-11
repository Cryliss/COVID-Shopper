import constants
import popularity
import recommender
import precautions

# Handling the app routing
# Called from main.py
# Sends request to recommender package
def getRecommendations(loc):
    places = recommender.getRecommendations(loc, constants.TYPE, constants.GOOGLE_API_KEY)
    return get_place_info(places)

# Call precautions.py to send a request to get the COVID precautions from
# the databse. Call popularity.py to get to the live times from the repository.
# Combine results into a dict, and to an array of recommendations.
# Return recommendations.
def get_place_info(places):
    recs = []
    i = 0
    for place in range(len(places)):
        if i == 5:
            return recs
        plus_code = str(places[place]['plus_code']['compound_code'])
        print(plus_code)
        covid = precautions.getPrecautions(plus_code)
        popularTimes = popularity.get_popular_times(str(places[place]['place_id']))
        p = {
            "populartimes": popularTimes,
            "covid": covid
        }
        recs.append(p)
        i += 1
    return recs
