var React = require('react');
var Task = require('./components/Task');
var PropTypes = React.PropTypes;
var SpeechRecognition = require('../helpers/SpeechRecognition');
var TaskIcon = require('./components/TaskIcon');
var TaskText = require('./components/TaskText');

var TaskContainer = React.createClass({
	// Task Index should be grabbed from the Task's index property
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
		this.props.setCurrentTaskIndex(taskIndex);

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
	handleMultipleChoiceSelection: function(taskIndex, choiceIndex) {
		this.props.checkAnswerMC(taskIndex, choiceIndex);
	},
	render: function() {
		var that = this;

		var taskObject = this.props.tasks;
		var skipButtonIndex = -2;

		var tasks = taskObject.map(function(task, i){

			// If multiple choice task, loop through possibleChoices and display each one as a choice
			if (task.taskType === "multipleChoice") {
				// Set the currentTaskIndex since only one task will be presented
				var multipleChoices = task.possibleAnswers.map(function(possibleChoice, j) {
					return (
						<Task 
							key={possibleChoice.choiceText}
							index={j}
							taskIndex={i}
							choiceIndex={j}
							taskName={possibleChoice.choiceText}
							possibleChoiceObject = {possibleChoice}
							taskType={taskObject[i].taskType}
							onSpeechInput = {that.handleSpeechInput}
							onMultipleChoiceSelection = {that.handleMultipleChoiceSelection}
							hintActive = {that.props.hintActive}
							currentHintIndex = {that.props.currentHintIndex}
							onHintClick = {that.props.onHintClick} 
							onDisableHint = {that.props.onDisableHint} 
							micActive = {that.props.micActive} 
							currentTaskIndex = {that.props.currentTaskIndex} 
							correctAnswerState = {that.props.correctAnswerState} 
							wrongAnswerState = {that.props.wrongAnswerState} 
							assessmentMode = {that.props.assessmentMode} />
					)	
				})
				return multipleChoices;
			} else {
				return (
					<Task 
						key={taskObject[i].task}
						index={i}
						taskName={taskObject[i].task}
						taskType={taskObject[i].taskType}
						onSpeechInput = {that.handleSpeechInput} 
						hintActive = {that.props.hintActive}
						currentHintIndex = {that.props.currentHintIndex}
						onHintClick = {that.props.onHintClick} 
						onDisableHint = {that.props.onDisableHint} 
						micActive = {that.props.micActive} 
						currentTaskIndex = {that.props.currentTaskIndex} 
						correctAnswerState = {that.props.correctAnswerState} 
						wrongAnswerState = {that.props.wrongAnswerState} 
						assessmentMode = {that.props.assessmentMode} />
				)			
			}

		})
		if (this.props.scenarioOn === true) {
			return null;
		} 
		// If teacher wants to pause between each tasks for timing purposes
		else if (this.props.taskPause === true && this.props.micActive === false && this.props.wrongAnswerState === false) {
			return (
					<div className="combinedTaskList col-md-6 col-sm-6 col-xs-6">
						<div className="taskPaused">
							<h3>When ready, click the "Ready!" button to continue to the next task. You will have 20 seconds to respond.</h3>
							<h3>During the task, remember to click the task itself before saying anything.</h3>
							<button 
								onClick={this.props.resumeTasks} 
								className="btn btn-info btn-lg">
								Ready!
							</button>

						</div>
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
	assessmentMode: PropTypes.bool.isRequired,
}

module.exports = TaskContainer;