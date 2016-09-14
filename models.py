from web import db
from sqlalchemy.dialects.postgresql import JSON
from flask_user import UserMixin

class Teacher(db.Model):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(30), nullable = False)
    lastName = db.Column(db.String(30), nullable = False)
    email = db.Column(db.String(50), nullable = False)

    def __init__(self, firstName, lastName, email):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email

    def __repr__(self):
        return '<id {}>'.format(self.id)

class TeacherUser(db.Model, UserMixin):
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

class TestModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(30), nullable = False)
    lastName = db.Column(db.String(30), nullable = False)
    email = db.Column(db.String(50), nullable = False) 