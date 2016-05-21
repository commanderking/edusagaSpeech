/*
TODO: Preload background and character images
*/

var SOUND_BASE_PATH = "./static/audio/"
var IMAGE_BASE_PATH = "./static/images/"
var bgIMAGE_BASE_PATH = "./static/images/bg/"

var charTaskData = 
{
	"currentCharacter" : 0,
	"currentEmotion" : "default",
	"currentLanguage" : "zh-CN",
	"currentSoundID" : "",
	"characterProfiles" : 
	[
		{
			"name" : "David",
			"language" : "zh-CN",
			"location" : 
			{
				"name" : "Shanghai Airport",
				"bg" : bgIMAGE_BASE_PATH + "shanghaiAirport.jpg"

			},
			"emotions" : 
			{
				"default": IMAGE_BASE_PATH + "davidDefault.png",
				"uncertain" : IMAGE_BASE_PATH + "davidUncertain.png",
				"laughing" : IMAGE_BASE_PATH + "davidLaughing.png",
				"confused" : IMAGE_BASE_PATH + "davidConfused.png"
			},
			"confusedPhrases" : 
			[
				{ 
					"response": "什么?",
					"soundID" : "shenme",
					"soundPath" : SOUND_BASE_PATH + "david/shenme.ogg"
				}, 
				{ 
					"response": "我听不懂.",
					"soundID" : "tingbudong",
					"soundPath" : SOUND_BASE_PATH + "david/tingbudong.ogg"
				}, 
				{ 
					"response": "不好意思, 我没听懂.",
					"soundID" : "buhaoyisi",
					"soundPath" : SOUND_BASE_PATH + "david/buhaoyisi.ogg"
				}
			],
			"tasks" : 
			[
				{
					"task" : "Greet",
					"possibilities" : ["你好"],
					"correct" : false,
					"response" : "你好!",
					"soundID" : "nihao",
					"soundPath" : SOUND_BASE_PATH + "david/nihao.ogg",
					"emotion" : "laughing"
				},
				{
					"task" : "Ask for name",
					"possibilities" : ["你叫什么名字", "你叫什么", "你的名字是什么", "你是谁"],
					"correct" : false,
					"response" : "我叫张大伟.",
					"soundID" : "wojiao",
					"soundPath" : SOUND_BASE_PATH + "david/wojiao.ogg",
					"emotion" : "default"
				},
				{
					"task" : "Ask for nationality", 
					"possibilities" : ["你是哪国人", "你是哪里人", "你来自哪里?"],
					"correct" : false,
					"response" : "我是中国人.",
					"soundID" : "nationality",
					"soundPath" : SOUND_BASE_PATH + "david/nationality.ogg",
					"emotion" : "default"
				}, 
				{
					"task" : "Ask for age", 
					"possibilities" : ["你几岁", "你多大"],
					"correct" : false,
					"response" : "我二十六岁.",
					"soundID" : "age",
					"soundPath" : SOUND_BASE_PATH + "david/age.ogg",
					"emotion" : "default"
				},
				{
					"task" : "Ask what he likes to eat",
					"possibilities" : ["你喜欢吃什么", "你爱吃什么"],
					"correct" : "false",
					"response" : "我喜欢吃牛肉面和汤圆.",
					"soundID" : "foodLikes",
					"soundPath" : SOUND_BASE_PATH + "david/foodLikes.ogg",
					"emotion" : "laughing"
				}
			], 
			"soundArray" : 
			[
				{
					"soundID" : "buhaoyisi",
					"soundPath" : SOUND_BASE_PATH + "david/buhaoyisi.ogg"
				},
				{
					"soundID" : "shenme", 
					"soundPath" : SOUND_BASE_PATH + "david/shenme.ogg"
				},
				{
					"soundID" : "tingbudong",
					"soundPath" : SOUND_BASE_PATH + "david/tingbudong.ogg"
				}
			]
		},
		{
			"name" : "Tina",
			"language" : "zh-CN",
			"location" : 
			{
				"name" : "Fast Food Restaurant",
				"bg" : bgIMAGE_BASE_PATH + "fastfoodRestaurant.jpg"

			},
			"emotions" : 
			{
				"default": IMAGE_BASE_PATH + "tinaDefault.png",
				"ordering" : IMAGE_BASE_PATH + "./images/tinaOrdering.png",
				"confused" : IMAGE_BASE_PATH + "./images/tinaConfused.png"
			},
			"confusedPhrases" : 
			[
				{ 
					"response": "什么?",
					"soundID" : "shenme",
					"soundPath" : SOUND_BASE_PATH + "david/shenme.ogg"
				}, 
				{ 
					"response": "我听不懂.",
					"soundID" : "tingbudong",
					"soundPath" : SOUND_BASE_PATH + "david/tingbudong.ogg"
				}, 
				{ 
					"response": "不好意思, 我没听懂.",
					"soundID" : "buhaoyisi",
					"soundPath" : SOUND_BASE_PATH + "david/buhaoyisi.ogg"
				}
			],
			"tasks" : 
			[
				{
					"task" : "Greet the cashier",
					"possibilities" : ["你好"],
					"correct" : false,
					"response" : "你好!",
					"emotion" : "default"
				},
				{
					"task" : "Order a hamburger",
					"possibilities" : ["我要一个汉堡", "来一个汉堡", "来个汉堡"],
					"correct" : false,
					"response" : "好, 一个汉堡!", 
					"emotion" : "ordering"
				},
				{
					"task" : "Ask whether they have Fried Rice",
					"possibilities" : ["你有没有炒饭", "请问你有没有炒饭", "你们卖炒饭吗", "你有炒饭吗?"],
					"correct" : false,
					"response" : "不好意思, 我们没有炒饭.",
					"emotion" : "default"
				}

				/*
				{
					"task" : "Ask for name",
					"possibilities" : ["你叫什么名字", "你叫什么", "你的名字是什么", "你是谁"],
					"correct" : false,
					"response" : "我叫张大伟.",
					"emotion" : "default"
				},
				{
					"task" : "Ask for nationality", 
					"possibilities" : ["你是哪国人", "你是哪里人", "你来自哪里?"],
					"correct" : false,
					"response" : "我是中国人.",
					"emotion" : "default"
				}, 
				{
					"task" : "Ask for age", 
					"possibilities" : ["你几岁", "你多大"],
					"correct" : false,
					"response" : "我二十六岁.",
					"emotion" : "default"
				},
				{
					"task" : "Ask what he likes to eat",
					"possibilities" : ["你喜欢吃什么", "你爱吃什么"],
					"correct" : false,
					"response" : "我喜欢吃牛肉面和汤圆.",
					"emotion" : "laughing"
				}
				*/
			]
		},
		{
			"name" : "Luciana",
			"language" : "es-es",
			"location" : 
			{
				"name" : "Madrid Airport",
				"bg" : bgIMAGE_BASE_PATH + "shanghaiAirport.jpg"

			},
			"emotions" : 
			{
				"default": IMAGE_BASE_PATH + "lucianaDefault.png",
				"confused" : IMAGE_BASE_PATH + "lucianaConfused.png",
				"sass" : IMAGE_BASE_PATH + "lucianaSass.png",
				"laughing" : IMAGE_BASE_PATH + "lucianaLaughing.png"
			},
			"confusedPhrases" : 			
			[
				{ 
					"response": "¿Qué?",
					"soundID" : "que",
					"soundPath" : SOUND_BASE_PATH + "luciana/que.ogg"
				}, 
				{ 
					"response": "¿Qué dijiste?",
					"soundID" : "quedijiste",
					"soundPath" : SOUND_BASE_PATH + "luciana/quedijiste.ogg"
				}, 
				{ 
					"response": "No entiendo.",
					"soundID" : "noentiendo",
					"soundPath" : SOUND_BASE_PATH + "luciana/noentiendo.ogg"
				},
				{ 
					"response": "Lo siento. No te entiendo.",
					"soundID" : "losiento",
					"soundPath" : SOUND_BASE_PATH + "luciana/losiento.ogg"
				},			
			],
			"tasks" : 
			[
				{
					"task" : "Greet her",
					"possibilities" : ["Hola"],
					"correct" : false,
					"response" : "Hola!",
					"soundID" : "hola",
					"soundPath" : SOUND_BASE_PATH + "luciana/hola.ogg",
					"emotion" : "laughing"
				},
				{
					"task" : "Ask for name",
					"possibilities" : ["Cuál es tu nombre", "Cómo te llamas", "Cuál es su nombre"],
					"correct" : false,
					"response" : "Me llamo Luciana",
					"soundID" : "name",
					"soundPath" : SOUND_BASE_PATH + "luciana/name.ogg",
					"emotion" : "default"
				},
				{
					"task" : "Ask for nationality", 
					"possibilities" : ["cuál es tu nacionalidad", "de dónde eres"],
					"correct" : false,
					"response" : "Soy de España",
					"soundID" : "nationality",
					"soundPath" : SOUND_BASE_PATH + "luciana/hola.ogg",
					"emotion" : "default"
				}, 
				{
					"task" : "Ask for age", 
					"possibilities" : ["cuántos años tienes", "cuántos años tiene", "Qué edad tienes"],
					"correct" : false,
					"response" : "Tengo 26 años.",
					"soundID" : "age",
					"soundPath" : SOUND_BASE_PATH + "luciana/age.ogg",
					"emotion" : "default"
				},
				{
					"task" : "Ask what she likes to eat",
					"possibilities" : ["Qué te gusta comer", "Qué le gusta comer"],
					"correct" : "false",
					"response" : "Me gusta comer ensalada y pollo frito.",
					"soundID" : "foodLikes",
					"soundPath" : SOUND_BASE_PATH + "luciana/foodLikes.ogg",
					"emotion" : "laughing"
				}
			]
		},
	]

}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var octopusTasks = {
	getTasks: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].tasks;
	},

	// Returns all task data for a specific character
	getCharacterTasks: function() {
		return charTaskData.characterProfiles.tasks;
	},
	// Checks question to see if the question is in the list of possible questions and returns appropriate response
	checkTask: function(userInput) {
		var correctQuestion = false;
		var response = "";

		// If spoken phrase matches tasks, restructure data to reflect current emotion, sound, 
		octopusTasks.getTasks().forEach(function(task, i){
			for (j = 0; j < task.possibilities.length; j++) {
				// If there's a match, set appropriate variables to render
				if (task.possibilities[j].toLowerCase() == userInput) {
					correctQuestion = true;
					response = task.response;
					task.correct = true;
					charTaskData.currentEmotion = task.emotion;
					charTaskData.currentSoundID = task.soundID;
				}
			}			
		})

		if (correctQuestion == true) {
			// render updated task list
			return response; 
		} else {
			charTaskData.currentEmotion = octopusCharacter.changeCurrentEmotion("confused");
			// Grab random confused phrase
			var confusedPhrasesArray = charTaskData.characterProfiles[charTaskData.currentCharacter].confusedPhrases;
			
			// Randomly pick a confused response, store soundID as currentSoundID
			var randomVar = Math.random();
			response = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;
			charTaskData.currentSoundID = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID;
			return response;
		}
	}


}

var octopusCharacter = {
	getCurrentLanguage : function() {
		return charTaskData.currentLanguage;
	},
	setCurrentLanguage : function() {
		charTaskData.currentLanguage = charTaskData.characterProfiles[charTaskData.currentCharacter].language;
		return charTaskData.currentLanguage;
	},
	getCharacters: function() {
		return charTaskData["characterProfiles"];
	},

	changeCharacter: function(charIndex) {
		charTaskData["currentCharacter"] = charIndex;
	},
	// Returns the object of all info about character
	getCurrentCharacter: function() {
		return charTaskData["characterProfiles"][charTaskData.currentCharacter];
	},
	getCurrentEmotion: function() {
		return charTaskData.currentEmotion;
	},
	// Changes emotions of character and returns it
	changeCurrentEmotion: function(emotion) {
		charTaskData.currentEmotion = emotion;
		return emotion
	},

	getCurrentSceneBackground: function() {
		console.log(charTaskData.characterProfiles[charTaskData.currentCharacter].location.bg);
		return charTaskData.characterProfiles[charTaskData.currentCharacter].location.bg;
	}
}

var octopusSound = {
	// Returns an array of sound object, which contains sound file and soundID
	// soundArray = {"soundID" : "", "soundPath" : ""}
	getCurrentCharacterSounds: function() {

		// Push sounds related to tasks
		var soundArray = [];
		var tasks = charTaskData.characterProfiles[charTaskData.currentCharacter].tasks;
		tasks.forEach(function(task, i) {
			var soundObject = {
				"soundID" : task.soundID,
				"soundPath" : task.soundPath
			}
			soundArray.push(soundObject);
		})

		// Push sounds related to confused responses
		var confusedPhrases = charTaskData.characterProfiles[charTaskData.currentCharacter].confusedPhrases;
		confusedPhrases.forEach(function(phrase, i){
			var soundObject = {
				"soundID" : phrase.soundID,
				"soundPath" : phrase.soundPath
			}
			soundArray.push(soundObject);
		});
		return soundArray;
	},

	getCurrentSoundID: function() {
		return charTaskData.currentSoundID;
	},
	setCurrentSoundID: function(soundID) {
		charTaskData.currentSoundID = soundID;
	}
}

var viewCharList = {
	init: function() {
		this.charList = $(".charList");
	},
	render: function() {
		var htmlCharList = "";
		octopusCharacter.getCharacters().forEach(function(char, i) {
			htmlCharList += "<li class='charItem' data-index='"+ i +"'>";
			htmlCharList += "<a href='#'>"  + char.name + "</a>";
			htmlCharList += "</li>";
		});
		this.charList.html(htmlCharList);
		// Add button functionality to load this character's character and tasks when clicked
		$(".charItem").click(function() {
			// Destroy any character text Speech present
			viewCharacterResponse.destroy();

			// Reset currenEmotion to default
			octopusCharacter.changeCurrentEmotion("default");

			// Render new character, tasklist, and preload sounds
			var index = $(this).attr("data-index");
			octopusCharacter.changeCharacter(index);
			viewCharacter.render();
			viewTaskList.render();

			// Initiates the sound for the current character
			soundPlayer.init();
		})
	}
}

var viewTaskList = {
	init: function() {
		this.taskList = $(".taskList");
	},

	render: function() {
		var htmlTaskList = "<h3>Tasks</h3>";
		// taskComplete determines whether task background should be green
		octopusTasks.getTasks().forEach(function(task, i) {
			if (task.correct == true) {
				var htmlTaskClass = "correctTask";
				var glyphicon = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
			} else {
				var htmlTaskClass = "task";
				var glyphicon = "";
			}
			htmlTaskList += "<li class='" + htmlTaskClass + " inactiveLink' role='presentation' data-index='" + i +"'>";
			htmlTaskList += "<a href='#'>" + glyphicon + " " + task["task"] + "</a></li>";
		});
		this.taskList.html(htmlTaskList);
	}
}

var viewCharacter = {
	init: function() {
		this.characterDiv = $(".characterDiv");
		this.characterNameDiv = $(".characterNameDiv");
		this.characterImageDiv = $(".characterImageDiv");
		this.bg = $(".sceneWrapper");
	},

	render: function() {
		currentChar = octopusCharacter.getCurrentCharacter();
		currentEmotion = octopusCharacter.getCurrentEmotion();

		// Set the language based on currentChar
		octopusCharacter.setCurrentLanguage();
		this.characterImageDiv.html("<img class='charImage' src='" + currentChar.emotions[currentEmotion] + "'>");
		// Render Character's name if the name has been asked
		this.characterNameDiv.html(currentChar.name);

		// Render new background
		this.bg.css("background-image", "url(" + octopusCharacter.getCurrentSceneBackground() +  ")")
	}
}

var viewCharacterResponse = {
	init: function() {
		//textResponse starts off hidden until rendered
		this.textResponse = $(".characterTextResponse");
		$(".characterTextResponse").hide();
	},

	renderTextResponse: function(textToRender) {
		this.textResponse.show();
		this.textResponse.html(textToRender);
	},

	destroy: function() {
		this.textResponse.hide();
		console.log(this.textResponse);
	}
}

var viewSpeakButton = {
	init: function() {
		this.respondButton = $(".respondButton");
		this.micIcon = $(".icon-mic");
		console.log(this.micIcon);
	},
	render: function() {
		// Add Even Listener to respondButton
		this.respondButton.click(function(){
			viewSpeakButton.micIcon.attr("style", "color: red");
			testSpeech();
		});
	},

	removeRedMic: function() {
		this.micIcon.attr("style", "color: white");
	}
}

var soundPlayer = {
	// Get all the character sounds and initialize them into a createjs array
	init: function() {
		var soundArray = octopusSound.getCurrentCharacterSounds();
		soundArray.forEach(function(soundFile, i) {
			createjs.Sound.registerSound(soundFile.soundPath, soundFile.soundID);
		});
		console.log(soundArray);
	},

	// Called to play the Current Sound stored in the data
	playCurrentSound: function() {
		createjs.Sound.play(octopusSound.getCurrentSoundID());
	}
}

function testSpeech() {
	var tasks = [];
	//octopusTasks.getTasks();
	
	octopusTasks.getTasks().forEach(function(task, i){
		for (j = 0; j < task.possibilities.length; j++) {
			tasks.push(task.possibilities[j]);
		}
		
	});

	console.log(tasks);

	var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + /*+ task +*/';';
	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.lang = octopusCharacter.getCurrentLanguage();
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	recognition.start();

	recognition.onresult = function(event) {
		// The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
		// The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
		// It has a getter so it can be accessed like an array
		// The first [0] returns the SpeechRecognitionResult at position 0.
		// Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
		// These also have getters so they can be accessed like arrays.
		// The second [0] returns the SpeechRecognitionAlternative at position 0.
		// We then return the transcript property of the SpeechRecognitionAlternative object 
		var speechResult = event.results[0][0].transcript;
		// diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';

		// Check whether Task is correct and return appropriate response based on right or wrong
		// Logic of check is in the octopusTasks Controller
		var response = octopusTasks.checkTask(speechResult.toLowerCase());
		console.log(speechResult);
		viewCharacterResponse.renderTextResponse(response);
		viewTaskList.render();
		viewCharacter.render();
		soundPlayer.playCurrentSound();
		console.log('Confidence: ' + event.results[0][0].confidence);
	}

	recognition.onspeechend = function() {
		recognition.stop();
		console.log("Stopped");
		viewSpeakButton.removeRedMic();

		// testBtn.disabled = false;
		// testBtn.textContent = 'Start new test';
	}

	recognition.onerror = function(event) {
		console.log("Error" + event.error);
		viewSpeakButton.removeRedMic();

		// testBtn.disabled = false;
		// testBtn.textContent = 'Start new test';
		// diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
	}


}


viewTaskList.init();
viewTaskList.render();
viewCharacter.init();
viewCharacterResponse.init();
viewCharacter.render();
viewSpeakButton.init();
viewSpeakButton.render();
viewCharList.init();
viewCharList.render();
soundPlayer.init();

/*
var audio = new Audio(SOUND_BASE_PATH + 'david/davidNihao.ogg');
audio.play();
*/


