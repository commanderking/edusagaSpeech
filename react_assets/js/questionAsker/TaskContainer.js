var React = require('react');
var Task = require('./components/Task');
var PropTypes = React.PropTypes;
var SpeechRecognition = require('../helpers/SpeechRecognition');
var TaskIcon = require('./components/TaskIcon');
var TaskText = require('./components/TaskText');

var TaskContainer = React.createClass({
	getInitialState: function() {
		return {
			currentTaskIndex: -1
		}
	},
	// Task Index should be grabbed from the Task's index
	handleSpeechInput: function(taskIndex) {
		// Turns off any active hints or feedback
		this.props.onDisableHint();
		this.props.deactivateFeedbackMode();

		// If mic active, turn it off
		if (this.props.micActive) {
			this.props.turnMicStateOff();
			return;
		}
		// Activate MicActive State
		this.props.turnMicStateOn();
		this.setState ({currentTaskIndex: taskIndex});

		var that = this;
		SpeechRecognition.activateSpeech(this.props.tasks[taskIndex].possibilities, this.props.taskLang)
			.then(function(userAnswer) {
				// Need to set var here, otherwise loses it in setState
				var answer = userAnswer;
				if (userAnswer !== null) {
					that.props.checkAnswer(userAnswer, taskIndex);
				}
			}
		);
	},
	handleAskForRepeat: function(taskIndex) {
		var that = this;

		this.props.onDisableHint();
		this.props.deactivateFeedbackMode();
		this.props.turnMicStateOn();

		this.setState({currentTaskIndex: taskIndex});
		SpeechRecognition.activateSpeech(this.props.repeatPhrases, this.props.taskLang)
			.then(function(userAnswer) {
				that.props.onHandleAskRepeat(userAnswer);
			})

	},
	render: function() {
		var that = this;
		var taskObject = this.props.tasks;
		var skipButtonIndex = -2;
		var tasks = taskObject.map(function(task, i){
			return (
				<Task 
					key={taskObject[i].task} 
					index={i}
					taskName={taskObject[i].task}
					onSpeechInput = {that.handleSpeechInput} 
					hintActive = {that.props.hintActive}
					currentHintIndex = {that.props.currentHintIndex}
					onHintClick = {that.props.onHintClick} 
					onDisableHint = {that.props.onDisableHint} 
					micActive = {that.props.micActive} 
					currentTaskIndex = {that.state.currentTaskIndex} 
					correctAnswerState = {that.props.correctAnswerState} 
					wrongAnswerState = {that.props.wrongAnswerState} 
					assessmentMode = {that.props.assessmentMode} />
			)
		})

		// Special class added to the Ask for Repeat button if hintACtive
		var repeatDivClass = this.props.hintActive ? "taskDiv taskDivDisabled" : "taskDiv taskDivNormalState";

		if (this.props.scenarioOn === true) {
			return null;
		} else {
			return (
				<div className="combinedTaskList col-md-6 col-sm-6 col-xs-6">
					<ul className="taskList col-md-11 col-sm-11 col-xs-11 nav nav-pills nav-stacked">
				          {tasks}
				          <div className={repeatDivClass}>
				          	<TaskIcon 
								correctAnswerState={this.props.correctAnswerState}
								wrongAnswerState = {this.props.wrongAnswerState} 
								micActive = {this.props.micActive} 
								index = {skipButtonIndex}
								currentTaskIndex = {this.state.currentTaskIndex} />
				          	<TaskText 
								className="taskText" 
								index={skipButtonIndex} 
								currentTaskIndex = {this.state.currentTaskIndex}
								onSpeechInput = {this.handleAskForRepeat}
								taskTextToDisplay = "Ask for repeat"
								correctAnswerState={this.props.correctAnswerState} />
				          </div>
				          <button type="button" 
				          		className="btn-skip btn btn-danger"
				          		onClick={this.props.skipTasks}>Skip Current Questions</button>
					</ul>
				</div>
			)
		}
	}
});

TaskContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	tasks: PropTypes.array.isRequired,
	assessmentMode: PropTypes.bool.isRequired,
	repeatPhrases: PropTypes.array.isRequired
}

module.exports = TaskContainer;