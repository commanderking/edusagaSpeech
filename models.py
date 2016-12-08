from web import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from flask_user import UserMixin


episodes = db.Table('episodes',
    db.Column('episode_id', db.Integer, db.ForeignKey('episode.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('episode_assigned', db.Boolean(), nullable=False, default=False),
    UniqueConstraint('episode_id', 'user_id', name='episode_user_id')
)

teachers = db.Table('teachers',
    db.Column('student_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('teacher_id', db.Integer, db.ForeignKey('user.id'))
)

class User(db.Model, UserMixin):
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
    finished_role_selection = db.Column('finished_role_selection', db.Boolean(), default=False)
    first_name = db.Column(db.String(100), nullable=False, server_default='')
    last_name = db.Column(db.String(100), nullable=False, server_default='')
    # user_types are: teacher, student, general
    # user_type = db.Column(db.String(100), nullable=False,server_default='general')

    roles = db.relationship('Role', secondary='user_roles',
        backref=db.backref('users', lazy='dynamic'))
    episodes = db.relationship('Episode', secondary=episodes,
        backref=db.backref('users', lazy='dynamic'))
    teachers = db.relationship('User',
                                secondary=teachers,
                                primaryjoin=(teachers.c.student_id == id),
                                secondaryjoin=(teachers.c.teacher_id == id),
                                backref=db.backref('students', lazy="dynamic"),
                                lazy="dynamic")

    def addTeacher(self, teacher):
        if not self.has_teacher(teacher):
            self.teachers.append(teacher)
            return self

    def removeTeacher(self, teacher):
        if self.has_teacher(teacher):
            self.teachers.remove(teacher)
            return self

    def has_teacher(self, teacher):
        return self.teachers.filter(teachers.c.teacher_id == teacher.id).count() > 0

class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id', ondelete='CASCADE'))

class Episode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    episodeJSONFileName = db.Column(db.String(30), nullable=False, unique=True)

    def __init__(self, episodeJSONFileName):
        self.episodeJSONFileName = episodeJSONFileName
    def __repr__(self):
        return '<id {}>'.format(self.id)


class TestModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(30), nullable = False)
    lastName = db.Column(db.String(30), nullable = False)
    email = db.Column(db.String(50), nullable = False) 