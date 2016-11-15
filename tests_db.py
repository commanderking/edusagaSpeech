from flask import Flask
from flask_testing import TestCase
import unittest
from main import app, db
from models import *
from flask.ext.login import current_user

class TestSetup(TestCase):
    SQLALCHEMY_DATABASE_URI = "postgresql://localhost/edusagaspeech"
    TESTING = True

    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        return app
    def setUp(self):
        pass
    def tearDown(self):
        db.session.remove()

class AddUser(TestSetup): 
    '''
    id = db.Column(db.Integer, primary_key=True)

    # User authentication information
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    reset_password_token = db.Column(db.String(100), nullable=False, server_default='')

    # User email information
    email = db.Column(db.String(255), nullable=False, unique=True)
    confirmed_at = db.Column(db.DateTime())

    # User information
    active = db.Column('is_active', db.Boolean(), nullable=False, server_default='0')
    first_name = db.Column(db.String(100), nullable=False, server_default='')
    last_name = db.Column(db.String(100), nullable=False, server_default='')
    # user_types are: teacher, student, general
    # user_type = db.Column(db.String(100), nullable=False,server_default='general')
    '''

    def test_adding_user(self):
        newTeacher = Teacher(username="cooldude", password="mypassword", email="myemail@gmail.com")

        db.session.add(newTeacher)
        db.session.commit()

        assert newTeacher in db.session

        db.session.delete(newTeacher)
        db.session.commit()

        assert newTeacher not in db.session

class AddEpisodes(TestSetup):
    def test_add_episode(self):
        newEpisode = Episode('introJohn')
        db.session.add(newEpisode)
        db.session.commit()
        badEpisode = Episode('introAlex')
        tooLongEpisode = Episode('this episode length is way too long and should not be added to the database')
        assert newEpisode in db.session
        assert badEpisode not in db.session
        assert tooLongEpisode not in db.session

        db.session.delete(newEpisode)
        db.session.commit()

        assert newEpisode not in db.session

    def test_episode_teacher_Relationship(self):
        newTeacher = Teacher(username="teacher1", password="mypassword", email="teacheremail@gmail.com")
        newEpisode = Episode('testEpisode')
        newEpisode2 = Episode('testEpisode2')

        db.session.add(newTeacher)
        db.session.add(newEpisode)
        db.session.add(newEpisode2)
        db.session.commit()

        assert newTeacher in db.session
        assert newEpisode in db.session
        assert newEpisode2 in db.session

        newEpisode.teachers.append(newTeacher)
        newEpisode2.teachers.append(newTeacher)
        db.session.commit()

        testTeacher = Teacher.query.filter_by(username="teacher1").first()
        self.assertEqual(testTeacher.username, "teacher1")

        episodesLength = 0;
        for episode in newTeacher.episodes:
            episodesLength += 1
        self.assertEqual(episodesLength, 2)

        teacherLength = 0;
        for teacher in newEpisode.teachers:
            teacherLength += 1
        self.assertEqual(teacherLength, 1)

        db.session.delete(newTeacher)
        db.session.delete(newEpisode)
        db.session.delete(newEpisode2)

        db.session.commit()

        assert newTeacher not in db.session

if __name__ == '__main__':
    unittest.main()