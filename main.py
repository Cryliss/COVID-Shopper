import json
import constants
import popularity
import precautions
import recommending
from flask import Flask, make_response, request, render_template

app = Flask(__name__)

# Set the default route for our app
# Upon routing to the site, render the HTML file.
@app.route('/')
def index():
    return render_template('index.html')

# Set the route for the app to get the popular times for the store
# Upon receiving a request to the specified URL,
# Calls popularity.py to handle the request
@app.route('/getPopularity' ,methods=['POST','GET'])
def getPopularity():
    placeID = None

    placeID = request.values.get('placeid',None)
    if placeID is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getPopularity Failed: Place Idenification Missing. Provide a property named placeid'}
        resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
        resp.headers['Content-type'] = "application/json"
        return resp

    popularTimes = popularity.get_popular_times(placeID)

    res = {constants.SUCCESS:1, constants.RESPONSE: popularTimes}
    resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
    resp.headers['Content-type'] = "application/json"

    return resp

# Set the route for the app to get the COVID precautions for the store
# Upon receiving a request to the specified URL,
# Calls precautions.py to handle the request
@app.route('/getPrecautions' ,methods=['POST','GET'])
def getPrecautions():
    print("Hello u are in precautions")
    plusCode = None

    plusCode = request.values.get('pluscode',None)
    if plusCode is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getPrecautions Failed: Plus Code Missing. Provide a property named pluscode'}
        resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
        resp.headers['Content-type'] = "application/json"
        return resp
    print(plusCode)
    covid = precautions.getPrecautions(plusCode)
    print(covid)

    res = {constants.SUCCESS:1, constants.RESPONSE: covid}
    resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
    resp.headers['Content-type'] = "application/json"
    return resp

# Set the route for the app to get nearby superemarkets to the current store
# Upon receiving a request to the specified URL,
# Calls recommending.py to handle the request
@app.route('/getRecommendations' ,methods=['POST','GET'])
def getRecommendations():
    print("Hello u are in recommendations")
    loc = None

    loc = request.values.get('loc',None)
    if loc is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getRecommendations Failed: Location Missing. Provide a property named loc'}
        resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
        resp.headers['Content-type'] = "application/json"
        return resp

    print(loc)
    lat = loc[1:10]
    lng = loc[13:24]
    if (lng[0] != '-'):
        lng = '-' + lng
    loc_str = lat + ',' + lng
    print(loc_str)
    alts = recommending.getRecommendations(loc_str)
    print(alts)

    res = {constants.SUCCESS:1, constants.RESPONSE: alts}
    resp = make_response(json.dumps( res, sort_keys = True, indent=4 ))
    resp.headers['Content-type'] = "application/json"
    return resp

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
