var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants.js');

var SkipButton = React.createClass({
	getInitialState: function() {
		return {hover: false}
	},
	mouseOver: function() {
		this.setState({hover: true});
	},
	mouseOut: function() {
		this.setState({hover: false});
	},
	render: function() {
		var skipImgSrc = this.state.hover ? Constants.IMAGE_PATH + 'UI/buttonSkipOn.png' : Constants.IMAGE_PATH + 'UI/buttonSkip.png';

		// No option to press skip button if answering question
		var skipButton = this.props.correctAnswerState || this.props.micActive || this.props.wrongAnswerState || this.props.hintActive || this.props.scenarioOn
			? null : <img 
						className=" button skipButton" 
						src={skipImgSrc} 
						onMouseOver= {this.mouseOver} 
						onMouseOut = {this.mouseOut}
						onClick={this.props.skipTasks}/>
		return (
			<div>
				{skipButton}
			</div>
		)
	}
});

module.exports = SkipButton;