from flask import Flask, request, jsonify, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import os

import boto3, json, urlparse

#For Heroku Logging
import sys, logging

REGION = 'us-east-1'
TOPIC  = ''

app = Flask (__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#TODO: Should be from models import Teacher, but there's a circular reference
#SEE: http://flask.pocoo.org/docs/0.10/patterns/packages/
from models import *

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

@app.route('/')
def index(name="Index"):
	return render_template('index.html', name=name)

@app.route('/demoChinese')
def demoChinese(name="Chinese"):
	current_url = request.url
	parsed = urlparse.urlparse(current_url)

	# If it's a tracked address, send notification via SMS
	try: 
		userID = str(urlparse.parse_qs(parsed.query)['p'][0])
		client = boto3.client('sns', region_name ='us-east-1')
		response = client.publish( 
			TopicArn='arn:aws:sns:us-east-1:513786056711:svc-edusaga-events-logging',
			Message= userID,
			MessageStructure='string'
		)
		print userID

	except:
		print current_url
		print parsed
	return render_template('demo.html', name=name)

@app.route('/demoSpanish')
def demoSpanish(name="Spanish"):
	return render_template('demo.html', name=name)

@app.route('/demoChinese2')
def demoChinese2(name="Chinese2"):
	return render_template("demo.html", name=name)

@app.route('/demoChinese3')
def demoChinese3(name="Chinese3"):
	current_url = request.url
	parsed = urlparse.urlparse(current_url)

	# If it's a tracked address, send notification via SMS
	try: 
		userID = str(urlparse.parse_qs(parsed.query)['p'][0])
		client = boto3.client('sns', region_name ='us-east-1')
		response = client.publish( 
			TopicArn='arn:aws:sns:us-east-1:513786056711:svc-edusaga-events-logging',
			Message= userID,
			MessageStructure='string'
		)
		print userID

	except:
		print current_url
		print parsed
	return render_template("demo.html", name=name)


@app.route('/demoVocab1')
def demoVocab1(name="Vocab1"):
	return render_template("demoVocab1.html", name=name)

@app.route('/demoVocab2')
def demoVocab2(name="Vocab2"):
	return render_template("demoVocab2.html", name=name)

# Test for React
@app.route('/reactTest')
def reactTest(name="React"):
	return render_template("reactTest.html", name=name)

# Test for React Version of Question Asker (demoChinese)
@app.route('/questionAsker')
def demo(name="ChineseReact"):
	return render_template("questionAsker.html", name=name)

@app.route('/log', methods=['Post'])
def log():
	content = request.get_data()
	#content = request.data

	sqs = boto3.resource('sqs', region_name = 'us-east-1')
	queue = sqs.get_queue_by_name(QueueName='svc-edusaga-events-queue')
	response = queue.send_message(MessageBody=content)

	print(response.get('MessageId'))
	print(response.get('MD5OfMessageBody'))

	'''
	client = boto3.client('sns')
	response = client.publish( 
		TopicArn='arn:aws:sns:us-east-1:513786056711:svc-edusaga-events-logging',
		Message= json.dumps({'default': content}),
		MessageStructure='json'
	)
	'''
	return 'Success'

@app.route('/signup', methods=['GET', 'POST'])
def signup(name="Sign Up Page"):
	errors = []
	results = {}
	test = ""
	if request.method == "POST":
		# get name and email that user has entered
		try:
			firstName = request.form['firstName']
			lastName = request.form['lastName']
			email = request.form['email']
			test = firstName + " " + lastName + " " + email
			newTeacher = Teacher(firstName, lastName, email)
			db.session.add(newTeacher)
			db.session.commit()
		except: 
			errors.append(
				"Unable to get URL."
			)
			test = "failed"
	return render_template("signup.html", name=name, errors=errors, results=results, email=test)

if __name__ == '__main__':
	app.run(debug=True)