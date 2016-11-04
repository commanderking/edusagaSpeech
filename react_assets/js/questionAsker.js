var React = require('react');
var ReactDOM = require('react-dom');
var CharacterContainer = require('./questionAsker/CharacterContainer');
var DialogContainer = require('./questionAsker/DialogContainer');
var TaskContainer = require('./questionAsker/TaskContainer');
var BackgroundImageContainer = require('./questionAsker/BackgroundImageContainer');
var FeedbackContainer = require('./questionAsker/FeedbackContainer');
var ResultsContainer = require('./questionAsker/ResultsContainer');
var SpeechSynth = require('./helpers/SpeechSynth');
var TimerContainer = require('./questionAsker/TimerContainer');
var PracticeContainer = require('./questionAsker/PracticeContainer.js');
import {TaskController, SpeechChecker} from './helpers/QuestionAskerHelper';
const Constants = require('./helpers/Constants.js');


var initialLogData = {
	"startTime" : 0,
	"studentID" : "",
	"teacherID" : "",
	"currentTime" : ""
}

var initializeLogData = {
	setStartTime: function() {
		initialLogData.startTime = new Date().getTime();
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
	}
}

var QuestionAsker = React.createClass({
	// feedbackText can be hintText from clicking hint or feedback on what user said
	// lastDialogText is what the character last said. Important when asking for repeat to be able to reference this 
	getInitialState: function() {
		return {
			sceneData: undefined,
			scenarioOn: true,
			practiceMode: false,
			practiceAvailable: false,
			scenarioIndex: 0,
			hintActive: false,

			// When true, user is trying to ask for repeat
			askingForRepeat: false,
			currentHintIndex: -1,
			// Current Task Index affects which tasks are highlighted when the user is answering question
			// It should be reset to -2 when user asks for repeat, else the task who has index of the previously set currentTaskIndex
			// will blink
			currentTaskIndex: -1,
			currentDialog: "",
			currentRewindSoundID: "",
			rewindSoundIScenarioIndex: "",
			lastDialogText: "",
			voicePack: {},
			coins: 0,
			correctAnswers: 0,
			possibleCoins: 0,
			hintsUsed: 0,
			answerFeedbackActive: false,
			feedbackText: "",
			miriIconSrc: "miri/icons/Miri_Icon_default.png",
			micActive: false,
			correctAnswerState: false,
			wrongAnswerState: false,
			sceneComplete: false,
			taskPause: false,
			timeRemaining: 20,
			repeatPhrases: ["请再说一次", "再说一次", "再说一遍", "什么", "你说什么", "重复一次", "重复一下", "对不起"]
		}
	},
	loadSceneData: function() {
		var that = this;
		$.getJSON("/static/data/" + teacher + "/" + activity + ".json", function(data) {})
			.success(function(data) {
				that.resetScene();
				console.log(data.practiceModeStart);

				var practiceAvailable = data.practice !== undefined ? true : false;
				console.log("Practice available " + practiceAvailable);
				that.setState({
					sceneData: data,
					currentDialog: data.initialTaskDialog,
					practiceAvailable: practiceAvailable
				});

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
	},
	checkAnswer: function(userAnswer, taskIndex) {
		// Case where there's an error due to user canceling
		if (userAnswer === "Cancel Speech") {
			// Do nothing
		} else {
			console.log(userAnswer);
			var that = this;

			// Trick to get new instance of sceneData, to not alter the origial state
			var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));
			var allCurrentTasks = TaskController.getCurrentTasks(newSceneData); 
			var currentTaskData = TaskController.getActiveTask(newSceneData, taskIndex);
			var possibleCorrectAnswers = TaskController.getPossibleCorrectAnswers(newSceneData, taskIndex);

			// Add the user answer to the attemptedAnswers (needed for right or wrong);
			newSceneData.character.currentTasks[taskIndex].attemptedAnswers.push(userAnswer);

			// Store the returned data;
			var returnedObject = SpeechChecker.checkAnswer(userAnswer, newSceneData, taskIndex);
			var correctAnswer = returnedObject.answerCorrect;
			var responseSoundID = returnedObject.responseSoundID;
			var possibleAnswerIndex = returnedObject.possibleAnswersIndex;

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
				var newCurrentDialog = newSceneData.character.currentTasks[taskIndex].possibleAnswers[possibleAnswerIndex].response;

				// Mark question as corrrect
				newSceneData.character.currentTasks[taskIndex].correct = true;

				// Add coins 
				this.addCoins(10);

				this.setState({sceneData: newSceneData});

				// Add point to correct answers and set state to correctAnswerState
				this.setState({correctAnswerState: true, 
								correctAnswers: this.state.correctAnswers +1,
								currentDialog: newCurrentDialog,
								lastDialogText: newCurrentDialog});

				// If time mode active, clear the timer countdown
				if (this.state.sceneData.APTimeMode) {
					clearInterval(this.timerInterval);
				}

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
					if (currentTaskData.taskType !== undefined) {


						// If task is an "end" task, then end the scene by removing all other current tasks. 
						if (currentTaskData.taskType === "end") {
							console.log("scene should be over");
							newSceneData.character.currentTasks = [];
						}

						// If it's a choice task, search the array for other choices that are linked and remove them
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

					// If task has a follow up task to queue, add that new task to the Task List
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

					that.setState({sceneData: newSceneData}, that.checkSceneOver);

					if (that.state.sceneData.APTimeMode) {
						that.setState({taskPause: true});
					}

					// If after the task, it should jump back to the scene view, do so
					if (currentTaskData.jumpToScenarioIndex) {
						that.setState({scenarioIndex: currentTaskData.jumpToScenarioIndex})
						that.changeScenarioMode();
					}
				}, 2000)
				
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
				newCurrentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

				// Play confused sound
				this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

				// Activate Feedback Mode
				this.setState({
					feedbackText: userAnswer
				})

				// Turns on feedback mode to reveal what user said
				this.activateFeedbackMode();

				// Set new variables in sceneData
				this.setState({sceneData: newSceneData, 
								wrongAnswerState: true,
								currentDialog: newCurrentDialog
				});


				if (this.state.sceneData.APTimeMode) {
					clearInterval(this.timerInterval);
				}
				setTimeout(function() {
					// Reset character image to default 
					newSceneData.currentImage = that.state.sceneData.character.emotions.default;
					that.setState({wrongAnswerState: false, sceneData: newSceneData});

					if (that.state.sceneData.APTimeMode) {
						that.startTimer();
					}
					
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
			var logEvent = JSON.stringify(currentLogData);
			$.ajax({
				url: "/logSpeechResponse",
				type: "POST",
				data: logEvent, 
				dataType: "json"
			});
		}
	},
	checkAnswerMC: function(taskIndex, choiceIndex) {
		var that = this;
		var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));
		var allCurrentTasks = TaskController.getCurrentTasks(newSceneData);
		var currentTaskData = TaskController.getActiveTask(newSceneData, taskIndex);
		var currentChoiceData = allCurrentTasks[taskIndex].possibleAnswers[choiceIndex];

		// If choice is correct,
			// 1) Show text response
			if (currentChoiceData.correctAnswer === true) {

				/*---------------------------------------------------------------
				TODO: REFACTOR THIS WITH checkANSWER part 
				---------------------------------------------------------------*/
				// Play response voice
				this.playSound(currentChoiceData.soundID);

				// Store sound ID in current Sound ID if player wnats to repeat
				newSceneData.currentSoundID = newSceneData.character.currentTasks[taskIndex].possibleAnswers[choiceIndex].soundID;

				// Adjust character image
				newSceneData.currentImage = newSceneData.character.currentTasks[taskIndex].emotion;

				// Show response text
				var newCurrentDialog = newSceneData.character.currentTasks[taskIndex].possibleAnswers[choiceIndex].response;

				// Mark question as corrrect
				newSceneData.character.currentTasks[taskIndex].correct = true;

				// Add coins 
				console.log(currentChoiceData.coins);
				if (currentChoiceData.coins !== undefined) {
					this.addCoins(currentChoiceData.coins);
				} else {
					this.addCoins(10);
				}

				// this.setState({sceneData: newSceneData});

				// Add point to correct answers and set state to correctAnswerState
				this.setState({
					sceneData: newSceneData,
					correctAnswerState: true, 
					correctAnswers: this.state.correctAnswers +1,
					currentDialog: newCurrentDialog,
					lastDialogText: newCurrentDialog
				});

				// 3) Remove task from currentTasks

				setTimeout(function(){
					// Turn off correct answer state
					that.setState({correctAnswerState: false});
					// Push this task into the completedTasks IF COINS WERE EARNED
					if (currentChoiceData.coins !== 0) {
						newSceneData.character.completedTasks.push(currentTaskData);
					}

					// Remove the task from the tasks array
					if (currentTaskData.taskType !== undefined) {


						// If task is an "end" task, then end the scene by removing all other current tasks. 
						if (currentTaskData.taskType === "end") {
							console.log("scene should be over");
							newSceneData.character.currentTasks = [];
						} else if (currentTaskData.taskType === "multipleChoice") {
							// Add task to completed tasks and then delete it from currentTasks
							newSceneData.character.currentTasks.splice(taskIndex, 1);	
							console.log(newSceneData.character.currentTasks);						
						}
					} else {
					}

					// If task has a follow up task to queue, add that new task to the Task List
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

					that.setState({sceneData: newSceneData}, that.checkSceneOver);

					if (that.state.sceneData.APTimeMode) {
						that.setState({taskPause: true});
					}

					// If after the task, it should jump back to the scene view, do so
					if (currentTaskData.jumpToScenarioIndex) {
						that.setState({scenarioIndex: currentTaskData.jumpToScenarioIndex})
						that.changeScenarioMode();
					}
				}, 10)

			} else {				
				// set image to confused
				newSceneData.currentImage = this.state.sceneData.character.emotions.confused;

				newSceneData.currentSoundID = newSceneData.character.currentTasks[taskIndex].possibleAnswers[choiceIndex].soundID;

				var newCurrentDialog = newSceneData.character.currentTasks[taskIndex].possibleAnswers[choiceIndex].response;

				// Play confused sound
				this.playSound(currentChoiceData.soundID);

				// MC SPECIFIC - Remove the wrong selected from the current choices (possibleAnswers);
				var newPossibleChoices = currentTaskData.possibleAnswers.splice(choiceIndex, 1);
				newSceneData.character.currentTasks[taskIndex].possibleAnswers = currentTaskData.possibleAnswers;

				this.setState({
					sceneData: newSceneData,
					currentDialog: newCurrentDialog,
					lastDialogText: newCurrentDialog
				});

			}

	},
	checkSceneOver: function() {
		// Logic for when scene is over
		if (this.state.sceneData.character.currentTasks.length === 0 && this.state.sceneComplete === false) {
			var that = this;

			// Calculate number of coins possible
			var totalCoins = 10 * (this.state.sceneData.character.completedTasks.length);
			this.setState({
				possibleCoins: totalCoins
			});

			// Post completed progress results
			var studentCompletedProgress = {};
			// Pull teacher variable set in html page if possible
			try {
				studentCompletedProgress.teacherID = teacher;			
			} catch(err) {
				studentCompletedProgress.teacherID = "Unknown teacher";
			}

			studentCompletedProgress.studentID = initialLogData.studentID;
			var allTaskData = [];

			var timeInSeconds = Math.floor((new Date().getTime() - initialLogData.startTime) / 1000);

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
			studentCompletedProgress.activityID = this.state.sceneData.activityID;
			studentCompletedProgress.activityName = this.state.sceneData.activityName;

			var logEvent = JSON.stringify(studentCompletedProgress);
			$.ajax({
				url: "/logStudent",
				type: "POST",
				data: logEvent, 
				dataType: "json"
			});

			// If time mode active, clear the timer countdown
			if (this.state.sceneData.APTimeMode) {
				clearInterval(this.timerInterval);
			}

			setTimeout(function(){
				that.setState({sceneComplete: true})
			}, 700)
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

		// Track hints used
		// If clause for older versions which don't have hintUsed defined
		if (this.state.sceneData.character.currentTasks[hintIndex].hintUsed !== undefined) {
			var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));

			// Check if hint was already used If so, then let student look for free again (no coin penalty)
			var hintUsed = newSceneData.character.currentTasks[hintIndex].hintUsed;
			if (hintUsed === true) {
			} else {
				this.subCoins(5);
				newSceneData.character.currentTasks[hintIndex].hintUsed = true;
				var numberHintsUsed = this.state.hintsUsed + 1;
				this.setState({sceneData: newSceneData, hintsUsed: numberHintsUsed});
			}
		}

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
	playSpeechSynth: function(hintAudioToPlay) {
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
	subCoins: function(numberCoinsToSub) {
		var newCoins = this.state.coins - numberCoinsToSub;
		if (newCoins < 0) {
			newCoins = 0;
		}
		this.setState({ coins: newCoins});
	},
	// Changes whether user is asking or not asking for repeat
	activateRepeatMode: function() {
		console.log("Repeat mode activated");
		this.setState({askingForRepeat: true});
	},
	deactivateRepeatMode: function() {
		this.setState({askingForRepeat: false});
	},
	// Function triggers when user correct says/asks for repeat
	handleRepeat: function() {
		this.playSound(this.state.sceneData.currentSoundID);
		this.setState({currentDialog: this.state.lastDialogText})
	},
	// function triggers when user say something into the mic with intentioning of asking for repeat
	handleAskRepeat: function(userAnswer) {
		this.turnMicStateOff();

		if (userAnswer === "Cancel Speech") {
			// Do nothing
			console.log("Repeat speech canceled");
			this.deactivateRepeatMode();

		} else {
			var that = this;

			// check if what user said was one of the ask for repeat phrases
			var possibleRepeatPhrases = JSON.parse(JSON.stringify(this.state.repeatPhrases));
			var correctRepeatAsk = false;
			var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));

			possibleRepeatPhrases.forEach(function(possiblePhrase, i) {
				// Temporarily grab the soundID of this object
				if (userAnswer.indexOf(possiblePhrase) >= 0) {
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
				var newCurrentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

				// Play confused sound
				this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

				this.setState({wrongAnswerState: true, sceneData: newSceneData, currentDialog: newCurrentDialog});

				setTimeout(function() {
					// Reset character image to default 
					newSceneData.currentImage = that.state.sceneData.character.emotions.default;
					that.setState({wrongAnswerState: false, sceneData: newSceneData });
				}, 2000);
			}
			this.deactivateRepeatMode();

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

		// Check if no more tasks remaining
		this.setState({sceneData: newSceneData}, this.checkSceneOver)

		if (that.state.sceneData.APTimeMode) {
			that.setState({taskPause: true});
			clearInterval(this.timerInterval);
		}
	},
	resumeTasks: function() {
		this.setState({ taskPause: false});
		this.setState({ timeRemaining: 20});
		this.startTimer();
	},
	startTimer: function() {
		this.timerInterval = setInterval(this.updateTime, 1000);
		// this.updateTime();

	},
	updateTime: function() {
		// !this.state.micActive allows student to finish last response before moving to delay screen
		if (this.state.timeRemaining <= 0 && !this.state.micActive) {
			this.skipTasks();
		} else {
			var newTime = this.state.timeRemaining - 1;
			this.setState({ timeRemaining: newTime});
		}
	},
	nextScenario: function() {
		var scenarioIndex = this.state.scenarioIndex;
		var scenarioData = this.state.sceneData.scenario;

		var storeRewindSound = function() {
			if (scenarioData[this.state.scenarioIndex].saveSoundForRewind) {
				this.setRewindScenarioSound(scenarioData[this.state.scenarioIndex].soundID);
			}
		}

		if (scenarioIndex === this.state.sceneData.scenario.length - 1 || this.state.sceneData.scenario[scenarioIndex].jumpToTasks === true) {
			this.changeScenarioMode();
		} else {
			var newScenarioIndex = this.state.scenarioIndex + 1;
			this.setState({scenarioIndex: newScenarioIndex}, storeRewindSound);
		
		}
	},
	getCurrentScenarioObject: function() {
		var scenarioData = this.state.sceneData.scenario;
		return scenarioData[this.state.scenarioIndex];
	},
	playRewindScenarioSound: function() {
		this.playSound(this.state.currentRewindSoundID);
	},
	setRewindScenarioSound: function(soundID) {
		this.setState({currentRewindSoundID: soundID });
	},
	setCurrentTaskIndex: function(newIndex) {
		this.setState({ currentTaskIndex: newIndex})
	},
	changePracticeMode: function() {
		this.setState({ practiceMode: !this.state.practiceMode});
	},
	turnOffPracticeOption: function() {
		this.setState({practiceAvailable: false});
	},
	render: function() {
		var sceneData = this.state.sceneData;

		if (!this.state.sceneData) {
			return <div>Loading Scene</div>
		} else {

			var currentScenarioData = this.getCurrentScenarioObject();
			// Timer appears if APTimeMode is on in sceneData
			var timer = this.state.sceneData.APTimeMode === true ? <TimerContainer 
																		taskPause = {this.state.taskPause}
																		timeRemaining = {this.state.timeRemaining}
																		scenarioOn = {this.state.scenarioOn} /> : null;

			return (
				<div className="gameWrapper col-md-12 col-sm-12 col-xs-12">
					<BackgroundImageContainer
						bgImage = {this.state.sceneData.character.location.bg}
						hintActive = {this.state.hintActive} />
					<PracticeContainer 
						vocabList = {this.state.sceneData.practice}
						practiceMode = {this.state.practiceMode} 
						changePracticeMode = {this.changePracticeMode}
						playSpeechSynth = {this.playSpeechSynth}/>
					<DialogContainer
						// Variables related to display scenario text and playing sounds
						scenarioOn = {this.state.scenarioOn}
						scenarioData = {sceneData.scenario}
						scenarioIndex = {this.state.scenarioIndex}
						currentScenarioData = {currentScenarioData}
						playSound = {this.playSound}
						charName={this.state.sceneData.character.name}
						currentDialog = {this.state.currentDialog} 
						hintActive = {this.state.hintActive} 
						onRepeat = {this.handleRepeat} 
						nextScenario = {this.nextScenario}
						setRewindScenarioSound = {this.setRewindScenarioSound}
						playRewindScenarioSound = {this.playRewindScenarioSound}
						assessmentMode = {sceneData.assessmentMode}
						sceneComplete = {this.state.sceneComplete}
						currentRewindSoundID = {this.state.currentRewindSoundID}
						practiceMode = {this.state.practiceMode} 
						changePracticeMode = {this.changePracticeMode}
						practiceAvailable = {this.state.practiceAvailable}
						turnOffPracticeOption={this.turnOffPracticeOption}/>
					<CharacterContainer 
						scenarioOn = {this.state.scenarioOn}
						scenarioData = {this.state.sceneData.scenario}
						scenarioIndex = {this.state.scenarioIndex} 
						charImage = {sceneData.currentImage} 
						silhouette = {sceneData.character.emotions.silhouette}
						hintActive = {this.state.hintActive} 
						correctAnswerState = {this.state.correctAnswerState} 
						wrongAnswerState = {this.state.wrongAnswerState} 
						sceneComplete = {this.state.sceneComplete}
						practiceMode = {this.state.practiceMode} />
					<TaskContainer
						scenarioOn = {this.state.scenarioOn}
						tasks = {this.state.sceneData.character.currentTasks}
						taskLang = {sceneData.currentLanguage} 
						checkAnswer = {this.checkAnswer} 
						checkAnswerMC = {this.checkAnswerMC}
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
						onHandleAskRepeat = {this.handleAskRepeat} 
						skipTasks = {this.skipTasks}
						taskPause = {this.state.taskPause}
						resumeTasks = {this.resumeTasks} 

						// Give component ability to manipulate currentTaskIndex
						currentTaskIndex = {this.state.currentTaskIndex} 
						setCurrentTaskIndex = {this.setCurrentTaskIndex} />
					<FeedbackContainer 
						scenarioOn = {this.state.scenarioOn}
						locationTextEnglish = {this.state.sceneData.character.location.nameEnglish}
						locationTextChinese = {this.state.sceneData.character.location.nameChinese}
						hintActive = {this.state.hintActive} 
						onHintAudio = {this.playSpeechSynth}
						coins = {this.state.coins} 
						answerFeedbackActive = {this.state.answerFeedbackActive}
						feedbackText = {this.state.feedbackText} 
						miriIconSrc = {this.state.miriIconSrc} 
						repeatActive = {this.state.repeatActive}
						correctAnswerState = {this.state.correctAnswerState} 
						micActive = {this.state.micActive} 
						wrongAnswerState = {this.state.wrongAnswerState} 
						skipTasks = {this.skipTasks} 
						handleAskRepeat = {this.handleAskRepeat}
						onDisableHint = {this.handleDisableHint}
						deactivateFeedbackMode = {this.deactivateFeedbackMode}
						turnMicStateOn = {this.turnMicStateOn}

						// Repeat mode related 
						repeatPhrases = {this.state.repeatPhrases}
						askingForRepeat = {this.state.askingForRepeat}
						deactivateRepeatMode = {this.deactivateRepeatMode}
						activateRepeatMode = {this.activateRepeatMode}
						taskLang = {sceneData.currentLanguage} 

						// Give component ability to manipulate setCurrentTaskIndex
						tasks = {this.state.sceneData.character.currentTasks}
						currentTaskIndex = {this.state.currentTaskIndex} 
						setCurrentTaskIndex = {this.setCurrentTaskIndex} 

						currentScenarioData = {currentScenarioData} 

						practiceMode = {this.state.practiceMode}/>
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
					{timer}
				</div>
			)
		}
	}
});

ReactDOM.render(<QuestionAsker />, document.getElementById('app'));