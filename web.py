from flask import Flask
from flask_mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
from flask_sslify import SSLify


import boto3, json, urlparse

#For Heroku Logging
import sys, os, logging

app = Flask (__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

sslify = SSLify(app)

db = SQLAlchemy(app)
mail = Mail(app)

#app.config.from_envvar('GOOGLE_APPLICATION_CREDENTIALS')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
