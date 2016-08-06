var React = require('react');
var SpeechRecognition = require('../helpers/SpeechRecognition');

var MicContainer = React.createClass({
	render: function() {
		var className = "btn btn-info micWrap micActive-" + this.props.micActive;
		var micFunction;
		if (this.props.micActive) {
			micFunction = this.props.onMicDeactivate;
		} else {
			micFunction = this.props.onMicActivate;
		}
		return (
			<div className="micDiv">
				<button id="mic" className={className} onClick={micFunction}>
					<span className='icon-mic'></span>
				</button>
			</div>		
		)
	}
});

function FeedbackComponent (props) {
	// Determine what symbol to show (check or X next to Your answer)
	var className = "";
	// If word is already correct
	if (props.wordCorrect === true) {
		className = "glyphicon glyphicon glyphicon-ok";
		triesClassName = "hidden";
	} else if (props.wordCorrect === false) {
		className = "glyphicon glyphicon glyphicon-remove";
		triesClassName = "tries";
	} else {
		rightWrongSlot = "hidden";
		triesClassName = "hidden";
	}

	// If already correct, show correct answer in box
	return (
		<div className="inputDiv">
			<h3>Your answer: </h3>
			<div className="wrapper">
				<div className="answerSlot">
					<span>{props.lastAnswer}</span>
				</div>
				<div className="rightWrongSlot">
					<span className={className} aria-hidden="true"></span>
				</div>
			</div>
			<div className="triesGiveUp">
				<p className={triesClassName}>Tries: {props.tries}</p>
			</div>
		</div>
	)
}

function ScoreComponent (props) {
	return (
		<div className="scoreboard">
			<h3>Score</h3>
			<p className="score"><span className="numerator">{props.score} </span>
			<span className="denominator">/{props.vocabList.length}</span></p>
		</div>
	)
}

var InputContainer = React.createClass({
	getInitialState: function() {
		return {
			userAnswer: '',
			micActive: false
		}
	},
	handleUserAnswer: function() {
		var that = this;
		var possibleAnswers = this.props.vocabList[this.props.currentWordIndex].name;

		SpeechRecognition.activateSpeech(possibleAnswers, this.props.lang)
			.then(function(userAnswer) {
				// Need to set var here, otherwise loses it in setState
				console.log(userAnswer);
				var answer = userAnswer;
				if (userAnswer !== null) {
					console.log("This is user's answer " + answer);
					that.setState(
						{
							userAnswer: userAnswer,
							micActive: false
						},
						that.props.checkAnswer(userAnswer)		
					)
				}
				that.handleMicDeactivate();

			}
		);
	},
	handleMicActivate: function() {
		this.setState(
			{
				micActive: true
			}
		);
		console.log(SpeechRecognition);
		//SpeechRecognition.checkBrowser();
		this.handleUserAnswer();
	},
	handleMicDeactivate: function() {
		this.setState(
			{
				micActive: false
			}
		)
	},
	render: function() {
		return (
			<div className="inputWrapper">
				<MicContainer 
					micActive = {this.state.micActive} 
					onMicActivate = {this.handleMicActivate}
					onMicDeactivate = {this.handleMicDeactivate} />
				<FeedbackComponent 
					lastAnswer = {this.props.lastAnswer}
					wordCorrect = {this.props.wordCorrect} 
					tries = {this.props.tries} />
				<ScoreComponent
					score = {this.props.score}
					vocabList = {this.props.vocabList}/>
			</div>
		)
	}
});

module.exports = InputContainer;