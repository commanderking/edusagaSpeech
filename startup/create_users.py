from datetime import datetime
from web import app, db
from models import *
from views import user_manager

def find_or_create_user(username, password, email, role=None):
	user = User.query.filter(User.email == email).first()
	if not user:
		user = User(username=username,
					password=user_manager.hash_password(password),
					email=email)
		if role:
			user.roles.append(role)
		db.session.add(user)
	return user
