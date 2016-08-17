var React = require('react')
var PropTypes = React.PropTypes;
var TaskIcon = require('./TaskIcon')
var TaskText = require('./TaskText');


var Task = React.createClass({
	render: function() {
		var hintClassName;
		var taskDivClass;
		// Handling how to display each hint when hint is active or inactive
		if (this.props.hintActive) {
			if (this.props.index === this.props.currentHintIndex) {
				hintDiv = <a 
							className='taskHelpIcon taskHelpActive glyphicon glyphicon-question-sign'
							onClick={this.props.onDisableHint}></a>;
				taskDivClass = 'taskDiv taskDivActive';
			} 
			// If hint's active, but this is not the task for which a hint is requested, disable it
			else {
				hintDiv = <a 
							className='taskHelpIcon taskHelpDisabled glyphicon glyphicon-question-sign'
							onClick={this.props.onDisableHint}></a>;
				taskDivClass = 'taskDiv taskDivDisabled';
			}
		}
		// Display the normal taskDiv
		else {
			hintDiv = <a 
						className='taskHelpIcon taskHelpInactive glyphicon glyphicon-question-sign'
						onClick={ () => this.props.onHintClick(this.props.index) }>
					</a>
			taskDivClass = 'taskDiv taskDivNormalState';

			// If user clicks a task, change UI of the active task to be higlhighted
			if ((this.props.micActive || this.props.correctAnswerState || this.props.wrongAnswerState) && this.props.index === this.props.currentTaskIndex) {
				taskDivClass = 'taskDiv taskDivMicActive';
			}
		}

		return (
			<li className='inactiveLink' role='presentation' data-index={this.props.index}>
				<div className={taskDivClass} data-index={this.props.index}>
					<TaskIcon 
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
						correctAnswerState={this.props.correctAnswerState} />
					{hintDiv}
				</div>
			</li>
		)
	}
});

module.exports = Task;