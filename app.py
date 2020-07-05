from flask import Flask, request, render_template
import helper
import popularity
import constants
import recommender

app = Flask(__name__)

@app.route('/' ,methods=['POST','GET'])
def home():
    return render_template('index.html')

@app.route('/getPopularity' ,methods=['POST','GET'])
def getPopularity():
    placeID = None

    placeID = request.values.get('placeid',None)
    if placeID is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getPopularity Failed: Place Idenification Missing. Provide a property named placeid'}
        return helper.return_json(res)

    popularTimes = popularity.get_popular_times(placeID)

    res = {constants.SUCCESS:1, constants.RESPONSE: popularTimes}
    return helper.return_json(res)

@app.route('/getRecommendations' ,methods=['POST','GET'])
def getRecommendations():
    plusCode = None

    plusCode = request.values.get('pluscode',None)
    if plusCode is None:
        res = {constants.ERROR:1, constants.MESSAGE:'getRecommendations Failed: Place Idenification Missing. Provide a property named pluscode'}
        return helper.return_json(res)

    recommendations = recommender.get_recommendations(pluscode)

    res = {constants.SUCCESS:1, constants.RESPONSE: recommendations}
    return helper.return_json(res)
