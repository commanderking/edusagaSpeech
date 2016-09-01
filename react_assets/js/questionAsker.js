var React = require('react');
var ReactDOM = require('react-dom');
var CharacterContainer = require('./questionAsker/CharacterContainer');
var DialogContainer = require('./questionAsker/DialogContainer');
var TaskContainer = require('./questionAsker/TaskContainer');
var BackgroundImageContainer = require('./questionAsker/BackgroundImageContainer');
var FeedbackContainer = require('./questionAsker/FeedbackContainer');
var ResultsContainer = require('./questionAsker/ResultsContainer');
var SpeechSynth = require('./helpers/SpeechSynth');
var TransitionContainer = require('./questionAsker/TransitionContainer');
import {TaskController, SpeechChecker} from './helpers/QuestionAskerHelper';
const Constants = require('./helpers/Constants.js');


var initialLogData = {
	"startTime" : 0,
	"studentID" : "",
	"teacherID" : "",
	"IP" : "",
	"currentTime" : ""
}

var initializeLogData = {
	setStartTime: function() {
		initialLogData.startTime = new Date().getTime();
		console.log(initialLogData.startTime);
	},
	setStudentID : function(studentID) {
		initialLogData.studentID = studentID;
	},
	setTeacherID: function(teacherID) {
		if (teacherID) {
			initialLogData.teacherID = teacherID;
		} else {
			initialLogData.teacherID = "Unknown Teacher"
		}
	},
	setIP: function() {
		$.get("http://ipinfo.io", function(response) {
			initialLogData.IP = response.ip;
		    console.log(response.ip);
		}, "jsonp");		
	}
}

var QuestionAsker = React.createClass({
	// feedbackText can be hintText from clicking hint or feedback on what user said
	getInitialState: function() {
		return {
			sceneData: undefined,
			scenarioOn: true,
			scenarioIndex: 0,
			hintActive: false,
			currentHintIndex: -1,
			voicePack: {},
			coins: 0,
			possibleCoins: 0,
			answerFeedbackActive: false,
			feedbackText: "",
			miriIconSrc: "miri/icons/Miri_Icon_default.png",
			micActive: false,
			correctAnswerState: false,
			wrongAnswerState: false,
			sceneComplete: false
		}
	},
	loadSceneData: function() {
		var that = this;
		$.getJSON("/static/data/" + teacher + "/" + activity + ".json", function(data) {})
			.success(function(data) {

				// Calculate number of coins possible
				var totalCoins = 10 * (data.character.currentTasks.length + data.character.queuedTasks.length);
				that.setState({
					sceneData: data,
					possibleCoins: totalCoins
				});
			that.resetScene();

			/*----------------------------------
			 One time setting of initial log Data
			 ----------------------------------*/
			initializeLogData.setStartTime();
			if (studentID === null) {
				initializeLogData.setStudentID("Unknown Student HA");
			} else {
				initializeLogData.setStudentID(studentID);
			}
			initializeLogData.setTeacherID(teacher);
			initializeLogData.setIP();
			console.log(initialLogData);


			// Load all the sounds that are in the scene
			that.initializeSounds();
			// Load voice pack
			// voice list in browser loaded asynchornously, so can't be grabbed on page load
			// http://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-of-chrome-web-speech-api
			// Wait until the voiceslist changes and then initialize speechSynth
			// CARE: Will not work correctly if called on "render"
			window.speechSynthesis.onvoiceschanged = function() {
				that.setState({
					voicePack: SpeechSynth.init(that.state.sceneData.currentLanguage)
				});
			};
		})
	},
	resetScene: function() {
		this.setState({
			sceneComplete: false,
			scenarioOn: true,
			scenarioIndex: 0,
			coins: 0,
		})
	},
	componentDidMount: function() {
		this.loadSceneData();
	},
	componentWillReceiveProps: function() {
		this.loadSceneData();
	},
	componentDidUpdate: function() {

		// Logic for when scene is over
		if (this.state.sceneData.character.currentTasks.length === 0 && this.state.sceneComplete === false) {
			var that = this;
			var studentCompletedProgress = {};
			studentCompletedProgress.studentID = initialLogData.studentID;
			var allTaskData = [];

			var timeInSeconds = Math.floor((new Date().getTime() - initialLogData.startTime) / 1000);
			/*
			var timeInMinutes = Math.floor(timeInSeconds / 60);
			var seconds = Math.floor(timeInSeconds - (timeInMinutes * 60));
			var readableTime = timeInMinutes + " minutes" + " and " + seconds + "seconds";
			console.log(readableTime);
			*/

			// Only add needed pieces of information //
			this.state.sceneData.character.completedTasks.forEach(function(task, i){
				var taskData = {}
				taskData.taskID = task.taskID;
				taskData.task = task.task;
				taskData.correct = task.correct;
				taskData.attemptedAnswers = task.attemptedAnswers;
				allTaskData.push(taskData);

			})
			studentCompletedProgress.score = this.state.coins/10;
			studentCompletedProgress.possibleScore = this.state.possibleCoins/10;
			studentCompletedProgress.time = timeInSeconds;
			studentCompletedProgress.allTaskData = allTaskData;

			var logEvent = JSON.stringify(studentCompletedProgress);
			$.ajax({
				url: "/logStudent",
				type: "POST",
				data: logEvent, 
				dataType: "json"
			});


			setTimeout(function(){
				that.setState({sceneComplete: true})
			}, 700)
		}
	},
	checkAnswer: function(userAnswer, taskIndex) {
		// Case where there's an error due to user canceling
		if (userAnswer === "Cancel Speech") {
			// Do nothing
		} else {

			var that = this;
			var correctAnswer = false;
			var responseSoundID;
			var possibleAnswerIndex;

			// Trick to get new instance of sceneData, to not alter the origial state
			var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));
			var allCurrentTasks = TaskController.getCurrentTasks(newSceneData); 
			var currentTaskData = TaskController.getActiveTask(newSceneData, taskIndex);
			var possibleCorrectAnswers = TaskController.getPossibleCorrectAnswers(newSceneData, taskIndex);

			// Add the user answer to the attemptedAnswers (needed for right or wrong);
			newSceneData.character.currentTasks[taskIndex].attemptedAnswers.push(userAnswer);

			// Check if user's answers contains any of the possible answers
			if (currentTaskData.completeMatchOnly === true) {
				possibleCorrectAnswers.forEach(function(possibleAnswerObject, i) {
					// Temporarily grab the soundID of this object
					var tempSoundID = possibleAnswerObject.soundID;
					possibleAnswerObject.answers.forEach(function(possibleAnswer){
						if (userAnswer === possibleAnswer) {
							correctAnswer = true;
							responseSoundID = tempSoundID;
							possibleAnswerIndex = i;
						}
					})
				});
			} else {
				// Store the returned data;
				var returnedObject = SpeechChecker.typicalCheck(userAnswer, newSceneData, taskIndex);
				correctAnswer = returnedObject.answerCorrect;
				responseSoundID = returnedObject.responseSoundID;
				possibleAnswerIndex = returnedObject.possibleAnswersIndex;
			}
			if (correctAnswer) {

				/*----------------------------------------------
				These actions immediately happen
				----------------------------------------------*/

				// Play response voice
				this.playSound(responseSoundID);


				// Store sound ID in current Sound ID if player wnats to repeat
				newSceneData.currentSoundID = newSceneData.character.currentTasks[taskIndex].possibleAnswers[possibleAnswerIndex].soundID;

				// Adjust character image
				newSceneData.currentImage = newSceneData.character.currentTasks[taskIndex].emotion;

				// Show response text
				newSceneData.currentDialog = newSceneData.character.currentTasks[taskIndex].possibleAnswers[possibleAnswerIndex].response;

				// Mark question as corrrect
				newSceneData.character.currentTasks[taskIndex].correct = true;

				// Add coins 
				this.addCoins(10);

				this.setState({sceneData: newSceneData});

				this.setState({correctAnswerState: true});
				this.turnMicStateOff();

				/*----------------------------------------------
				These actions happen on delay
				----------------------------------------------*/
				setTimeout(function(){
					// Turn off correct answer state
					that.setState({correctAnswerState: false});
					// Push this task into the completedTasks
					newSceneData.character.completedTasks.push(currentTaskData);

					// Remove the task from the tasks array
					// If it's a choice task, search the array for other choices that are linked and remove them
					if (currentTaskData.taskType !== undefined) {
						if (currentTaskData.taskType == "choice") {
							// Search tasks to see if there's another task with the current link
							var indexesToRemove = [];
							allCurrentTasks.forEach(function(task, k) {
								if (task.taskLink == currentTaskData.taskLink) {
									indexesToRemove.push(k);
								}
							});

							// Remove from the end of array all tasks that have matching link
							for (var i = indexesToRemove.length -1; i >= 0; i--) {
		   						allCurrentTasks.splice(indexesToRemove[i],1);
							}
							newSceneData.character.tasks = allCurrentTasks;
						}
					} else {
						// Add task to completed tasks and then delete it from currentTasks
						newSceneData.character.currentTasks.splice(taskIndex, 1);
					}

					// If task has an extension task, add that new task to the Task List
					if (currentTaskData.tasksToQueue == null) {
						// Do nothing
					} else if (currentTaskData.tasksToQueue.length > 0) {
						var currentTasks = newSceneData.character.currentTasks;
						var tasksToQueueIDs = currentTaskData.tasksToQueue;
						var queuedTasks = newSceneData.character.queuedTasks;

						// Add tasks from the queue list to the current list
						newSceneData.character.currentTasks = TaskController.addQueuedTasksToCurrentTasks(currentTasks, tasksToQueueIDs, queuedTasks) 
						
						// Get indexes of tasks from queue to remove
						var indexesToRemove = TaskController.getIndexesToSpliceQueuedTasks(tasksToQueueIDs, queuedTasks)

						// Remove tasks that are no longer in queue
						newSceneData.character.queuedTasks = TaskController.removeTasksfromQueue(indexesToRemove, queuedTasks)
					}

					that.setState({sceneData: newSceneData})
				}, 3000)
				
			/*--------------------------------------------
			When user answers incorrectly
			--------------------------------------------*/

			} else {
				// Turn off Mic recording state
				this.turnMicStateOff();

				// set image to confused
				newSceneData.currentImage = this.state.sceneData.character.emotions.confused;
				
				// Grab random confused phrase
				var confusedPhrasesArray = newSceneData.character.confusedPhrases;
				
				// Randomly pick a confused response
				var randomVar = Math.random();

				// Set text for confusion
				newSceneData.currentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

				// Play confused sound
				this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

				// Activate Feedback Mode
				this.setState({
					feedbackText: userAnswer
				})

				// Turns on feedback mode to reveal what user said
				this.activateFeedbackMode();

				// Set new variables in sceneData
				this.setState({sceneData: newSceneData, wrongAnswerState: true});

				setTimeout(function() {
					// Reset character image to default 
					newSceneData.currentImage = that.state.sceneData.character.emotions.default;
					that.setState({wrongAnswerState: false, sceneData: newSceneData});
				}, 3000);

			}

			// Log data wheter correct or incorrect
			var currentLogData = JSON.parse(JSON.stringify(initialLogData));
			// Log info to SQS
			currentLogData.currentTime = new Date().getTime();
			currentLogData.taskID = currentTaskData.taskID;
			currentLogData.userAnswer = userAnswer;
			currentLogData.eventType = "speechAnswer";
			currentLogData.correct = currentTaskData.correct;
			console.log(currentLogData);
			var logEvent = JSON.stringify(currentLogData);
			$.ajax({
				url: "/logSpeechResponse",
				type: "POST",
				data: logEvent, 
				dataType: "json"
			});
		}
	},
	initializeSounds: function() {
		var SOUND_BASE_PATH = Constants.SOUND_PATH;
		var soundArray = [];
		var sounds = this.state.sceneData.character.sounds;
		var confusedPhrases = this.state.sceneData.character.confusedPhrases;
		
		// Create sound objects for character recordings
		sounds.forEach(function(task, i) {
			var soundObject = {
				"soundID" : task.soundID,
				"soundPath" : SOUND_BASE_PATH + task.soundPath
			};
			soundArray.push(soundObject);
		});

		// Push sounds related to confused responses
		confusedPhrases.forEach(function(phrase, i){
			var soundObject = {
				"soundID" : phrase.soundID,
				"soundPath" : SOUND_BASE_PATH + phrase.soundPath
			};
			soundArray.push(soundObject);
		});

		soundArray.forEach(function(soundFile, i) {
			createjs.Sound.registerSound(soundFile.soundPath, soundFile.soundID);
		});
	},
	playSound: function(soundID) {
		createjs.Sound.play(soundID);
	},
	playConfusedPhrase: function(confusedPhrasesArray) {

		// Randomly pick a confused response
		var randomVar = Math.random();

		// Play confused sound
		this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

		newSceneData.currentImage = this.state.sceneData.character.emotions.confused;

		// Set text for confusion
		newSceneData.currentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

	},
	handleHintClick: function(hintIndex) {
		var that = this;
		var hintText = this.state.sceneData.character.currentTasks[hintIndex].possibleAnswers[0].answers[0];
		this.setState({
			answerFeedbackActive: false,
			hintActive: true,
			currentHintIndex: hintIndex,
			feedbackText: hintText,
			miriIconSrc: "miri/icons/Miri_Icon_Yay.png"
		})

		// return Miri Icon to default after 3s
		setTimeout(function(){
			that.setState({
				miriIconSrc: "miri/icons/Miri_Icon_default.png"
			})
		}, 3000)

	},
	handleDisableHint: function() {
		this.setState({
			hintActive: false,
			currentHintIndex: -1,
			miriIconSrc: "miri/icons/Miri_Icon_default.png"
		})
	},
	handleHintAudio: function(hintAudioToPlay) {
		SpeechSynth.play(hintAudioToPlay, this.state.voicePack);
	},
	changeScenarioMode: function() {
		var newScenarioState = !this.state.scenarioOn;
		this.setState({ scenarioOn: newScenarioState });
	},
	activateFeedbackMode: function() {
		var that = this;
		this.setState({
			hintActive: false,
			currentHintIndex: -1,
			answerFeedbackActive: true,
			miriIconSrc: "miri/icons/Miri_Icon_Oh.png"
		})
		setTimeout(function(){
			that.setState({
				miriIconSrc: "miri/icons/Miri_Icon_default.png"
			})
		}, 3000)
	},
	deactivateFeedbackMode: function() {
		this.setState({
			answerFeedbackActive: false,
			miriIconSrc: "miri/icons/Miri_Icon_default.png"
		})
	},
	turnMicStateOn: function() {
		this.setState({micActive: true})
	},
	turnMicStateOff: function() {
		this.setState({micActive: false})
	},
	addCoins: function(numberCoinsToAdd) {
		var newCoins = this.state.coins + numberCoinsToAdd;
		this.setState({ coins: newCoins });
		
	},
	// Function triggers when user clicks text in dailog box
	handleRepeat: function() {
		this.playSound(this.state.sceneData.currentSoundID);
	},
	// function triggers when user speaks "repeat" into microphone
	handleAskRepeat: function(userAnswer) {
		this.turnMicStateOff();

		if (userAnswer === "Cancel Speech") {
			// Do nothing
		} else {

			var that = this;

			// check if what user said was one of the ask for repeat phrases
			var possibleRepeatPhrases = JSON.parse(JSON.stringify(this.state.sceneData.character.repeatPhrases));
			var correctRepeatAsk = false;
			var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));

			possibleRepeatPhrases.forEach(function(possiblePhrase, i) {
				// Temporarily grab the soundID of this object
				if (userAnswer === possiblePhrase) {
					correctRepeatAsk = true;
				}
			});

			if (correctRepeatAsk) {
				this.handleRepeat();
			} else {
				// Randomly pick a confused response
				var confusedPhrasesArray = this.state.sceneData.character.confusedPhrases;
				var randomVar = Math.random();

				// Show confused emotion
				newSceneData.currentImage = this.state.sceneData.character.emotions.confused;

				// Set text for confusion
				newSceneData.currentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

				// Play confused sound
				this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

				this.setState({wrongAnswerState: true, sceneData: newSceneData });

				setTimeout(function() {
					// Reset character image to default 
					newSceneData.currentImage = that.state.sceneData.character.emotions.default;
					that.setState({wrongAnswerState: false, sceneData: newSceneData });
				}, 2000);
			}
		}
	},
	skipTasks: function() {
		var that = this;
		// Grab relevant data from sceneData
		var allCurrentTasks = TaskController.getCurrentTasks(this.state.sceneData); 
		var taskIDsToQueue = TaskController.getTaskIDsToQueueOfCurrentTasks(this.state.sceneData);
		var allQueuedTasks = TaskController.getQueuedTasks(this.state.sceneData);

		var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));

		// Set completed tasks to current tasks 
		newSceneData.character.completedTasks = newSceneData.character.completedTasks.concat(allCurrentTasks);

		// Remove all completed tasks
		allCurrentTasks = [];

		// Add element from queue to the new queue;
		newSceneData.character.currentTasks = TaskController.addQueuedTasksToCurrentTasks(allCurrentTasks, taskIDsToQueue, allQueuedTasks);

		// Remove appropriate queued tasks
		var spliceIndexes = TaskController.getIndexesToSpliceQueuedTasks(taskIDsToQueue, allQueuedTasks) 
		newSceneData.character.queuedTasks = TaskController.removeTasksfromQueue(spliceIndexes, allQueuedTasks);

		this.setState({sceneData: newSceneData})
	},
	nextScenario: function() {
		if (this.state.scenarioIndex === this.state.sceneData.scenario.length - 1) {
			this.changeScenarioMode();
		} else {
			var newScenarioIndex = this.state.scenarioIndex + 1;
			this.setState({scenarioIndex: newScenarioIndex});
		}
	},
	render: function() {
		var sceneData = this.state.sceneData;

		if (!this.state.sceneData) {
			return <div>Loading Scene</div>
		} else {
			return (
				<div className="gameWrapper col-md-12 col-sm-12 col-xs-12">
					<BackgroundImageContainer
						bgImage={this.state.sceneData.character.location.bg}
						hintActive = {this.state.hintActive} />
					<DialogContainer
						scenarioOn = {this.state.scenarioOn}
						scenarioData = {sceneData.scenario}
						scenarioIndex = {this.state.scenarioIndex}
						charName={this.state.sceneData.character.name}
						currentDialog = {sceneData.currentDialog} 
						hintActive = {this.state.hintActive} 
						onRepeat = {this.handleRepeat} 
						nextScenario = {this.nextScenario}
						assessmentMode = {sceneData.assessmentMode} 
						sceneComplete = {this.state.sceneComplete} />
					<CharacterContainer 
						scenarioOn = {this.state.scenarioOn}
						scenarioData = {this.state.sceneData.scenario}
						scenarioIndex = {this.state.scenarioIndex} 
						charImage = {sceneData.currentImage} 
						silhouette = {sceneData.character.emotions.silhouette}
						hintActive = {this.state.hintActive} 
						correctAnswerState = {this.state.correctAnswerState} 
						wrongAnswerState = {this.state.wrongAnswerState} 
						sceneComplete = {this.state.sceneComplete} />
					<TaskContainer 
						scenarioOn = {this.state.scenarioOn}
						tasks = {this.state.sceneData.character.currentTasks}
						taskLang = {sceneData.currentLanguage} 
						checkAnswer = {this.checkAnswer} 
						hintActive = {this.state.hintActive}
						currentHintIndex = {this.state.currentHintIndex}
						onHintClick = {this.handleHintClick}
						onDisableHint = {this.handleDisableHint}
						answerFeedbackActive = {this.state.answerFeedbackActive}
						deactivateFeedbackMode = {this.deactivateFeedbackMode}
						turnMicStateOn = {this.turnMicStateOn}
						turnMicStateOff = {this.turnMicStateOff}
						micActive = {this.state.micActive} 
						correctAnswerState = {this.state.correctAnswerState}
						wrongAnswerState = {this.state.wrongAnswerState}
						assessmentMode = {sceneData.assessmentMode}
						repeatPhrases = {sceneData.character.repeatPhrases} 
						onHandleAskRepeat = {this.handleAskRepeat} 
						skipTasks = {this.skipTasks}/>
					<FeedbackContainer 
						locationTextEnglish = {this.state.sceneData.character.location.nameEnglish}
						locationTextChinese = {this.state.sceneData.character.location.nameChinese}
						hintActive = {this.state.hintActive} 
						onHintAudio = {this.handleHintAudio}
						coins = {this.state.coins} 
						answerFeedbackActive = {this.state.answerFeedbackActive}
						feedbackText = {this.state.feedbackText} 
						miriIconSrc = {this.state.miriIconSrc} />
					<ResultsContainer 
						sceneComplete = {this.state.sceneComplete} 
						coins = {this.state.coins}
						possibleCoins = {this.state.possibleCoins}
						loadSceneData = {this.loadSceneData} 
						completedTasks = {sceneData.character.completedTasks}
						charName = {sceneData.character.name}
						charProfilePic = {sceneData.character.emotions.default}
						locationEnglish = {sceneData.character.location.nameEnglish}
						locationChinese = {sceneData.character.location.nameChinese}/>
				</div>
			)
		}
	}
});

ReactDOM.render(<QuestionAsker />, document.getElementById('app'));