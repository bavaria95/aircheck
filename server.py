from flask import Flask, request
import json
import database_helper
from flask.ext.cors import CORS

app = Flask(__name__, static_url_path='')
CORS(app)

@app.before_request
def before_request():
    database_helper.connect_db()

@app.teardown_request
def teardown_request(exception):
    database_helper.close_db()

@app.route("/", methods=["GET"])
def main():
    return app.send_static_file('client.html')

@app.route("/sign_up", methods=["POST"])
def sign_up():
    params = request.json
    return json.dumps(database_helper.sign_up_user(params))

@app.route("/sign_in", methods=["POST"])
def sign_in():
    params = request.json
    return json.dumps(database_helper.sign_in_user(params))

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

@app.route("/sensors", methods=["GET"])
def sensors():
    return json.dumps(database_helper.get_all_sensor_data())


@app.route('/problem', methods=['POST', 'GET'])
def problem():
    if request.method == 'GET':
        params = request.args
        return json.dumps(database_helper.get_all_problems_for_user(params))

    if request.method == 'POST':
        params = request.json
        return json.dumps(database_helper.add_heath_problem(params))

@app.route('/problems', methods=['GET'])
def problems():
    return json.dumps(database_helper.get_all_health_problems())

@app.route('/areatypes', methods=['GET'])
def areatypes():
    return json.dumps(database_helper.get_all_area_types())

@app.route('/symptom', methods=['POST', 'GET'])
def symptom():
    if request.method == 'GET':
        params = request.args
        return json.dumps(database_helper.get_all_symptoms_for_user(params))

    if request.method == 'POST':
        params = request.json
        return json.dumps(database_helper.add_symptom_entry(params))

@app.route('/symptoms', methods=['GET'])
def symptoms():
    return json.dumps(database_helper.get_all_symptoms())



@app.route("/test", methods=["GET"])
def test():
    print database_helper.get_problem_name(1)
    return '42'

if __name__ == "__main__":
    app.run(debug=True)