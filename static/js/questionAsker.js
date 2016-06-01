/*
TODO: Preload background and character images
*/

var SOUND_BASE_PATH = './static/audio/';
var IMAGE_BASE_PATH = "./static/images/";
var bgIMAGE_BASE_PATH = "./static/images/bg/";

var charTaskData = [];

// Demo Language should be set in web.py on routing
var startDemo = {
	init: function() {
		if (!demoLanguage) {
			console.log("No Demo Language Loaded");
		} else
		{
			$.getJSON("./static/data/demo" + demoLanguage + ".json", function(data) {
				// Calls in here to make sure that the data is loaded before any other functions are run
				charTaskData = data;
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
				viewSceneIntro.init();
				viewSceneIntro.render();
			});
		}
	}
};

var octopusScene = {
	// return the object which contains all scenario info
	getScenarioInfo: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].scenario;
	}
};

// Controller for functions related to tasks and task data
var octopusTasks = {
	getTasks: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].tasks;
	},

	// Checks whether all tasks have been completed
	allTasksCompletedBool: function() {
		if (charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.length === 0) {
			return true;
		} else {
			return false;
		}
	},

	// Pop the current task off the charTaskData tasks array and into completed array
	// Takes the index of the task to pop off
	completeTask: function(index) {
		var completedTask = octopusTasks.getTasks()[index];
		// TODO: Replace following line with deleteTask once this works
		charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.splice(index, 1);
		charTaskData.characterProfiles[charTaskData.currentCharacter].completedTasks.push(completedTask);
	},
	// Removes the tasks completely from tasks, and it does not add it to the completed list
	deleteTask: function(index) {
		charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.splice(index, 1);
	},
	getCompletedTasks: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].completedTasks;
	},
	// Checks whether there are any completed tasks
	completedTasksBool: function() {
		if (charTaskData.characterProfiles[charTaskData.currentCharacter].completedTasks.length > 0) {
			return true; 
		} else {
			return false;
		}
	},
	// Checks whether there are any linked tasks for a task at an index and returns it
	getTaskLink: function(index) {
		if (this.getTasks()[index].taskLink !== null) {
			return this.getTasks()[index].taskLink;
		} else {
			return null;
		}
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

					// Grab the taskLink if it exists
					if (task.taskLink !== null) {
						var taskLink = octopusTasks.getTaskLink(i);
					}

					// Complete current task
					octopusTasks.completeTask(i);

					// If it's a choice task, search the array for other choices that are linked and remove them
					if (task.taskType !== null) {
						console.log(task.taskType);
						if (task.taskType == "choice") {
							// Get taskLink if it exists
							// Search tasks to see if there's another task with the current link
							octopusTasks.getTasks().forEach(function(task, k) {
								if (task.taskLink == taskLink) {
									octopusTasks.deleteTask(k);
								}
							});
						}
					}

					// If task has an extension task, add that new task to the Task List
					if (task.extensionTasks == null) {

					} else if (task.extensionTasks.length > 0) {
						task.extensionTasks.forEach(function(extensionTask, j) {
							charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.push(task.extensionTasks[j]);
						})
					}
				}
			}
		});

		if (correctQuestion === true) {
			// render updated task list
			return response;
		}
		// In case of wrong response, store data accordingly
		else {
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
};

// Controller that connects Character Views with Character Model
var octopusCharacter = {
	// returns current language based on Web Speech API language name
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
		return emotion;
	},
	// Returns the background path
	getCurrentSceneBackground: function() {
		return bgIMAGE_BASE_PATH + charTaskData.characterProfiles[charTaskData.currentCharacter].location.bg;
	}
};

var octopusSound = {
	// Returns an array of sound object, which contains sound file and soundID
	// Used to preload all sounds in soundPlayer object (below)
	// soundArray = {"soundID" : "", "soundPath" : ""}
	getCurrentCharacterSounds: function() {

		var soundArray = [];
		var sounds = charTaskData.characterProfiles[charTaskData.currentCharacter].sounds;
		// octopusSound.getSoundsArrayFromTasks(tasks, soundArray);
		
		sounds.forEach(function(task, i) {
			var soundObject = {
				"soundID" : task.soundID,
				"soundPath" : SOUND_BASE_PATH + task.soundPath
			};
			// Dig through extension tasks
			soundArray.push(soundObject);
		});

		// Push sounds related to confused responses
		var confusedPhrases = charTaskData.characterProfiles[charTaskData.currentCharacter].confusedPhrases;
		confusedPhrases.forEach(function(phrase, i){
			var soundObject = {
				"soundID" : phrase.soundID,
				"soundPath" : SOUND_BASE_PATH + phrase.soundPath
			};
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
};

// Renders the number of characters on the task list
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

			// Render Scenario Text
			viewSceneIntro.render();

			// Initiates the sound for the current character
			soundPlayer.init();
		});
	}
};

var viewTaskList = {
	init: function() {
		this.taskList = $(".taskList");
		this.completedTaskList = $(".completedTaskList");
	},

	render: function() {
		if (octopusTasks.allTasksCompletedBool() === false) {
			var htmlTaskList = "<h3>Tasks</h3>";
			// taskComplete determines whether task background should be green
			octopusTasks.getTasks().forEach(function(task, i) {
				htmlTaskList += "<li class='inactiveLink' role='presentation' data-index='" + i +"'>";
				htmlTaskList += "<a href='#'>" + task["task"] + "</a></li>";
			});
			this.taskList.html(htmlTaskList);
		} else {
			this.taskList.html("");
		}

		// If completed tasks exist, render them
		if (octopusTasks.completedTasksBool()) {
			var htmlTaskList = "<h3>Completed Tasks</h3>";
			octopusTasks.getCompletedTasks().forEach(function(task, i) {
				if (task.correct === true) {
					var htmlTaskClass = "correctTask";
					var glyphicon = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
				} else {
					var htmlTaskClass = "task";
					var glyphicon = "";
				}
				htmlTaskList += "<li class='" + htmlTaskClass + " inactiveLink' role='presentation' data-index='" + i +"'>";
				htmlTaskList += "<a href='#'>" + glyphicon + " " + task["task"] + "</a></li>";
			});
			this.completedTaskList.html(htmlTaskList);
			this.completedTaskList.removeClass("hidden");
		}
		else {
			this.completedTaskList.addClass("hidden");
		}
	}
};

var viewCharacter = {
	init: function() {
		this.characterDiv = $(".characterDiv");
		this.characterNameDiv = $(".characterNameDiv");
		this.characterImageDiv = $(".characterImageDiv");
		this.bg = $(".sceneBG");
	},

	render: function() {
		currentChar = octopusCharacter.getCurrentCharacter();
		currentEmotion = octopusCharacter.getCurrentEmotion();

		// Set the language based on currentChar
		octopusCharacter.setCurrentLanguage();
		this.characterImageDiv.html("<img class='charImage' src='" + IMAGE_BASE_PATH + currentChar.emotions[currentEmotion] + "'>");
		// Render Character's name if the name has been asked
		this.characterNameDiv.html(currentChar.name);

		// Render new background
		this.bg.attr("src", octopusCharacter.getCurrentSceneBackground());
	}
};

// Load Scene Introduction. Happens only once when page first loads
var viewSceneIntro = {
	init: function() {
		this.scenarioWindow = $(".scenarioWindow");
	},

	render: function() {
		var that = this;
		// Render Scene Explanation Window
		this.scenarioWindow.removeClass("hidden");
		this.scenarioWindow.children(".scenarioHeader").html(octopusScene.getScenarioInfo().title);
		this.scenarioWindow.children(".scenarioText").html(octopusScene.getScenarioInfo().text);
		this.scenarioWindow.children(".btn-confirm").click(function() {
			that.scenarioWindow.addClass("hidden");
			viewFadeAll.resetFade();
		});

		// Hide button if tutorial button not present, otherwise add functionality
		if (octopusTutorial.checkTutorialOn() === false) {
			this.scenarioWindow.children(".btn-tutorial").addClass("hidden");
		} else {
			this.scenarioWindow.children(".btn-tutorial").click(function() {
				viewFadeAll.resetFade();
				viewTutorial.render();
				that.scenarioWindow.addClass("hidden");
			});
		}

		// Fade all other elements to highlight scene explanation window
		viewFadeAll.render();

	}
};

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
	}
};

var viewSpeakButton = {
	init: function() {
		this.respondButton = $(".respondButton");
		this.micIcon = $(".icon-mic");
	},
	render: function() {
		var that = this;
		// Add Event Listener to respondButton
		this.respondButton.click(function(){
			that.micIcon.attr("style", "color: red");
			testSpeech();
			that.respondButton.prop("disabled", true);
		});
	},
	restoreMic: function() {
		this.micIcon.attr("style", "color: white");
		this.respondButton.prop("disabled", false);
	}
};

var soundPlayer = {
	// Get all the character sounds and initialize them into a createjs array
	init: function() {
		var soundArray = octopusSound.getCurrentCharacterSounds();
		soundArray.forEach(function(soundFile, i) {
			createjs.Sound.registerSound(soundFile.soundPath, soundFile.soundID);
		});
	},

	// Called to play the Current Sound stored in the data
	playCurrentSound: function() {
		createjs.Sound.play(octopusSound.getCurrentSoundID());
		console.log(octopusSound.getCurrentSoundID());
	}
};

function testSpeech() {
	var tasks = [];
	octopusTasks.getTasks().forEach(function(task, i){
		for (j = 0; j < task.possibilities.length; j++) {
			tasks.push(task.possibilities[j]);
		}
		
	});

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

		// Check whether Task is correct and return appropriate response based on right or wrong
		// Logic of check is in the octopusTasks Controller
		var response = octopusTasks.checkTask(speechResult.toLowerCase());
		console.log(speechResult);
		viewCharacterResponse.renderTextResponse(response);
		viewTaskList.render();
		viewCharacter.render();
		soundPlayer.playCurrentSound();
		// console.log('Confidence: ' + event.results[0][0].confidence);
	},

	recognition.onspeechend = function() {
		recognition.stop();
		console.log("Stopped");
		viewSpeakButton.restoreMic();
	},

	recognition.onerror = function(event) {
		console.log("Error" + event.error);
		viewSpeakButton.restoreMic();
	}
}

try {
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
	var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
} catch(err) {
	alert("Sorry, the browser does not support Web Speech. Please use Google Chrome for Speech Access.");
}

startDemo.init();

