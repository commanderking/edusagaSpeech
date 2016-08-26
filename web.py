from flask import Flask, request, jsonify
from flask import render_template

import boto3
import json
import urlparse

#For Heroku Logging
import sys
import logging

REGION = 'us-east-1'
TOPIC  = ''

app = Flask (__name__)
#app.config.from_envvar('GOOGLE_APPLICATION_CREDENTIALS')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

@app.route('/')
def index(name="Index", activityName="index", teacher="jinlaoshi"):
	return render_template('index.html', name=name, activityName=activityName, teacher=teacher)

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
def lilaoshiPreassess(activityName="pre-assessment1", teacher="lilaoshi"):
	return render_template("questionAsker.html", activityName=activityName, teacher=teacher)

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

if __name__ == '__main__':
	app.run(debug=True)