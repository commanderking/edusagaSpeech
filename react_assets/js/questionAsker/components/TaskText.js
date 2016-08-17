var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var Transitions = require('../../helpers/Transitions.js');


var TaskText = React.createClass({
	componentDidUpdate: function() {
		var node = ReactDOM.findDOMNode(this);
		if (this.props.correctAnswerState && this.props.currentTaskIndex === this.props.index) {
			Transitions.taskCorrect.taskText(node);
		}
	},
	componentWillUnmount: function() {
		console.log("unmounting");
	},
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

TaskText.propTypes = {
	correctAnswerState: PropTypes.bool.isRequired,
	currentTaskIndex: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	onSpeechInput: PropTypes.func.isRequired
}

module.exports = TaskText;