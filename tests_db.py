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
        db.create_all()
    def tearDown(self):
        db.session.remove()
        db.drop_all()

class AddUser(TestSetup): 

    def test_adding_user(self):
        newTeacher = User(username="cooldude", password="mypassword", email="cooldudeemail@gmail.com")

        db.session.add(newTeacher)
        db.session.commit()

        assert newTeacher in db.session

        db.session.delete(newTeacher)
        db.session.commit()

        assert newTeacher not in db.session

class AddStudentsToTeachers(TestSetup):
    def test_student_having_teacher(self):
        t1 = User(username="coolteacher", password="mypassword", email="coolteacher@gmail.com")
        s1 = User(username="coolstudent", password="mypassword", email="coolstudent@gmail.com")
        db.session.add(t1)
        db.session.add(s1)
        db.session.commit()

        assert s1.removeTeacher(t1) is None

        st = s1.addTeacher(t1)
        db.session.commit()
        assert not t1.has_teacher(s1)
        assert s1.has_teacher(t1)
        assert t1.students.count() == 1
        assert t1.students.first().username == "coolstudent"
        assert s1.teachers.count() == 1
        assert s1.teachers.first().username == "coolteacher"
        s1.removeTeacher(t1)
        assert not s1.has_teacher(t1)
        assert s1.teachers.count() == 0
        assert t1.students.count() == 0

class AddRoles(TestSetup):
    def test_adding_role(self):
        newRole = Role(name="teacher")
        db.session.add(newRole)
        db.session.commit()

        assert newRole in db.session

        newTeacher = User(username="coolteacher", password="mypassword", email="myemail2@gmail.com")
        db.session.add(newTeacher)
        db.session.commit()


        newTeacher.roles.append(newRole)
        testTeacher = User.query.filter(User.roles.any(name="teacher")).first()
        self.assertEqual(testTeacher.username, "coolteacher")

        db.session.delete(newRole)
        db.session.delete(newTeacher)
        db.session.commit()

        assert newRole not in db.session

        # Check adding the student role
        newRole2 = Role(name="student")
        db.session.add(newRole2)
        newTeacher = User(username="coolstudent", password="studentpassword", email="coolstudent@gmail.com")
        newTeacher.roles.append(newRole2)
        db.session.add(newTeacher)
        db.session.commit()

        for role in newTeacher.roles:
            self.assertEqual(role.name, "student")

        testTeacher = User.query.filter_by(username="coolstudent").first()
        self.assertEqual(testTeacher.roles[0].name, "student")

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
        newTeacher = User(username="teacher1", password="mypassword", email="teacheremail@gmail.com")
        newTeacher2 = User(username="teacher2", password="mypassword", email="teacher2email@gmail.com")
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

        newEpisode.users.append(newTeacher)
        newEpisode.users.append(newTeacher2)
        newEpisode2.users.append(newTeacher)

        testTeacher = User.query.filter_by(username="teacher1").first()
        self.assertEqual(testTeacher.username, "teacher1")

        episodesLength = 0;
        for episode in newTeacher.episodes:
            episodesLength += 1
        self.assertEqual(episodesLength, 2)

        teacherLength = 0;
        for teacher in newEpisode.users:
            teacherLength += 1
        self.assertEqual(teacherLength, 2)

        episodesSharedAmongTeachers = Episode.query.filter_by(episodeJSONFileName='testEpisode').all()

        self.assertEqual(len(newTeacher2.episodes), 1)
        newTeacher2.episodes.remove(newEpisode)
        self.assertEqual(len(newTeacher2.episodes), 0)

if __name__ == '__main__':
    unittest.main()