import json, os
from models import *
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
		sceneMenuData.append(buildEpisodeData(file, teacherName))

	sceneMenuDataStructure["scenes"] = sceneMenuData

	sceneMenuDataStructure = json.dumps(sceneMenuDataStructure, ensure_ascii=False).encode('utf8')

	newFile = open("static/data/teacherScenes/" + teacherName + ".json", "w")
	newFile.write("%s\n" % sceneMenuDataStructure)
	newFile.close()
	return sceneMenuData

def getTeacherEpisodes(username):
	sceneMenuDataStructure = {}
	sceneMenuData = []
	episodesArray = []
	json_dir_name = "static/data/public/"

	# Grab teacher
	teacher = Teacher.query.filter_by(username=username).first()

	for episode in teacher.episodes:
		episodeName = Episode.query.filter_by(id=episode.id).first().episodeJSONFileName
		episodeName = str(json_dir_name + episodeName + ".json")
		episodesArray.append(episodeName)

	for fileName in episodesArray:
		sceneMenuData.append(buildEpisodeData(fileName, username))

	sceneMenuDataStructure["scenes"] = json.dumps(sceneMenuData, ensure_ascii=False).encode('utf8')
	return sceneMenuDataStructure

def buildEpisodeData(jsonPath, teacherName): 
	with open(jsonPath) as episodeJSON:
		episodeContent = {}
		d = json.load(episodeJSON)

		episodeContent['id'] = jsonPath.replace('static/data/public/', '').replace('.json', '')
		episodeContent['name'] = d['activityName']
		episodeContent['scenario'] = d['scenario'][0]['text']
		episodeContent['link'] = jsonPath.replace('static/data/public', '/teacher/' + teacherName + '/episode').replace('.json', '')
		episodeContent['tags'] = d['tags']
		episodeContent['objectives'] = d['objectives']
		episodeContent['characterImage'] = d['currentImage']
		episodeContent['characterName'] = d['character']['name']

		# Sequencing is optional for each episode and determines the order episodes appear
		# under each category
		try:
			episodeContent['sequence'] = d['sequence']
		except:
			episodeContent['sequence'] = 0

		return episodeContent

getAllPublicEpisodeData("public")
