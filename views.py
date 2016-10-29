from flask import Flask, request, redirect, render_template, render_template_string, url_for, jsonify, session
from flask_user import login_required, UserManager, SQLAlchemyAdapter

import boto3, json, simplejson, urlparse, datetime

from glob import glob
from loadJson import getAllEpisodeData

#For Heroku Logging
import sys, os, uuid

from web import app
from models import *

db_adapter = SQLAlchemyAdapter(db, TeacherUser)        # Register the User model
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
def index(name="Index", activityName="index", teacher="jinlaoshi"):
	# If no user ID generate a random one
	try: 
		userID = session['userID']
	except:
		userID = uuid.uuid4()
	return render_template('index3.html', name=name, activityName=activityName, teacher=teacher, userID=userID)

@app.route('/test')
def index2(name="Index"):
	return render_template('index2.html')

@app.route('/index3')
def index3(name="Index"):
	return render_template('index3.html')

#--------------------------------------------
# E-mail this link and redirect to homepage to track with text
# -------------------------------------------
@app.route('/home')
def home(name="Home"):
	session['userID'] = trackVisitorEvent('Visited Main Page')
	print session['userID']
	return redirect(url_for('index'))

@app.route('/<teacher>/home/')
def teacherHome(teacher):
	studentID = request.args.get('studentID')
	if studentID == None:
		return redirect(url_for("login", teacher=teacher))
	else: 
		episode = getAllEpisodeData(teacher)
		print episode
		return render_template('mainMenu.html', teacher=teacher, studentID=studentID)

@app.route('/public/home/')
def publicHome():

	# Check for any new episodes and update JSON to reflect any new files in the public folder
	episodeData = json.dumps(getAllEpisodeData("public"), ensure_ascii=False).encode('utf8')
	print episodeData;
	#print json.dumps(episodeData)
	trackVisitorEvent("Visited See More Episodes")
	studentID = request.args.get('studentID')
	teacher = "public"
	return render_template('mainMenu.html', teacher=teacher, studentID=studentID, episodeData=episodeData)


@app.route('/<teacher>/login', methods=['GET', 'POST'])
def login(teacher):
	if request.method == 'POST':
		studentID = request.form.get("studentID")
		return redirect(url_for('teacherHome', studentID=studentID, teacher=teacher))
	else: 
		return render_template("login.html")

@app.route('/<teacher>/dashboard')
def teacherDashboard(teacher):
	return render_template("dashboard.html", teacher=teacher)

@app.route('/<teacher>/<activityName>')
def teacherScene(teacher, activityName):
	if (os.path.isdir('./static/data/' + teacher) & os.path.isfile('./static/data/' + teacher + '/' + activityName + '.json')):
		try:
			studentID = request.args['studentID']
		except: 
			studentID = ""
		textToTrack = "Visited " + activityName + " "
		trackVisitorEvent("Visited " + activityName + " Page")

		return render_template("questionAsker.html", activityName=activityName, teacher=teacher, studentID=studentID)
	else:
		return redirect(url_for('teacherHome', teacher=teacher))


# The Home page is accessible to anyone
@app.route('/signup')
def home_page():
    return render_template_string("""
        {% extends "base.html" %}
        {% block content %}
            <h2>Home page</h2>
            <p>This page can be accessed by anyone.</p><br/>
            <p><a href={{ url_for('home_page') }}>Home page</a> (anyone)</p>
            <p><a href={{ url_for('members_page') }}>Members page</a> (login required)</p>
        {% endblock %}
        """)

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



#------------------------------------------------
# Links from old emails that redirect to their new version
#------------------------------------------------

@app.route('/demo/')
def demo(name="Chinese"):
	return redirect(url_for('teacherScene', teacher="public", activityName="publicDemo"))

@app.route('/demoChinese/')
def demoChinese(name="Chinese"):
	return redirect(url_for('teacherScene', teacher="public", activityName="publicDemo"))

@app.route('/demoChinese2')
def demoChinese2(name="Chinese2"):
	return redirect(url_for('teacherScene', teacher="jinlaoshi", activityName="demo2"))

@app.route('/demoChinese3')
def demoChinese3(name="Chinese3"):
	return redirect(url_for('teacherScene', teacher="jinlaoshi", activityName="demo3"))

@app.route('/demoVocab1')
def demoVocab1(name="Vocab1"):
	return render_template("demoVocab1.html", name=name)

@app.route('/demoVocab2')
def demoVocab2(name="Vocab2"):
	return render_template("demoVocab2.html", name=name)

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

if __name__ == '__main__':
	app.run(debug=True)