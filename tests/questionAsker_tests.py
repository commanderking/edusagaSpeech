from flask import Flask
from flask_testing import TestCase
import unittest
from web import app, db
from models import *


class MyTest(TestCase):
    SQLALCHEMY_DATABASE_URI = "postgresql://localhost/edusagaspeech"
    TESTING = True

    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        return app
    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

class AddEpisodes(MyTest):
    def test_add_episode(self):
        teacher = Teacher(username="CoolTeacher", password="mypassword", email="haha@mgmail.com")
        db.session.add(teacher)
		newEpisode = Episodes('introDavid') 
		db.session.add(newEpisode)
		db.session.commit()

        assert teacher in db.session
		assert newEpisode in db.session

