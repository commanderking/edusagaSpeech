import json, os
from glob import glob


def getAllEpisodeData(teacherName):
	sceneMenuDataStructure = {}
	sceneMenuData = []
	json_dir_name = "static/data/" + teacherName

	# Pull all episodes that a teacher has from the database
	# iterate through them, for each one look in the public folder and find the scenes
	# return the data that was built

	json_pattern = os.path.join(json_dir_name, '*.json')
	file_list = glob(json_pattern)
	for file in file_list:
		#allPublicJSONs.append(json)

		# Add episode's data to the sceneMenuData
		sceneMenuData.append(buildEpisodeData(file, teacherName))

	#sceneMenuData = json.dumps(sceneMenuData, ensure_ascii=False).encode('utf8')
	# print sceneMenuData
	sceneMenuDataStructure["scenes"] = sceneMenuData

	sceneMenuDataStructure = json.dumps(sceneMenuDataStructure, ensure_ascii=False).encode('utf8')

	newFile = open("static/data/teacherScenes/" + teacherName +  ".json", "w")
	newFile.write("%s\n" % sceneMenuDataStructure)
	newFile.close()
	print sceneMenuDataStructure
	return sceneMenuData

def buildEpisodeData(jsonPath, teacherName): 
	with open(jsonPath) as episodeJSON:
		episodeContent = {}
		d = json.load(episodeJSON)

		# Add activity name
		episodeContent['id'] = jsonPath.replace('static/data/public/', '').replace('.json', '')
		episodeContent['name'] = d['activityName']
		episodeContent['scenario'] = d['scenario'][0]['text']
		episodeContent['link'] = jsonPath.replace('static/data/' + teacherName, '..').replace('.json', '')
		episodeContent['tags'] = d['tags']
		episodeContent['objectives'] = d['objectives']
		episodeContent['characterImage'] = d['currentImage']

		try: 
			episodeContent['sequence'] = d['sequence']
		except:
			episodeContent['sequence'] = 0

		#print(episodeContent)
		return episodeContent

getAllEpisodeData("public")