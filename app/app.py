import config
from flask import Flask, jsonify, request, send_file
from flower_viewing_parks import FlowerViewingParks as fvp
from google_place_api import GooglePlaceAPI as gpapi
from station_finder import StationFinder as sf

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/flowers', methods=['GET'])
def get_flower_list():
    return jsonify({'flowers': fvp.get_flower_list()})

@app.route('/flowers/<string:flower_name>', methods=['GET'])
def get_flower(flower_name):
    parks = fvp.get_parks_from_flower(flower_name)
    term = fvp.get_term_from_flower(flower_name)
    return jsonify({'flower': flower_name, 'parks': parks, 'term': term})

@app.route('/flowers/<string:flower_name>/parks', methods=['GET'])
def get_flower_parks(flower_name):
    parks = fvp.get_parks_from_flower(flower_name)
    return jsonify({'parks': parks})

@app.route('/flowers/<string:flower_name>/term', methods=['GET'])
def get_term(flower_name):
    term = fvp.get_term_from_flower(flower_name)
    return jsonify({'term': term})

@app.route('/parks', methods=['GET'])
def get_parks():
    return jsonify({'parks': fvp.get_park_list()})

@app.route('/parks/<string:park_name>/near_stations', methods=['GET'])
def get_near_stations(park_name):
    station_loc = gpapi.get_park_coordinate(park_name)
    stations = sf.find_nearest_station(station_loc[0], station_loc[1])
    return jsonify(stations)

if __name__ == '__main__':
    app.run(debug=True)
