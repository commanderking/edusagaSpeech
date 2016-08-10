var React = require('react');
var Task = require('./components/Task');
var PropTypes = React.PropTypes;
var SpeechRecognition = require('../helpers/SpeechRecognition');

var TaskContainer = React.createClass({
	getInitialState: function() {
		return { 
		}
	},
	// Task Index should be grabbed from the Task's index
	handleSpeechInput: function(taskIndex) {
		// Turns off any active hints or feedback
		this.props.onDisableHint();
		this.props.deactivateFeedbackMode();
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
	render: function() {
		var that = this;
		var taskObject = this.props.tasks;
		var tasks = taskObject.map(function(task, i){
			return (
				<Task 
					key={i} 
					index={i} 
					taskName={taskObject[i].task}
					onSpeechInput = {that.handleSpeechInput} 
					hintActive = {that.props.hintActive}
					currentHintIndex = {that.props.currentHintIndex}
					onHintClick = {that.props.onHintClick} 
					onDisableHint = {that.props.onDisableHint} />
			)
		})

		if (this.props.scenarioOn === true) {
			return (
				<div className="combinedTaskList col-md-6 col-sm-6 col-xs-6">
					<button className="btn btn-lg btn-success">Start</button>
				</div>
			)
		} else {
			return (
				<div className="combinedTaskList col-md-6 col-sm-6 col-xs-6">
					<ul className="taskList col-md-11 col-sm-11 col-xs-11 nav nav-pills nav-stacked">
						{tasks}
					</ul>
				</div>
			)
		}
	}
});

TaskContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	tasks: PropTypes.array.isRequired,
}

module.exports = TaskContainer;