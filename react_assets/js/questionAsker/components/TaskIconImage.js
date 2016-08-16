var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var Transitions = require('../../helpers/Transitions.js');


var TaskIconImage = React.createClass({
	componentDidMount: function() {
		var node = ReactDOM.findDOMNode(this);
		if (this.props.transition === "activateTaskMic") {
			Transitions.activateTask.mic(node);
		}
	},
	componentWillUnmount: function() {
		console.log("Unmount");
		var node = ReactDOM.findDOMNode(this);
		console.log(node);
		if (this.props.transition === "taskCorrectMicFade") {
			Transitions.activateTask.mic(node);
		}
	},
	componentDidUpdate: function() {
		var node = ReactDOM.findDOMNode(this);
		console.log("Component Mounted");
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
			default: 
				break;
		}

	},
	render: function() {
		return <img key={this.props.keyToAttach} className="" src={this.props.imageSrc} />
	}

});

module.exports = TaskIconImage;
