var React = require('react');
var ReactDOM = require('react-dom');
var CharacterContainer = require('./questionAsker/CharacterContainer');
var DialogContainer = require('./questionAsker/DialogContainer');
var TaskContainer = require('./questionAsker/TaskContainer');
var BackgroundImageContainer = require('./questionAsker/BackgroundImageContainer');
var FeedbackContainer = require('./questionAsker/FeedbackContainer');
var SpeechSynth = require('./helpers/SpeechSynth');
const IMAGE_BASE_PATH = './static/images/'

var QuestionAsker = React.createClass({
	getInitialState: function() {
		return {
			sceneData: undefined,
			hintActive: false,
			currentHintIndex: null,
			voicePack: {}
		}
	},
	loadSceneData: function() {
		var that = this;
		$.getJSON("./static/data/demo" + demoLanguage + ".json", function(data) {})
			.success(function(data) {
				that.setState({
					sceneData: data
			});

			// Load all the sounds that are in the scene
			that.initializeSounds();
			// Load voice pack
			// voice list loaded asynchornously, so can't be grabbed on page load
			// http://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-of-chrome-web-speech-api
			// Wait until the voiceslist changes and then initialize speechSynth
			// CARE: Will not work correctly if called on "render"
			window.speechSynthesis.onvoiceschanged = function() {
				// window.speechSynthesis.getVoices();
				that.setState({
					voicePack: SpeechSynth.init(that.state.sceneData.currentLanguage)
				});
			};
		})
	},
	componentDidMount: function() {
		this.loadSceneData();
	},
	componentWillReceiveProps: function() {
		this.loadSceneData();
	},
	checkAnswer: function(userAnswer, taskIndex) {
		var correctAnswer = false;
		var newSceneData = this.state.sceneData;
		var allCurrentTasks = this.state.sceneData.character.tasks;
		var currentTaskData = allCurrentTasks[taskIndex];
		var possibleCorrectAnswers = currentTaskData.possibilities;

		console.log(currentTaskData);
		// Check is userAnswer matches any possible answer
		possibleCorrectAnswers.forEach(function(possibleWord) {
			if (userAnswer === possibleWord) {
				correctAnswer = true;
			}
		})
		if (correctAnswer) {
			// Play response voice
			this.playSound(newSceneData.character.tasks[taskIndex].soundID);

			// Adjust character image
			newSceneData.currentImage = IMAGE_BASE_PATH + newSceneData.character.tasks[taskIndex].emotion;

			// Show response text
			newSceneData.currentDialog = newSceneData.character.tasks[taskIndex].response;

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
							console.log(task.task + task.taskLink);			
						}
					});
					for (var i = indexesToRemove.length -1; i >= 0; i--) {
   						allCurrentTasks.splice(indexesToRemove[i],1);
					}
					newSceneData.character.tasks = allCurrentTasks;
				}
			} else {
				// Add task to completed tasks and then delete it from currentTasks
				newSceneData.character.tasks.splice(taskIndex, 1);
			}



			// If task has an extension task, add that new task to the Task List
			if (currentTaskData.extensionTasks == null) {
				// Do nothing
			} else if (currentTaskData.extensionTasks.length > 0) {
				currentTaskData.extensionTasks.forEach(function(extensionTask, j) {
					newSceneData.character.tasks.push(currentTaskData.extensionTasks[j]);
				})
			}

		} else {
			newSceneData.currentImage = IMAGE_BASE_PATH + this.state.sceneData.character.emotions.confused;
			// Grab random confused phrase
		
			var confusedPhrasesArray = newSceneData.character.confusedPhrases;
			
			// Randomly pick a confused response
			var randomVar = Math.random();

			// Set text for confusion
			newSceneData.currentDialog = confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].response;

			// Play confused sound
			this.playSound(confusedPhrasesArray[Math.floor(randomVar*confusedPhrasesArray.length)].soundID);

		}

		// Refresh state with adjusted sceneData
		this.setState({sceneData: newSceneData})

	},
	initializeSounds: function() {
		var SOUND_BASE_PATH = './static/audio/';
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
		this.setState({
			hintActive: true,
			currentHintIndex: hintIndex
		})
	},
	handleDisableHint: function() {
		this.setState({
			hintActive: false,
			currentHintIndex: null
		})
	},
	handleHintAudio: function(hintAudioToPlay) {
		SpeechSynth.play(hintAudioToPlay, this.state.voicePack);
	},
	render: function() {
		var sceneData = this.state.sceneData;

		// Store Hint Text if Hint state is active to pass to componenets
		var hintText = undefined;
		if (this.state.hintActive) {
			hintText = sceneData.character.tasks[this.state.currentHintIndex].possibilities[0];
		}

		if (!this.state.sceneData) {
			return <div>Loading Scene</div>
		} else {
			return (
				<div className="gameWrapper col-md-12 col-sm-12 col-xs-12">
					<BackgroundImageContainer
						bgImage={this.state.sceneData.character.location.bg}
						hintActive = {this.state.hintActive} />
					<DialogContainer
						scenarioOn = {sceneData.scenarioOn}
						scenarioData = {sceneData.scenario}
						scenarioIndex = {sceneData.scenarioIndex}
						charName={this.state.sceneData.character.name}
						currentDialog = {sceneData.currentDialog} 
						hintActive = {this.state.hintActive} />
					<CharacterContainer 
						scenarioOn = {this.state.sceneData.scenarioOn}
						scenarioData = {this.state.sceneData.scenario}
						scenarioIndex = {this.state.sceneData.scenarioIndex} 
						charImage = {sceneData.currentImage}/>
					<TaskContainer 
						scenarioOn = {sceneData.scenarioOn}
						tasks = {this.state.sceneData.character.tasks}
						taskLang = {sceneData.currentLanguage} 
						checkAnswer = {this.checkAnswer} 
						hintActive = {this.state.hintActive}
						currentHintIndex = {this.state.currentHintIndex}
						onHintClick = {this.handleHintClick}
						onDisableHint = {this.handleDisableHint} />
					<FeedbackContainer 
						hintActive = {this.state.hintActive} 
						hintText = {hintText}
						onHintAudio = {this.handleHintAudio} />
				</div>
			)
		}
	}
});

ReactDOM.render(<QuestionAsker />, document.getElementById('app'));