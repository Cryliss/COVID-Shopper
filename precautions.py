import recommender

# Handling the app routing
# Called from main.py
# Sends request to recommender package to get the COVID-19
# precautions for the specified store
def getPrecautions(pluscode):
    return recommender.getPrecautions(pluscode)
