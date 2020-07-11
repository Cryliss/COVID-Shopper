from .place import place
from .nearbysearch import nearbysearch

def usersearch(self, place):
        self.name = place['name']
        self.type = place['types'][0]
        self.places = []
        self.recs = []
        self.loc = place['geometry']['location']
        self.nsr = nearbysearch(self.loc, self.type, self.subtype, self.name)
        self.create_places(results)


def create_places(self, place):
    place = place(place, self.type, self.name)
