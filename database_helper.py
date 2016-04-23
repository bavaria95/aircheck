from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
import binascii
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aircheck.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)

class Problem(db.Model):
    __tablename__ = 'Problem'

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String, unique=True)



if __name__ == "__main__":
    db.create_all()