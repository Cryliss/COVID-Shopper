import livepopulartimes
from .database import database

def place(place, APIKEY):
    live = -1
    rank = 0
    key = APIKEY
    map_url = 'https://www.google.com/maps/search/'

    name = place['name']
    place_id = place['place_id']
    loc = place['geometry']['location']
    plus_code = place['plus_code']['compound_code']

    covid = database.database(plus_code)

    if covid['has_live'] == 1:
        pop_moments = get_place_popular_moments(place_id, key)
        live = pop_moments['current_popularity']
        populartimes = pop_moments['populartimes']

    rank = calc_rank(live, covid)

    return {
        "name" : name,
        "live" : str(live),
        "rank" : str(rank),
        "place_id" : place_id,
        "populartimes": str(populartimes),
        "covidprec" : str(covidprec),
    }


# Call to the GitHub repository, livepopulartimes, to get the Place's populartimes & the live time
def get_place_popular_moments(key, place_id):
    popular_moments = livepopulartimes.get_populartimes_by_PlaceID(key, place_id)
    return popular_moments


# Calculates rank based on subtype, covidprec & live values
# +5 for matching subtype
# +1 for each covidprec, except for early_close
def calc_rank(live, covid):
    rank = 0
    if 0 <= live <= 25:
        rank += 20
    if 26 <= live <= 50:
        rank += 15
    if 51 <= live <= 75:
        rank += 10
    if 76 <= live <= 90:
        rank += 5

    if covid['masks'] == 1:
        rank += 1
    if covid['limited_entry'] == 1:
        rank += 1
    if covid['has_early'] == 1:
        rank += 1
    if covid['delivery'] == 1:
        rank += 1

    return rank
