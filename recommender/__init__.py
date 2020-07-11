from .database import database
from .nearbysearch import nearbysearch

# Get the COVID-19 precautions for the store associated with the
# given plusCode is found in the database
def getPrecautions(plusCode):
    return database(plusCode)

# Perform a nearby search for supermarkets near the users initially
# searched location
def getRecommendations(loc, type, apikey):
    return nearbysearch(loc, type, apikey)
