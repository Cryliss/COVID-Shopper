import livepopulartimes
from .database import database
from datetime import datetime

def place(self, place, os_sub, os_name):
    self.os_sub = os_sub                # original search subtype
    self.os_name = os_name
    self.map_url = 'https://www.google.com/maps/search/'
    self.key = 'AIzaSyBMZ6xYlzyjMEZTWiXWF7F6KlvOI-rvWm0'

    self.name = place['name']
    self.place_id = place['place_id']
    self.plus_code = place['plus_code']['compound_code']
    self.loc = self.get_location(place)

    self.in_db = False
    self.subtype = ''
    self.covidprec = [-1,-1,-1,-1,[],-1]     # masks, lim_ent, early_close, has_early, early_hours, delivery
    self.has_pt = False
    self.has_live = False
    self.live = 0
    self.url = self.get_url()

    database.Database(self)
    if self.has_live:
        self.pop_times = self.get_place_popular_moments()
        self.get_live_time()
    self.calc_rank()
    self.json = self.place_to_JSON()

# Get location as a string
def get_location(self, place):
    lat = place['geometry']['location']['lat']
    lng = place['geometry']['location']['lng']
    return str(lat) + ',' + str(lng)

# URL for hyper-linking results in the recommendations table ?
def get_url(self):
    return ('%s'
            '?api=%s'
            '&query=%s'
            '&query_place_id=%s') % (self.map_url, self.key, self.loc, self.place_id)

# Call to the GitHub repository, livepopulartimes, to get the Place's populartimes & the live time
def get_place_popular_moments(self):
    popular_moments = livepopulartimes.get_populartimes_by_PlaceID(self.key, self.place_id)
    if 'populartimes' in popular_moments:
        return popular_moments['populartimes']
    else:
        return None

# Determine what the current time is and get the live value
# from pop_times array
def get_live_time(self):
    day_num = datetime.today().weekday()
    hour = datetime.now().hour
    day_pt = self.pop_times[day_num]['data']
    self.live = day_pt[hour]

# Calculates rank based on subtype, covidprec & live values
# +5 for matching subtype
# +1 for each covidprec, except for early_close
def calc_rank(self):
    self.rank = 0
    if self.name != self.os_name:
        if self.subtype == self.os_sub:
            self.rank += 5
    for i in range(len(self.covidprec)):
        if i != 2:
            if self.covidprec[i] == 1:
                self.rank += 1
    if self.has_pt:
        self.rank += 1
        if self.has_live:
            self.calc_live_rank()

# Determines the amount to add to the rank based on the
# stores current live value
# PRE-CONDITION: has_live = true
def calc_live_rank(self):
    if 0 <= self.live <= 25:
        self.rank += 20
    if 26 <= self.live <= 50:
        self.rank += 15
    if 51 <= self.live <= 75:
        self.rank += 10
    if 76 <= self.live <= 90:
        self.rank += 5

# Formats the place into a Dict, a type compatible with
# Python's method to convert to JSON
def place_to_JSON(self):
    place = {
        "name" : str(self.name),
        "live" : str(self.live),
        "rank" : str(self.rank),
        "place_id" : str(self.place_id),
        "covidprec" : str(self.covidprec),
        "place_url" : str(self.url),
    }
    return place
