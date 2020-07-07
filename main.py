import json
import datetime

from flask import Flask, render_template, request, make_response
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token
import lib.livepopulartimes

firebase_request_adapter = requests.Request()

datastore_client = datastore.Client()

app = Flask(__name__)

def return_json(arg):
    resp = make_response(json.dumps( arg, sort_keys = True, indent=4 ))
    resp.headers['Content-type'] = "application/json"
    return resp

def store_time(email, dt):
    entity = datastore.Entity(key=datastore_client.key('User', email, 'visit'))
    entity.update({
        'timestamp': dt
    })
    datastore_client.put(entity)

def fetch_times(email, limit):
    ancestor = datastore_client.key('User', email)
    query = datastore_client.query(kind='visit', ancestor=ancestor)
    query.order = ['-timestamp']

    times = query.fetch(limit=limit)

    return times

@app.route('/getPopularity' ,methods=['POST','GET'])
def getPopularity():
    placeID = None

    placeID = request.values.get('placeid',None)
    if placeID is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getPopularity Failed: Place Idenification Missing. Provide a property named placeid'}
        return helper.return_json(res)

    popularTimes = livepopulartimes.get_populartimes_by_PlaceID(placeID)

    res = {constants.SUCCESS:1, constants.RESPONSE: popularTimes}
    return helper.return_json(res)

@app.route('/')
def root():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    times = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)

            store_time(claims['email'], datetime.datetime.now())
            times = fetch_times(claims['email'], 10)

        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

    return render_template(
        'index.html',
        user_data=claims, error_message=error_message, times=times)


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
