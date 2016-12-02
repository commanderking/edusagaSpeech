from flask import Flask
from flask_testing import TestCase
import unittest
from main import app, db
from models import *
from flask.ext.login import current_user

from flask.ext.fixtures import FixturesMixin

class TestSetup(TestCase, FixturesMixin):
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

    def test_adding_user(self):
        newTeacher = Teacher(username="cooldude", password="mypassword", email="myemail@gmail.com")

        db.session.add(newTeacher)
        db.session.commit()

        assert newTeacher in db.session

        db.session.delete(newTeacher)
        db.session.commit()

        assert newTeacher not in db.session

class AddRoles(TestSetup):
    def test_adding_role(self):
        newRole = Role(name="teacher")
        db.session.add(newRole)
        db.session.commit()

        assert newRole in db.session

        newTeacher = Teacher(username="cooldude2", password="mypassword", email="myemail2@gmail.com")
        db.session.add(newTeacher)
        db.session.commit()


        newTeacher.roles.append(newRole)
        testTeacher = Teacher.query.filter(Teacher.roles.any(name="teacher")).first()
        self.assertEqual(testTeacher.username, "cooldude2")

        db.session.delete(newRole)
        db.session.delete(newTeacher)
        db.session.commit()

        assert newRole not in db.session

        newRole2 = Role(name="student")
        newTeacher = Teacher(username="coolstudent", password="studentpassword", email="coolstudent@gmail.com")
        newTeacher.roles.append(newRole2)
        #self.assertEqual(newTeacher.roles.name, "student")

        testTeacher = Teacher.query.filter_by(username="coolstudent").first()
        self.assertEqual(testTeacher.roles.name, "coolstudent") 

'''
class AddTeacherWithRole(TestSetup):
    def test_adding_role_with_form(self):
        newRole = Role(name="student")
        db.session.add(newRole)
        db.session.commit()


        newTeacher = Teacher(username="teacherWithRole", password="mypassword", email="teacherWithRole@gmail.com", roles="teacher")
        self.assertEqual(newTeacher.roles.name, "teacherWithRole")

        db.session.delete(newRole)
        db.session.delete(newTeacher)
        db.session.commit()
'''

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
        newTeacher2 = Teacher(username="teacher2", password="mypassword", email="teacher2email@gmail.com")
        newEpisode = Episode('testEpisode')
        newEpisode2 = Episode('testEpisode2')


        db.session.add(newTeacher)
        db.session.add(newTeacher2)
        db.session.add(newEpisode)
        db.session.add(newEpisode2)

        assert newTeacher in db.session
        assert newTeacher2 in db.session
        assert newEpisode in db.session
        assert newEpisode2 in db.session

        newEpisode.teachers.append(newTeacher)
        newEpisode.teachers.append(newTeacher2)
        newEpisode2.teachers.append(newTeacher)

        print "episode2 teachers"
        print newEpisode2.teachers

        testTeacher = Teacher.query.filter_by(username="teacher1").first()
        self.assertEqual(testTeacher.username, "teacher1")

        episodesLength = 0;
        for episode in newTeacher.episodes:
            episodesLength += 1
        self.assertEqual(episodesLength, 2)

        teacherLength = 0;
        for teacher in newEpisode.teachers:
            teacherLength += 1
        self.assertEqual(teacherLength, 2)


        ### Test removing specific episode and link from teacher
        for episode in newTeacher.episodes:
            print episode.episodeJSONFileName
            print episode.id

        episodesSharedAmongTeachers = Episode.query.filter_by(episodeJSONFileName='testEpisode').all()
        print "Episodes Shared" + str(episodesSharedAmongTeachers)

        self.assertEqual(len(newTeacher2.episodes), 1)

        newTeacher2.episodes.remove(newEpisode)

        self.assertEqual(len(newTeacher2.episodes), 0)
        print newTeacher2.episodes

        #testTeacher.episodes.remove(newEpisode)


        db.session.delete(newTeacher)
        db.session.delete(newTeacher2)
        db.session.delete(newEpisode)
        db.session.delete(newEpisode2)


if __name__ == '__main__':
    unittest.main()