from wtforms import Form, BooleanField, StringField, validators

class SignupForm(Form):
    firstName     = StringField('First Name', [validators.Length(min=1, max=30)])
    lastName      = StringField('First Name', [validators.Length(min=1, max=30)])
    email         = StringField('Email Address', [validators.Length(min=4, max=35), validators.Email()])