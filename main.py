import json
import constants
import popularity
import precautions
from flask import Flask, make_response, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    #conn = get_db_connection()
    #posts = conn.execute('SELECT * FROM posts').fetchall()
    #conn.close()
    return render_template('index.html')

@app.route('/getPopularity' ,methods=['POST','GET'])
def getPopularity():
    print("Hello u are in popularity")
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
    r = {constants.SUCCESS:1, constants.RESPONSE: covid}
    resp = make_response(json.dumps( r, sort_keys = True, indent=4 ))
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
