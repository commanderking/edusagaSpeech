import json, os
from glob import glob

def getAllEpisodeData():
	sceneMenuDataStructure = {}
	sceneMenuData = []
	json_dir_name = "static/data/public"

	json_pattern = os.path.join(json_dir_name, '*.json')
	file_list = glob(json_pattern)
	for file in file_list:
		#allPublicJSONs.append(json)

		# Add episode's data to the sceneMenuData
		sceneMenuData.append(buildEpisodeData(file))

	#sceneMenuData = json.dumps(sceneMenuData, ensure_ascii=False).encode('utf8')
	# print sceneMenuData
	sceneMenuDataStructure["scenes"] = sceneMenuData

	sceneMenuDataStructure = json.dumps(sceneMenuDataStructure, ensure_ascii=False).encode('utf8')

	newFile = open("static/data/teacherScenes/publicEpisodes.json", "w")
	newFile.write("%s\n" % sceneMenuDataStructure)
	newFile.close()

	return sceneMenuData

def buildEpisodeData(jsonPath): 
	with open(jsonPath) as episodeJSON:
		episodeContent = {}
		d = json.load(episodeJSON)

		# Add activity name
		episodeContent['name'] = d['activityName']
		episodeContent['scenario'] = d['scenario'][0]['text']
		episodeContent['link'] = jsonPath.replace('static/data/public', '..').replace('.json', '')
		try: 
			episodeContent['tags'] = d['tags']
		except: 
			pass

		#print(episodeContent)
		return episodeContent

getAllEpisodeData()