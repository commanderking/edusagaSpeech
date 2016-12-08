from web import app, db
from models import *
from views import *
from startup import create_users

if __name__ == '__main__':
	print "running main"
	db.create_all()
	print "db should be created"
	teacher = create_users.find_or_create_user('yaoguais2', 'Mypassword1', 'sampleteacher@gmail.com')
	print "user created"
	print teacher.username
	db.session.add(teacher)
	db.session.commit()

	app.run(debug=True)