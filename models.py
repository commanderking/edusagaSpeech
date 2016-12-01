from web import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from flask_user import UserMixin


episodes = db.Table('episodes',
    db.Column('episode_id', db.Integer, db.ForeignKey('episode.id')),
    db.Column('teacher_id', db.Integer, db.ForeignKey('teacher.id')),
    db.Column('episode_assigned', db.Boolean(), nullable=False, default=False),
    UniqueConstraint('episode_id', 'teacher_id', name='episode_teacher_id')
)
class Teacher(db.Model, UserMixin):
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

    roles = db.relationship('Role', secondary='user_roles',
        backref=db.backref('teachers', lazy='dynamic'))
    episodes = db.relationship('Episode', secondary=episodes,
        backref=db.backref('teachers', lazy='dynamic'))

class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    teacher_id = db.Column(db.Integer(), db.ForeignKey('teacher.id', ondelete='CASCADE'))
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