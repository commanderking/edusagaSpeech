from flask import Flask
from flask_mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy

import boto3, json, urlparse

#For Heroku Logging
import sys, os, logging

app = Flask (__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print os.environ['APP_SETTINGS']
print os.environ['MAIL_USERNAME']
print os.environ['MAIL_PASSWORD']

'''
app.config.update(
	DEBUG=True,
	#EMAIL SETTINGS
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = 'edusaga.games@gmail.com',
	MAIL_PASSWORD = '',
    MAIL_DEFAULT_SENDER = 'EduSaga')
'''
db = SQLAlchemy(app)
mail = Mail(app)

#app.config.from_envvar('GOOGLE_APPLICATION_CREDENTIALS')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
