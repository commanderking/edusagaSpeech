var React = require('react');
var Constants = require('../../helpers/Constants.js');
var SpeechRecognition = require('../../helpers/SpeechRecognition');

var RepeatButton = React.createClass({
	getInitialState: function() {
		return {hover: false, 
		currentTaskIndex: -1
		}
	},
	clickRepeat: function() {
		var that = this;

		this.props.activateRepeatMode();

		// Resets currentTaskIndex to a non real task so that the tasks will not highlight
		// while listening for speech. Will activiate because MicActive activates task higlighting.
		// TODO: Might want to refactor later and add repeatActive to separate from micActive
		this.props.setCurrentTaskIndex(-2)

		this.props.onDisableHint();
		this.props.deactivateFeedbackMode();
		this.props.turnMicStateOn();

		this.setState({hover: false});

		SpeechRecognition.activateSpeech(this.props.repeatPhrases, this.props.taskLang)
			.then(function(userAnswer) {
				console.log(userAnswer);
				that.props.handleAskRepeat(userAnswer);
			})

	},
	mouseOver: function() {
		this.setState({hover: true});
	},
	mouseOut: function() {
		this.setState({hover: false});
	},
	render: function() {
		// If there's only one task and it's only mulitple choice,
		// in general, multiple choice only appears in listening activities so 
		// no need to ask for repeat
		// Might need to be altered later
		var multipleChoiceTask;
		if (this.props.tasks.length === 1) {
			this.props.tasks.forEach(function(task) {
				multipleChoiceTask = task.taskType === "multipleChoice" ? true : false;
			})			
		}

		var repeatImgSrc = this.state.hover ? Constants.IMAGE_PATH + 'UI/buttonRepeatOn.png' : Constants.IMAGE_PATH + 'UI/buttonRepeat.png';
		var repeatButton = this.props.correctAnswerState || this.props.micActive || this.props.wrongAnswerState || this.props.hintActive || this.props.scenarioOn
							|| multipleChoiceTask
			? null : <img 
					className=" button repeatButton" 
					src={repeatImgSrc} 
					onMouseOver= {this.mouseOver} 
					onMouseOut = {this.mouseOut}
					onClick={ () => this.clickRepeat() } />
		return (
			<div className="repeatButtonDiv">
				{repeatButton}
				<span className="toolTipText">Repeat</span>
			</div>
		)
	}
});

module.exports = RepeatButton;