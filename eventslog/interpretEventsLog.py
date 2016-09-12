import sys, csv, json

eventsLogData = ''
with open (sys.argv[1], 'r') as my_file:
	eventsLogData = str(my_file.read())
	eventsLogData = eventsLogData.encode('utf-8')
	eventsLogData = eventsLogData.encode('ascii').decode('unicode-escape')

	# Manually unicode and remove it to make it json readable
	eventsLogData = eventsLogData.replace("u'{", "{")
	eventsLogData = eventsLogData.replace("}'", "}")
	print (eventsLogData)
	#jsonFile = json.loads(eventsLogData)
	#print(eventsLogData)
	'''
	f = csv.writer(open("test.csv", "wb+"))

f.writerow(["userID", "emailID", "dialogID", "nodeID", "timeStamp", "eventType", "response"])

for x in jsonFile:
    f.writerow([x["userID"], x["emailID"], x["dialogID"], x["nodeID"], x["eventType"], x["response"]])
'''
#print json.loads(eventsLogData)

# Convert data to string 
# Convert to unicode 
# print unicode
