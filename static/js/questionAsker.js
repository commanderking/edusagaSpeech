/*
TODO: Preload background and character images
*/

// Generate fake GUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


var SOUND_BASE_PATH = './static/audio/';
var IMAGE_BASE_PATH = "./static/images/";
var bgIMAGE_BASE_PATH = "./static/images/bg/";

// Will store the scene data (characters, tasks) that's called for from $getJson request
var charTaskData = [];


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var emailID = getUrlParameter('p');
// Template for Log Data

var logDataTemplate = {
	'userID' : '',
	'emailID' : emailID,
	'dialogID' : '',
	'nodeID' : '',
	'timeStamp' : '',
	'eventType' : '',
	'response' : ''
};

// Should be removed when userID and dialogID are generated
logDataTemplate.userID = guid();
logDataTemplate.dialogID = 0;

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
				viewScene.init();
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

/*-----------------------------------
Controller Related Functions
-------------------------------------*/

var octopusScene = {
	// return the object which contains all scenario info
	getScenarioInfo: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].scenario;
	},
	// Get the name of the location
	getLocation: function() {
		return charTaskData.characterProfiles[charTaskData.currentCharacter].location.name;
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
		// nodeID of task needed for log data
		var nodeID = 0;
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
					nodeID = task.dialogNodeID;
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

		// POST Log Event Data 
		var logEvent = logDataTemplate;
		logEvent.timeStamp = new Date();
		logEvent.nodeID = nodeID;
		logEvent.response = userInput;
		logEvent.eventType = "click";
		console.log(logEvent);
		logEvent = JSON.stringify(logEvent);
		$.ajax({
			url: "/log",
			type: "POST",
			data: logEvent, 
			dataType: "json"
		});

		if (correctQuestion === true) {
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












/*-------------------------------------------------------
View related Functions 
-------------------------------------------------------*/

// Set up UI that's relevant to the scene
var viewScene = {
	init: function() {
		this.locationText = $(".locationText");
		this.locationText.html(octopusScene.getLocation());
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

		// Grab gameWrapper to fade
		this.gameWrapper = $(".gameWrapper");

		// Grab Modal Window 
		this.modalWindowBody = $(".modal-body");

		// Grab skip question button
		this.btnSkip = $(".btn-skip");

		// Grab help related DOM elements
		this.helpWindow = $(".helpWindow");
		this.roboImageWrapper = $(".roboImageWrapper");
		this.roboHelpTextWrapper = $(".roboHelpTextWrapper");
		this.roboSpeakIcon = $(".roboSpeakIcon");
		this.helpText = $(".helpText");
		this.closeHelp = $(".closeHelp");
	},

	render: function() {
		var that = this;
		if (octopusTasks.allTasksCompletedBool() === false) {
			var htmlTaskList = "";
			octopusTasks.getTasks().forEach(function(task, i) {
				htmlTaskList += "<li class='inactiveLink' role='presentation' data-index='" + i +"'>";
				htmlTaskList += "<div class='taskDiv'><span class='icon-mic'></span>";
				htmlTaskList += "<div class='taskText'>" +  task["task"] + "</div>";
				htmlTaskList += "<a class='taskHelpIcon glyphicon glyphicon-question-sign' tabindex='0' role='button' data-trigger='click' data-toggle='popover' data-container='body' data-placement='bottom' data-content=' ' data-index='" + i + "'></a>";
				htmlTaskList += "</li>";
			});
			this.taskList.html(htmlTaskList);

			/* Activate speech mode when mic button is clicked
			*/
			$(".taskText").click(function() {
				$(this).parent().children(".icon-mic").attr("style", "color: red");
				testSpeech();
				$(this).prop("disabled", true);
			});

			/* Populate Hint Modal Window with proper text when clicked */
			$(".taskHelpIcon").click(function() {
				// Fade background
				viewFadeAll.render();
				// Overlay black over the elements 
				that.gameWrapper.css("background", "black");

				that.helpWindow.removeClass("hidden");
				var dataIndex = $(this).attr('data-index');
				that.helpText.html('<span class="taskHelpSpeech">' + octopusTasks.taskHelp(dataIndex) + '</span>');
				$(".taskHelpSpeech, .taskHelpSoundIcon, .roboSpeakIcon").click(function() {
					var textToSay = $(".taskHelpSpeech").html();
					speechSynth.play(textToSay);
				});

				/* Enable hint window to be closed */
				that.closeHelp.click(function() {
					that.helpWindow.addClass("hidden");
					viewFadeAll.resetFade();
					that.gameWrapper.css("background", "rgba(1,1,1,0.1)");
				})
			})

		} else {
			this.taskList.html("");
		}

		//TODO: Currently don't render completed task list
		/*
		// If completed tasks exist, render them
		if (octopusTasks.completedTasksBool()) {
			var htmlTaskList = "<h3>Completed Tasks (已完成任务)</h3>";
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
		}*/

		// Skip button - remove any previous listeners and add new one
		this.btnSkip.unbind('click');
		this.btnSkip.click(function() {
			octopusTasks.skipTasks();
		});

		// If there are no more tasks, remove the skip task button
		if (octopusTasks.getTasks().length === 0) {
			this.btnSkip.addClass('hidden');
		} 

		// TODO: When character changes, the skip button should reset to not hidden
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
		this.roboWrapper = $(".roboWrapper");
		this.scenarioTextWrapper = $(".scenarioTextWrapper");
		// Grab Speech Recognition tools from Chrome Browser;
		try {
			var SpeechRecognition = webkitSpeechRecognition;
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
		} catch(err) {
			alert("Sorry, EduSaga currently only supports Google Chrome on desktop or laptops (no mobile). Please switch over to Google Chrome for speech recognition access.");
		}
	},

	render: function() {
		var that = this;
		// Render Scene Explanation Window
		this.scenarioWindow.removeClass("hidden");
		this.roboWrapper.html('<img src="' + IMAGE_BASE_PATH + 'robo/roboDefault.png">');
		this.scenarioTextWrapper.children(".scenarioHeader").html(octopusScene.getScenarioInfo().title);
		this.scenarioTextWrapper.children(".scenarioText").html(octopusScene.getScenarioInfo().text);
		this.scenarioTextWrapper.children(".btn-confirm").click(function() {


			that.scenarioWindow.addClass("hidden");
			viewFadeAll.resetFade();
		});

		// Hide button if tutorial button not present, otherwise add functionality
		/*
		if (octopusTutorial.checkTutorialOn() === false) {
			this.scenarioWindow.children(".btn-tutorial").addClass("hidden");
		} else {
			this.scenarioWindow.children(".btn-tutorial").click(function() {
				viewFadeAll.resetFade();
				viewTutorial.render();
				that.scenarioWindow.addClass("hidden");
			});
		}*/

		// Fade all other elements to highlight scene explanation window
		viewFadeAll.render();
	}
};

var viewCharacterResponse = {
	init: function() {
		//textResponse starts off hidden until rendered
		this.textResponse = $(".characterTextResponse");
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
		this.micIcon.attr("style", "color: #000098");
		this.respondButton.prop("disabled", false);
	}
};

var viewFeedback = {
	init: function() {
		this.feedback = $(".feedback");
		this.feedbackImageWrapper = $(".feedbackImageWrapper");
		this.feedbackDiv = $(".feedbackDiv");
		this.feedbackText = $(".feedbackText");
	},
	render: function(feedbackText) {
		var that = this;
		this.feedback.removeClass("hidden");
		this.feedbackImageWrapper.html("<img src='" + IMAGE_BASE_PATH + "robo/roboDefault.png'>");
		this.feedbackText.html(feedbackText);

		// Remove any previous event handlers
		this.feedbackText.unbind('click');

		this.feedbackText.click(function() {
			speechSynth.play($(this).html());
		});
	},
	// Hides feedback Div;  Called in testSpeech if correct answer is made after wrong answer
	hideFeedbackDiv: function() {
		if (!this.feedback.hasClass("hidden")) {
			console.log("Hidden");
			this.feedback.addClass("hidden");
		}
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

// Methods related to playing text to speech with speechsynth
var speechSynth = {
	// Initialize with proper language
	init : function() {
		var synth = window.speechSynthesis;
		// Temporarily stores 
		var voices = [];

		// Get current language
		var lang = octopusCharacter.getCurrentLanguage();
		var synthLang = "";

		// Find the correct language of the activity
		if (lang == "es-es") {
			synthLang = "Monica";
		} else if (lang === "cmn-Hant-TW" || "zh-zh") {
			synthLang = "Google 普通话（中国大陆）";
		}

		// Set the voice of the robot to be the correct language from browser
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
		utterThis.rate = 0.6;
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
			viewFeedback.hideFeedbackDiv();
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
//Wrap the getUserMedia function from the different browsers
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

// Get reference to SpeechRecognition in Browser
var SpeechRecognition = webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

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
// navigator.getUserMedia(mediaConstraints, onSuccess, onError);

startDemo.init();

// Enable Bootstrap Popovers
$(function () {
  $('[data-toggle="popover"]').popover();
});

