var React = require('react');
var ReactDOM = require('react-dom');
var CharacterContainer = require('./questionAsker/CharacterContainer');
var DialogContainer = require('./questionAsker/DialogContainer');
var TaskContainer = require('./questionAsker/TaskContainer');
var BackgroundImageContainer = require('./questionAsker/BackgroundImageContainer');
var FeedbackContainer = require('./questionAsker/FeedbackContainer');
var SpeechSynth = require('./helpers/SpeechSynth');
var TransitionContainer = require('./questionAsker/TransitionContainer');
const Constants = require('./helpers/Constants.js');

var QuestionAsker = React.createClass({
	// feedbackText can be hintText from clicking hint or feedback on what user said
	getInitialState: function() {
		return {
			sceneData: undefined,
			scenarioOn: true,
			hintActive: false,
			currentHintIndex: null,
			voicePack: {},
			coins: 0,
			answerFeedbackActive: false,
			feedbackText: "",
			miriIconSrc: "/static/images/miri/icons/Miri_Icon_default.png",
			micActive: false,
			correctAnswerState: false,
			wrongAnswerState: false
		}
	},
	loadSceneData: function() {
		var that = this;
		$.getJSON("/static/data/" + teacher + "/" + activity + ".json", function(data) {})
			.success(function(data) {
				that.setState({
					sceneData: data
			});

			// Load all the sounds that are in the scene
			that.initializeSounds();
			// Load voice pack
			// voice list in browser loaded asynchornously, so can't be grabbed on page load
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
		var that = this;
		var correctAnswer = false;
		var responseSoundID;
		var possibleAnswerIndex;

		// Trick to get new instance of sceneData, to not alter the origial state
		var newSceneData = JSON.parse(JSON.stringify(this.state.sceneData));
		var allCurrentTasks = this.state.sceneData.character.tasks;
		var currentTaskData = allCurrentTasks[taskIndex];
		var possibleCorrectAnswers = currentTaskData.possibleAnswers;

		// Check if user's answers contains any of the possible answers
		if (currentTaskData.completeMatchOnly === true) {
			possibleCorrectAnswers.forEach(function(possibleAnswerObject, i) {
				// Temporarily grab the soundID of this object
				var tempSoundID = possibleAnswerObject.soundID;
				possibleAnswerObject.answers.forEach(function(possibleWord){
					if (userAnswer === possibleWord) {
						correctAnswer = true;
						responseSoundID = tempSoundID;
						possibleAnswerIndex = i;
					}
				})
			});
		} else {
			possibleCorrectAnswers.forEach(function(possibleAnswerObject, i) {
				var tempSoundID = possibleAnswerObject.soundID;
				possibleAnswerObject.answers.forEach(function(possibleWord){
					if (userAnswer.indexOf(possibleWord) >= 0) {
						correctAnswer = true;
						responseSoundID = tempSoundID;
						possibleAnswerIndex = i;
					}
				})

			})
		}
		if (correctAnswer) {

			/*----------------------------------------------
			These actions immediately happen
			----------------------------------------------*/

			// Play response voice
			this.playSound(responseSoundID);

			// Store sound ID in current Sound ID if player wnats to repeat
			newSceneData.currentSoundID = newSceneData.character.tasks[taskIndex].possibleAnswers[possibleAnswerIndex].soundID;

			// Adjust character image
			newSceneData.currentImage = newSceneData.character.tasks[taskIndex].emotion;

			// Show response text
			newSceneData.currentDialog = newSceneData.character.tasks[taskIndex].possibleAnswers[possibleAnswerIndex].response;

			// Add coins 
			this.addCoins(10);

			this.setState({sceneData: newSceneData});

			this.setState({correctAnswerState: true});
			this.turnMicStateOff();

			/*----------------------------------------------
			These actions happen on delay of 1s
			----------------------------------------------*/

			var newerSceneData = JSON.parse(JSON.stringify(newSceneData));

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
			var feedback = userAnswer; 
			this.setState({
				feedbackText: userAnswer
			})

			// Turns on feedback mode to reveal what user said
			this.activateFeedbackMode();

			// Set new variables in sceneData
			this.setState({sceneData: newSceneData});

			this.setState({wrongAnswerState: true});

			setTimeout(function() {
				// Reset character image to default 
				newSceneData.currentImage = that.state.sceneData.character.emotions.default;
				that.setState({wrongAnswerState: false});
				that.setState({sceneData: newSceneData});
			}, 3000);

		}

		/*---------------------------------------------
		For both correct and incorrect answers 
		---------------------------------------------*/


		// Refresh the sceneData with newSceneData after 3 seconds
		// return Miri Icon to default after 3s
		// this.setState({sceneData: newSceneData});

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
		var hintText = this.state.sceneData.character.tasks[hintIndex].possibleAnswers[0].answers[0];
		this.setState({
			answerFeedbackActive: false,
			hintActive: true,
			currentHintIndex: hintIndex,
			feedbackText: hintText,
			miriIconSrc: "/static/images/miri/icons/Miri_Icon_Yay.png"
		})

		// return Miri Icon to default after 3s
		setTimeout(function(){
			that.setState({
				miriIconSrc: "/static/images/miri/icons/Miri_Icon_default.png"
			})
		}, 3000)

	},
	handleDisableHint: function() {
		this.setState({
			hintActive: false,
			currentHintIndex: null,
			miriIconSrc: "/static/images/miri/icons/Miri_Icon_default.png"
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
			currentHintIndex: null,
			answerFeedbackActive: true,
			miriIconSrc: "/static/images/miri/icons/Miri_Icon_Oh.png"
		})
		setTimeout(function(){
			that.setState({
				miriIconSrc: "/static/images/miri/icons/Miri_Icon_default.png"
			})
		}, 3000)
	},
	deactivateFeedbackMode: function() {
		this.setState({
			answerFeedbackActive: false,
			miriIconSrc: "/static/images/miri/icons/Miri_Icon_default.png"
		})
	},
	turnMicStateOn: function() {
		this.setState({micActive: true})
	},
	turnMicStateOff: function() {
		this.setState({micActive: false})
	},
	addCoins: function(numberCoinsToAdd) {
		newCoins = this.state.coins + numberCoinsToAdd;
		this.setState({ coins: newCoins });
	},
	handleRepeat: function() {
		console.log(this.state.sceneData.currentSoundID);
		this.playSound(this.state.sceneData.currentSoundID);
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
						scenarioIndex = {sceneData.scenarioIndex}
						charName={this.state.sceneData.character.name}
						currentDialog = {sceneData.currentDialog} 
						hintActive = {this.state.hintActive} 
						onRepeat = {this.handleRepeat} 
						changeScenarioMode = {this.changeScenarioMode}/>
					<CharacterContainer 
						scenarioOn = {this.state.scenarioOn}
						scenarioData = {this.state.sceneData.scenario}
						scenarioIndex = {this.state.sceneData.scenarioIndex} 
						charImage = {sceneData.currentImage} 
						silhouette = {sceneData.character.emotions.silhouette}
						hintActive = {this.state.hintActive} 
						correctAnswerState = {this.state.correctAnswerState} 
						wrongAnswerState = {this.state.wrongAnswerState} />
					<TaskContainer 
						scenarioOn = {this.state.scenarioOn}
						tasks = {this.state.sceneData.character.tasks}
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
						wrongAnswerState = {this.state.wrongAnswerState} />
					<FeedbackContainer 
						locationTextEnglish = {this.state.sceneData.character.location.nameEnglish}
						locationTextChinese = {this.state.sceneData.character.location.nameChinese}
						hintActive = {this.state.hintActive} 
						onHintAudio = {this.handleHintAudio}
						coins = {this.state.coins} 
						answerFeedbackActive = {this.state.answerFeedbackActive}
						feedbackText = {this.state.feedbackText} 
						miriIconSrc = {this.state.miriIconSrc} />
				</div>
			)
		}
	}
});

ReactDOM.render(<QuestionAsker />, document.getElementById('app'));