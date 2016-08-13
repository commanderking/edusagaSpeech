from web import db
from sqlalchemy.dialects.postgresql import JSON

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