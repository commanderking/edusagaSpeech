from flask import Flask
from flask_mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
from flask_sslify import SSLify
#For Heroku Logging
import sys, os, logging
import stripe

stripe_keys = {
    'secret_key': os.environ['STRIPE_SECRET_KEY'],
    'publishable_key': os.environ['STRIPE_PUBLISHABLE_KEY']
}
stripe.api_key = stripe_keys['secret_key']

app = Flask (__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

sslify = SSLify(app)

db = SQLAlchemy(app)

mail = Mail(app)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
