from flask import Flask
from flask_mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy

import boto3, json, urlparse

#For Heroku Logging
import sys, os, logging

app = Flask (__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print 'Follwoing relate to environment variables'
print 'App Settings: ' + os.environ['APP_SETTINGS']
print 'Stuff: ' + os.environ['MAIL_PASSWORD']

print 'Following relate to config variables'
print 'Mail Username: ' + app.config['MAIL_USERNAME']
print "Stuff: " + app.config['MAIL_PASSWORD']

db = SQLAlchemy(app)
mail = Mail(app)

#app.config.from_envvar('GOOGLE_APPLICATION_CREDENTIALS')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
