var React = require('react');

var TaskText = React.createClass({
	render: function() {
		var displayText;
		if (this.props.correctAnswerState && this.props.currentTaskIndex === this.props.index) {
			displayText = "很好! 答对了!";
		} else {
			displayText = this.props.taskTextToDisplay;
		}
		return (
			<div 
				className="taskText" 
				data-index={this.props.index} 
				onClick={ () => this.props.onSpeechInput(this.props.index) }>
					{displayText}
			</div>
		)
	}
});

module.exports = TaskText;