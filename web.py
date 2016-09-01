from flask import Flask, request, redirect, render_template, url_for, jsonify
from flask_sslify import SSLify

import boto3
import json
import urlparse

#For Heroku Logging
import sys
import logging

app = Flask (__name__)
sslify = SSLify(app)
#app.config.from_envvar('GOOGLE_APPLICATION_CREDENTIALS')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

@app.route('/')
def index(name="Index", activityName="index", teacher="jinlaoshi"):
	return render_template('index.html', name=name, activityName=activityName, teacher=teacher)

@app.route('/lilaoshi/login', methods=['GET', 'POST'])
def lilaoshilogin():
	if request.method == 'POST':
		studentID = request.form.get("studentID")
		return redirect(url_for('lilaoshiPreassess', studentID=studentID))
	else:
		return render_template('login.html')

@app.route('/lilaoshi/home/')
def lilaoshihome():
	return render_template('mainMenu.html', teacher="lilaoshi")


@app.route('/demoChinese/')
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
	#return render_template('demo.html', name=name)
	return redirect(url_for('demo'))

@app.route('/demoChinese2')
def demoChinese2(name="Chinese2"):
	return redirect(url_for('demo'))

@app.route('/demoChinese3')
def demoChinese3(name="Chinese3"):
	return redirect(url_for('demo'))

@app.route('/demoVocab1')
def demoVocab1(name="Vocab1"):
	return render_template("demoVocab1.html", name=name)

@app.route('/demoVocab2')
def demoVocab2(name="Vocab2"):
	return render_template("demoVocab2.html", name=name)

@app.route('/jinlaoshi/demo')
def demo(activityName="demo", teacher="jinlaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)

@app.route('/jinlaoshi/demo2')
def demo2(activityName="demo2", teacher="jinlaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)

@app.route('/jinlaoshi/demo3')
def demo3(activityName="demo3", teacher="jinlaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)

@app.route('/lilaoshi/pa1')
def lilaoshiPreassess(activityName="pa1", teacher="lilaoshi"):
	#current_url = request.url
	#parsed = urlparse.urlparse(current_url)
	try:
		studentID = request.args['studentID']
		#studentID = str(urlparse.parse_qs(parsed.query)['studentID'][0])
	except: 
		studentID = ""
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher, studentID=studentID)

@app.route('/yulaoshi/demo')
def yulaoshiDemo(activityName="introDavid", teacher="yulaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)

@app.route('/lewlaoshi/demo')
def lewlaoshiDemo(activityName="davidTorontoVisit", teacher="lewlaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)



#-----------------------------------------------
#POST requests 
#-----------------------------------------------


@app.route('/log', methods=['Post'])
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