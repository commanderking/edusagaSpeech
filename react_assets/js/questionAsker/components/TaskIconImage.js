var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var Transitions = require('../../helpers/Transitions.js');


var TaskIconImage = React.createClass({
	componentDidMount: function() {
		var node = ReactDOM.findDOMNode(this);
		console.log("Component mounted");
		console.log(node);

		switch(this.props.transition) {
			case "activateTaskMic":
				Transitions.activateTask.mic(node);
				break;
			case "activateTaskStar": 
				Transitions.activateTask.star(node);
				break;
			case "taskCorrectMic":
				Transitions.taskCorrect.mic(node);
				break;
			case "taskCorrectStar":
				Transitions.taskCorrect.star(node);
				break;
			case "taskCorrectCoins":
				Transitions.taskCorrect.coins(node);
				break;
			case "taskWrongStar":
				Transitions.taskWrong.star(node);
				break;
			case "taskWrongQuestionMark":
				Transitions.taskWrong.questionMark(node);
			default: 
				break;
		}
	},
	componentDidUpdate: function() {
		var node = ReactDOM.findDOMNode(this);
		switch(this.props.transition) {
			case "taskCorrectMic":
				Transitions.taskCorrect.mic(node);
				break;
			case "taskCorrectStar":
				Transitions.taskCorrect.star(node);
				break;
			case "taskCorrectCoins":
				Transitions.taskCorrect.coins(node);
				break;
			default: 
				break;
		}

	},
	render: function() {
		return <img key={this.props.keyToAttach} className="" src={this.props.imageSrc} />
	}

});

module.exports = TaskIconImage;
