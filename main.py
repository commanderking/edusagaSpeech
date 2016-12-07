from web import app, db
from models import *
from views import *
from startup import create_users

if __name__ == '__main__':
	db.create_all()
	teacher = create_users.find_or_create_user('yaoguais2', 'Mypassword1', 'sampleteacher@gmail.com')
	
	db.session.add(teacher)
	db.session.commit()

	app.run(debug=True)