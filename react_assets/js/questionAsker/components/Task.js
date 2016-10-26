var React = require('react')
var PropTypes = React.PropTypes;
var TaskIcon = require('./TaskIcon')
var TaskText = require('./TaskText');
var HintButton = require('./HintButton');


var Task = React.createClass({
	render: function() {
		var that = this;
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

		// Allow task to be unclickable if in correctAnswerState, prevents mic recording after answer is correct
		var activateSpeechInput = this.props.correctAnswerState || this.props.wrongAnswerState ? function() {} : function() {
			that.props.onSpeechInput(that.props.index);
		}

		var activateMCcheck = function() {
			that.props.onMultipleChoiceSelection(that.props.taskIndex, that.props.choiceIndex) 
		}

		// Change behavior of clicking task depending on whether it's a speech or multiple choice task
		var taskClick = this.props.taskType === "multipleChoice" ? activateMCcheck : activateSpeechInput;

		console.log()
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
						taskType = {this.props.taskType}
						className="taskText" 
						index={this.props.index} 
						currentTaskIndex = {this.props.currentTaskIndex}
						taskClick = {taskClick}
						taskTextToDisplay = {this.props.taskName} 
						correctAnswerState={this.props.correctAnswerState}
						wrongAnswerState = {this.props.wrongAnswerState} />
					<HintButton 
						taskType={this.props.taskType}
						assessmentMode={this.props.assessmentMode}
						hintActive={this.props.hintActive}
						index={this.props.index}
						currentHintIndex={this.props.currentHintIndex}
						onDisableHint={this.props.onDisableHint}
						onHintClick={this.props.onHintClick} />

				</div>
			</li>
		)
	}
});

module.exports = Task;