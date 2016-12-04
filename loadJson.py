import json, os
from glob import glob

# To get All Public Episode Data, look through the "public JSON list"
# Get all the needed information

def getAllPublicEpisodeData(teacherName):
	sceneMenuDataStructure = {}
	sceneMenuData = []
	json_dir_name = "static/data/" + teacherName

	json_pattern = os.path.join(json_dir_name, '*.json')
	file_list = glob(json_pattern)
	for file in file_list:
		# Add episode's data to the sceneMenuData
		sceneMenuData.append(buildPublicEpisodeData(file, teacherName))

	sceneMenuDataStructure["scenes"] = sceneMenuData

	sceneMenuDataStructure = json.dumps(sceneMenuDataStructure, ensure_ascii=False).encode('utf8')

	newFile = open("static/data/teacherScenes/" + teacherName +  ".json", "w")
	newFile.write("%s\n" % sceneMenuDataStructure)
	newFile.close()
	print sceneMenuDataStructure
	return sceneMenuData

def buildPublicEpisodeData(jsonPath, teacherName): 
	with open(jsonPath) as episodeJSON:
		episodeContent = {}
		d = json.load(episodeJSON)

		# Add activity name
		episodeContent['id'] = jsonPath.replace('static/data/public/', '').replace('.json', '')
		episodeContent['name'] = d['activityName']
		episodeContent['scenario'] = d['scenario'][0]['text']
		episodeContent['link'] = jsonPath.replace('static/data/' + teacherName, '/teacher/public/episode').replace('.json', '')
		episodeContent['tags'] = d['tags']
		episodeContent['objectives'] = d['objectives']
		episodeContent['characterImage'] = d['currentImage']

		try: 
			episodeContent['sequence'] = d['sequence']
		except:
			episodeContent['sequence'] = 0

		#print(episodeContent)
		return episodeContent

getAllPublicEpisodeData("public")