from flask import Flask, request
import json
import database_helper
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)

@app.before_request
def before_request():
    database_helper.connect_db()

@app.teardown_request
def teardown_request(exception):
    database_helper.close_db()

@app.route("/sign_up", methods=["POST"])
def sign_up():
    params = request.json
    return json.dumps(database_helper.sign_up_user(params))

@app.route("/sign_in", methods=["POST"])
def sign_in():
    params = request.json
    return json.dumps(database_helper.sign_in_user(params))

@app.route("/symptoms", methods=["POST","GET"])
@app.route("/symptoms/<int:symptom_id>", methods=["GET"])
def symptoms(symptom_id=None):
    if symptom_id:
        return json.dumps(Symptom.query())

@app.route("/sign_out", methods=["POST"])
def sign_out():
    params = request.json
    return json.dumps(database_helper.sign_out_user(params))

@app.route("/change_password", methods=["POST"])
def change_password():
    params = request.json
    return json.dumps(database_helper.change_password(params))

@app.route("/sensor", methods=["POST"])
def sensor():
    params = request.form
    return json.dumps(database_helper.add_sensor_data(params))

@app.route('/problems', methods=['GET'])
def problems():
    return json.dumps(database_helper.get_all_health_problems())

@app.route('/areatypes', methods=['GET'])
def areatypes():
    return json.dumps(database_helper.get_all_area_types())

@app.route("/test", methods=["GET"])
def test():
    print database_helper.get_problem_name(1)
    return '42'

if __name__ == "__main__":
    app.run(debug=True)