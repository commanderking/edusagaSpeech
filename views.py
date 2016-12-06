from flask import Flask, request, redirect, render_template, render_template_string, url_for, jsonify, session
from flask_user import login_required, UserManager, SQLAlchemyAdapter
from flask_login import current_user
from sqlalchemy import exc

import boto3, json, simplejson, urlparse, datetime
from helper_episodes import getAllPublicEpisodeData, getTeacherEpisodes

#For Heroku Logging
import sys, os, uuid

from web import app
from models import *

db_adapter = SQLAlchemyAdapter(db, Teacher)        # Register the User model
user_manager = UserManager(db_adapter, app)     # Initialize Flask-User

def trackVisitorWithText(textMessage): 
	current_url = request.url
	parsed = urlparse.urlparse(current_url)

	# If it's a tracked address, send notification via SMS
	try:
		print "tracking user"
		userID = textMessage + str(urlparse.parse_qs(parsed.query)['p'][0])
		# Ensure it's a set 
		print len(userID)
		if len(userID) < 10:
			client = boto3.client('sns', region_name ='us-east-1')
			response = client.publish( 
				TopicArn='arn:aws:sns:us-east-1:513786056711:svc-edusaga-events-logging',
				Message= userID,
				MessageStructure='string'
			)
			print response
			print userID
			return userID
	except:
		print "user not tracked"
		pass

def trackVisitorEvent(eventText):
	try:
		current_url = request.url
		parsed = urlparse.urlparse(current_url)
		userID = str(urlparse.parse_qs(parsed.query)['p'][0])

		# Create JSON to send
		content = {}
		content['userID'] = userID
		content['eventType'] = eventText
		content['time'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')

		# Turn it to JSON string
		content = json.dumps(content)
		print content
		sqs = boto3.resource('sqs', region_name = 'us-east-1')
		queue = sqs.get_queue_by_name(QueueName='svc-edusaga-visitor-events')
		response = queue.send_message(MessageBody=content)
		return userID
	except: 
		pass

@app.route('/')
def index(name="Index"):
	# If no user ID generate a random one
	try: 
		userID = session['userID']
	except:
		userID = uuid.uuid4()
	if current_user.is_authenticated:
		return redirect(url_for("teacherHome", teacher=current_user.username))
	else: 
		return render_template('index3.html', name=name, userID=userID)

#--------------------------------------------
# E-mail this link and redirect to homepage to track with text
# -------------------------------------------
@app.route('/home')
def home(name="Home"):
	session['userID'] = trackVisitorEvent('Visited Main Page')
	print session['userID']
	return redirect(url_for('index'))

@app.route('/teacher/<username>')
@login_required
def teacherPage(username):
	# Make sure only the teacher with this username can see the page
	if current_user.username != username:
		return redirect(url_for('index'))
	else:
		user = Teacher.query.filter_by(username=username).first()

		episodeArray = getTeacherEpisodes(username)
		print episodeArray
		return render_template('teacherHome.html', public="public", username=username, episodeArray=episodeArray)

@app.route('/teacher/<teacher>/home/')
def teacherHome(teacher):
	studentID = request.args.get('studentID')
	if teacher == "public": 
		studentID = request.args.get('studentID')
		return render_template('mainMenu.html', teacher=teacher, studentID=studentID)
	elif teacher == current_user.username:
		print "rendering teacher_home"
		return render_template('teacherHome.html', teacher=teacher, studentID=studentID)
	else:
		return redirect(url_for('teacherHome', teacher=current_user.username))

@app.route('/public/home/')
def publicHome2():
	return redirect(url_for('teacherHome', teacher="public"))

@app.route('/<teacher>/student')
def studentHome(teacher):
	print teacher
	# Pull episodes from database for teacher
	# Add authentication for student and that student belongs to teacher page
	teacherEpisodeData = getTeacherEpisodes(teacher)
	teacherEpisodeData = json.dumps(getTeacherEpisodes(teacher), ensure_ascii=False)
	print teacherEpisodeData
	return render_template('mainMenu.html', teacher=teacher, episodeData=teacherEpisodeData)

@app.route('/teacher/<teacher>/login', methods=['GET', 'POST'])
def login(teacher):
	if request.method == 'POST':
		studentID = request.form.get("studentID")
		return redirect(url_for('teacherHome', studentID=studentID, teacher=teacher))
	else: 
		return render_template("login.html")

@app.route('/teacher/<teacher>/dashboard')
def teacherDashboard(teacher):
	return render_template("dashboard.html", teacher=teacher)

@app.route('/teacher/<teacher>/episode/<episodeName>')
def teacherScene(teacher, episodeName):
	try:
		studentID = request.args['studentID']
	except: 
		studentID = ""
	textToTrack = "Visited " + episodeName + " "
	trackVisitorEvent("Visited " + episodeName + " Page")

	return render_template("questionAsker.html", episodeName=episodeName, teacher=teacher, studentID=studentID)

@app.route('/signup')
def signup():
    return redirect(url_for('user.register'))

@app.route('/login')
def userLogin():
	return redirect(url_for('user.login'))

# The Members page is only accessible to authenticated users
@app.route('/members')
@login_required                                 # Use of @login_required decorator
def members_page():
    return render_template_string("""
        {% extends "base.html" %}
        {% block content %}
            <h2>Members page</h2>
            <p>This page can only be accessed by authenticated users.</p><br/>
            <p><a href={{ url_for('home_page') }}>Home page</a> (anyone)</p>
            <p><a href={{ url_for('members_page') }}>Members page</a> (login required)</p>
        {% endblock %}
        """)


@app.route('/video/')
def videoRedirect(name="Video Redirect"):
	trackVisitorWithText("Watched video ")
	return redirect('https://youtu.be/nQeKi-2JOnA')


#-----------------------------------------------
#POST requests 
#-----------------------------------------------

#-----------------------------------------------
#Business/Engagement Logic
@app.route('/logVisitorEvents', methods=['POST'])
def logVisitorEvents(): 
	content = request.get_data()
	sqs = boto3.resource('sqs', region_name = 'us-east-1')
	queue = sqs.get_queue_by_name(QueueName='svc-edusaga-visitor-events')
	response = queue.send_message(MessageBody=content)

	print(response.get('MessageId'))
	print(response.get('MD5OfMessageBody'))
	return 'Success'

#-----------------------------------------------
#Game related posts/data

@app.route('/log', methods=['POST'])
def log():
	content = request.get_data()
	#content = request.data

	sqs = boto3.resource('sqs', region_name = 'us-east-1')
	queue = sqs.get_queue_by_name(QueueName='svc-edusaga-events-queue')
	response = queue.send_message(MessageBody=content)

	print(response.get('MessageId'))
	print(response.get('MD5OfMessageBody'))
	return 'Success'

@app.route('/logStudent', methods=['POST'])
def logStudentProgress():
	content = request.get_data()

	sqs = boto3.resource('sqs', region_name = 'us-west-2')
	queue = sqs.get_queue_by_name(QueueName='svc-edusaga-student-progress')
	response = queue.send_message(MessageBody=content)
	return 'Success'

@app.route('/logSpeechResponse', methods=['POST'])
def logSpeechResponse():
	content = request.get_data()

	sqs = boto3.resource('sqs', region_name = 'us-west-2')
	queue = sqs.get_queue_by_name(QueueName='svc-edusaga-speech-response')
	response = queue.send_message(MessageBody=content)
	return 'Success'


@app.route('/teacher/<username>/episode/addEpisode', methods=['POST'])
def postAddEpisode(username):
	if (username == current_user.username):
		# Gets the string name of file from ajax in MainMeunContainer.js
		episodeName = request.get_data()

		#TODO: For now, if the episode has not been added to databaes for whatever reason, add it in during this time
		# In most cases, the episode should already be in the database
		if Episode.query.filter_by(episodeJSONFileName=episodeName).first():
			print "Episode already in database"
			newEpisode=Episode.query.filter_by(episodeJSONFileName=episodeName).first()
		else: 
			newEpisode = Episode(episodeName)
			db.session.add(newEpisode)
			db.session.commit()

		teacher = Teacher.query.filter_by(username=current_user.username).first()
		newEpisode.teachers.append(teacher)
		db.session.commit()

		newEpisodeArray = getTeacherEpisodes(current_user.username)		
		return json.dumps({'success': True, 'episodeArray': newEpisodeArray}, 200, {'ContentType': 'application/json'})

@app.route('/teacher/<username>/episode/removeEpisode', methods=['POST'])
def deleteEpisode(username):
	if (username == current_user.username):
		episodeName = request.get_data()

		teacher = Teacher.query.filter_by(username=current_user.username).first()
		print teacher
		episodeToDelete = Episode.query.filter_by(episodeJSONFileName=episodeName).first()
		print episodeToDelete

        teacher.episodes.remove(episodeToDelete)
        db.session.commit()

        newEpisodeArray = getTeacherEpisodes(current_user.username)

        return json.dumps({'success': True, 'episodeArray' : newEpisodeArray}, 200, {'ContentType': 'application.json'})

@app.route('/teacher/<username>/episode/getEpisodes', methods=['POST'])
def getEpisodes(username):
	# TODO - Only the teacher and students should be able to access this page in future
	# Currently publicly accessible to anyone visiting this page
	try:
		teacherEpisodeData = getTeacherEpisodes(username)
		return json.dumps({'success': True, 'teacherEpisodeData' : teacherEpisodeData}, 200, {'ContentType': 'application.json'})
	except: 
		return json.dumps({'success': True, 'teacherEpisodeData' : []}, 200, {'ContentType': 'application.json'})

if __name__ == '__main__':
	app.run(debug=True)