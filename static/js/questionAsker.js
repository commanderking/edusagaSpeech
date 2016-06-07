/*
TODO: Preload background and character images
*/

var SOUND_BASE_PATH = './static/audio/';
var IMAGE_BASE_PATH = "./static/images/";
var bgIMAGE_BASE_PATH = "./static/images/bg/";

var charTaskData = [];
var speechSynthData =
{
	"rate" : "",
	"pitch" : "",
	"voice" : "",
	"name" : ""
};

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
				viewFeedback.init();

				// voice list loaded asynchornously, so can't be grabbed on page load
				// http://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-of-chrome-web-speech-api
				// Wait until the voiceslist changes and then initialize speechSynth
				window.speechSynthesis.onvoiceschanged = function() {
					// window.speechSynthesis.getVoices();
					speechSynth.init();
					// synth.speak(utterThis);
				};
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
	// Prints Help Text when the help button is clicked on the task
	taskHelp: function(taskIndex) {
		console.log(taskIndex);
		var helperText = octopusTasks.getTasks()[taskIndex].possibilities[0];
		return helperText;
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
		var returnedObject =
		{
			"response" : "",
			"feedback" : ""
		};

		// If spoken phrase matches tasks, restructure data to reflect current emotion, sound, 
		octopusTasks.getTasks().forEach(function(task, i){
			for (j = 0; j < task.possibilities.length; j++) {
				// If there's a match, set appropriate variables to render
				if (task.possibilities[j].toLowerCase() == userInput) {
					correctQuestion = true;
					returnedObject.response = task.response;
					returnedObject.feedback = null;
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
			return returnedObject;
		}
		// In case of wrong response, store data accordingly
		else {
			charTaskData.currentEmotion = octopusCharacter.changeCurrentEmotion("confused");
			// Grab random confused phrase
			var confusedPhrasesArray = charTaskData.characterProfiles[charTaskData.currentCharacter].confusedPhrases;
			
			// Randomly pick a confused response, store soundID as currentSoundID
			var randomVar = Math.random();
			returnedObject.response = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;
			charTaskData.currentSoundID = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID;
			
			// Store the incorrect answer they said for feedback
			returnedObject.feedback = userInput;
			console.log(returnedObject.feedback);
			return returnedObject;
		}
	},
	// Loop through current tasks and look for any extension tasks and populate those into the current tasks
	skipTasks: function() {
		// Collect all the extension tasks that will need to be pushed to the task list after looping to delete
		var tempTaskArray = [];
		console.log(octopusTasks.getTasks().length);
		octopusTasks.getTasks().forEach(function(task, i) {
			console.log(task);
			// Prevent case where extensionTasks is not defined in JSON
			if (task.extensionTasks === undefined) {

			}
			else if (task.extensionTasks.length > 0) {
				task.extensionTasks.forEach(function(extensionTask, j) {
					tempTaskArray.push(task.extensionTasks[j]);
				});
			}
			console.log(tempTaskArray);
		});
		// Replace previous tasks with current tasks
		charTaskData.characterProfiles[charTaskData.currentCharacter].tasks = tempTaskArray;
		// charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.push(tempTaskArray);
		viewTaskList.render();
		// charTaskData.characterProfiles[charTaskData.currentCharacter].tasks.splice(index, 1);

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

var octopusSpeechSynth = {

	// Takes string of the name of the speechSynth Voice (i.e Ting-Ting)
	setVoice: function(compVoice) {
		speechSynthData.voice = compVoice;
	},
	getVoice: function() {
		return speechSynthData.voice;
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

		// Grab Modal Window 
		this.modalWindowBody = $(".modal-body");

		// Grab skip question button
		this.btnSkip = $(".btn-skip");
	},

	render: function() {
		that = this;
		if (octopusTasks.allTasksCompletedBool() === false) {
			var htmlTaskList = "<h3>Tasks</h3>";
			// taskComplete determines whether task background should be green
			octopusTasks.getTasks().forEach(function(task, i) {
				htmlTaskList += "<li class='inactiveLink' role='presentation' data-index='" + i +"'>";
				htmlTaskList += "<a href='#'>" + task["task"];
				htmlTaskList += "<span class='taskHelpIcon glyphicon glyphicon-question-sign' data-index='" + i +"' data-toggle='modal' data-target='#myModal' aria-haspopup='true' aria-expanded='true'></span></a>";
				htmlTaskList += "</li>";
			});
			this.taskList.html(htmlTaskList);

			/* Populate Hint Modal Window with proper text when clicked */
			$(".taskHelpIcon").click(function() {
				var dataIndex = $(this).attr('data-index');
				var taskHelpHTML = "<div class='helpFillerText'> Maybe You Could Say: <span class='taskHelpSpeech'>" + octopusTasks.taskHelp(dataIndex) + "</span>";
				taskHelpHTML += ' <span class="taskHelpSoundIcon glyphicon glyphicon glyphicon-volume-up" aria-hidden="true"></span>';
				console.log(octopusTasks.taskHelp(dataIndex));
				that.modalWindowBody.html(taskHelpHTML);

				// When taskHelpSound icon clicked, the sound should play
				$(".taskHelpSpeech, .taskHelpSoundIcon").click(function() {
					var textToSay = $(".taskHelpSpeech").html();
					console.log(textToSay);
					speechSynth.play(textToSay);
				});
			});

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

		// Skip button - remove any previous listeners and add new one
		this.btnSkip.unbind('click');
		this.btnSkip.click(function() {
			octopusTasks.skipTasks();
		});

		// If there are no more tasks, remove the skip task button
		if (octopusTasks.getTasks().length === 0) {
			this.btnSkip.addClass('hidden');
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
		speechSynth.init();
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

var viewFeedback = {
	init: function() {
		this.feedback = $(".feedback");
	},
	render: function(feedbackText) {
		that = this;
		this.feedback.removeClass("hidden");
		this.feedback.html("You said: <span class='feedbackText'>" + feedbackText + "</span>");
		this.feedback.click(function() {
			console.log(that.feedback.children(".feedbackText").html());
			speechSynth.play(that.feedback.children(".feedbackText").html());
		});
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

var speechSynth = {
	// Initialize with proper language
	init : function() {
		var synth = window.speechSynthesis;
		// Temporarily stores 
		var voices = [];

		// Get current language
		var lang = octopusCharacter.getCurrentLanguage();
		console.log(lang);
		var synthLang = "";

		if (lang == "cmn-Hant-TW" || "zh-zh") {
			// Ting-Ting is a specific Chinese voice in the voice array
			synthLang = "Google 普通话（中国大陆）";
		} else if (lang == "es-es") {
			synthLang = "Monica";
		}
		console.log(synthLang);

		var setVoice = function() {
			voices = synth.getVoices();
			for(i = 0; i < voices.length ; i++) {
				if(voices[i].name === synthLang) {
					octopusSpeechSynth.setVoice(voices[i]);
				}
			}
		};
		setVoice();
	},
	play : function(textToSay) {
		var utterThis = new SpeechSynthesisUtterance(textToSay);
		console.log(octopusSpeechSynth.getVoice().name);
		utterThis.voice = octopusSpeechSynth.getVoice();
		utterThis.rate = 0.8;
		console.log(utterThis.voice);
		window.speechSynthesis.speak(utterThis);

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
		var responseObject = octopusTasks.checkTask(speechResult.toLowerCase());
		console.log(speechResult);
		viewCharacterResponse.renderTextResponse(responseObject.response);
		viewTaskList.render();
		viewCharacter.render();
		soundPlayer.playCurrentSound();
		if (responseObject.feedback == null) {
			// User is correct
		} else {
			viewFeedback.render(responseObject.feedback);

		}
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

//Wrap the getUserMedia function from the different browsers
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
 
//Our success callback where we get the media stream object and assign it to a video tag on the page
function onSuccess(mediaObj){
    console.log ("Audio enabled");
}
 
//Our error callback where we will handle any issues
function onError(errorObj){
    console.log("There was an error: " + errorObj);
}
 
//We can select to request audio 
var mediaConstraints = { audio: true };
 
//Call our method to request the media object - this will trigger the browser to prompt a request.
navigator.getUserMedia(mediaConstraints, onSuccess, onError);

startDemo.init();

