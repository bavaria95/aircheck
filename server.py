from datetime import timedelta
from functools import update_wrapper
from flask import Flask, request
from flask.ext.cors import CORS
import json
import helper
import database_helper

app = Flask(__name__)
CORS(app)


@app.route("/users", methods=["POST", "GET"])
@app.route("/users/<int:user_id>", methods=["GET", "DELETE", "PUT"])
def users(user_id=None):
    if request.method == "POST":
        params = request.json
        return json.dumps(database_helper.sign_up(params))
    
    if request.method == "GET":
        params = request.args
        if user_id:
            return json.dumps(database_helper.get_user_info(params, user_id))
        return json.dumps(database_helper.get_all_users(params))

    if request.method == "DELETE":
        params = request.json
        return json.dumps(database_helper.remove_user(params, user_id))        

    if request.method == "PUT":
        params = request.json
        return json.dumps(database_helper.update_user(params, user_id))


@app.route("/login", methods=["POST"])
def login():
    params = request.json
    return json.dumps(database_helper.login(params))

@app.route("/logout", methods=["POST"])
def logout():
    params = request.json
    return json.dumps(database_helper.logout(params))