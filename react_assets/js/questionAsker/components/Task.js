var React = require('react')
var PropTypes = React.PropTypes;
var TaskIcon = require('./TaskIcon')
var TaskText = require('./TaskText');
var HintButton = require('./HintButton');


var Task = React.createClass({
	render: function() {
		var taskDivClass = "taskDiv taskDivNormalState"

		// Change Task Div based on different modes
		if (this.props.hintActive) {
			// If hint is clicked, fade out and disable task
			taskDivClass = this.props.index === this.props.currentHintIndex ? 'taskDiv taskDivActive' : 'taskDiv taskDivDisabled';
		} else {
			// If user clicks a task, change UI of the active task to be higlhighted
			if ((this.props.micActive || this.props.correctAnswerState || this.props.wrongAnswerState) && this.props.index === this.props.currentTaskIndex) {
				taskDivClass = 'taskDiv taskDivMicActive';
			}
		}

		// For case of Multiple Choice Selection
		if (this.props.taskType === "multipleChocie") {
			console.log("multipleChoice");

		}

			return (
				<li className='inactiveLink' role='presentation' data-index={this.props.index}>
					<div className={taskDivClass} data-index={this.props.index}>
						<TaskIcon 
							taskType = {this.props.taskType}
							correctAnswerState={this.props.correctAnswerState}
							wrongAnswerState = {this.props.wrongAnswerState} 
							micActive = {this.props.micActive} 
							index = {this.props.index} 
							currentTaskIndex = {this.props.currentTaskIndex} />
						<TaskText 
							className="taskText" 
							index={this.props.index} 
							currentTaskIndex = {this.props.currentTaskIndex}
							onSpeechInput = {this.props.onSpeechInput}
							taskTextToDisplay = {this.props.taskName} 
							correctAnswerState={this.props.correctAnswerState}
							wrongAnswerState = {this.props.wrongAnswerState} />
						<HintButton 
							assessmentMode= {this.props.assessmentMode}
							hintActive= {this.props.hintActive}
							index = {this.props.index}
							currentHintIndex= {this.props.currentHintIndex}
							onDisableHint= {this.props.onDisableHint}
							onHintClick= {this.props.onHintClick} />

					</div>
				</li>
			)
	}
});

module.exports = Task;