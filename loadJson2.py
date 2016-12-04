import json, os
from models import *
from glob import glob


def getTeacherEpisodes(username):
	sceneMenuDataStructure = {}
	sceneMenuData = []
	episodesArray = []
	json_dir_name = "static/data/public/"

	# Grab teacher
	teacher = Teacher.query.filter_by(username=username).first()

	print teacher.username
	for episode in teacher.episodes:
		episodeName = Episode.query.filter_by(id=episode.id).first().episodeJSONFileName
		episodeName = str(json_dir_name + episodeName + ".json")
		episodesArray.append(episodeName)
	print episodesArray

	for fileName in episodesArray:
		sceneMenuData.append(buildEpisodeData(fileName, username))

	sceneMenuDataStructure["scenes"] = json.dumps(sceneMenuData, ensure_ascii=False).encode('utf8')

	print sceneMenuDataStructure
	return sceneMenuDataStructure

def buildEpisodeData(jsonPath, teacherName): 
	with open(jsonPath) as episodeJSON:
		episodeContent = {}
		d = json.load(episodeJSON)

		episodeContent['id'] = jsonPath.replace('static/data/public/', '').replace('.json', '')
		episodeContent['name'] = d['activityName']
		episodeContent['scenario'] = d['scenario'][0]['text']
		episodeContent['link'] = jsonPath.replace('static/data/public', '/teacher/public/episode').replace('.json', '')
		episodeContent['tags'] = d['tags']
		episodeContent['objectives'] = d['objectives']
		episodeContent['characterImage'] = d['currentImage']

		try:
			episodeContent['sequence'] = d['sequence']
		except:
			episodeContent['sequence'] = 0

		#print(episodeContent)
		return episodeContent
