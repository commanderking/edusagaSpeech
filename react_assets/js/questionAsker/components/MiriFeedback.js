var React = require('react');
var HintIcon = require('./HintIcon');
var MiriIconText = require('./MiriIconText');
var MiriIcon = require('./MiriIcon');
var SpeechableSpan = require('./SpeechableSpan');
var TaskIconImage = require('./TaskIconImage');
var Constants = require('../../helpers/Constants.js');

var MiriFeedback = React.createClass({
	getInitialState: function() {
		return { 
			hintClickDisable: false,
			suggestionMode: false,
			suggestionSubmitted: false,
			askingForRepeatHelp: false
		}
	},
	// Suggestions are activated when users want to add their answer to database
	activateSuggestionMode: function() {
		this.setState({ suggestionMode: true});
	},
	submitSuggestion: function() {
		var that = this;
		this.setState({ suggestionMode: false});
		this.setState({ suggestionSubmitted: true});
		setTimeout(function(){
			that.setState({ suggestionSubmitted: false});
		}, 3000);
	},
	// Prevent repetitive clicking on Speechable Span for repeat
	handleHintAudioClick: function(textToSay) {
		console.log(textToSay);
		console.log("handling audio click");
		var that = this;

		// Disable clicking on hint to play voice
		this.setState({ hintClickDisable: true })

		// PLay audio from hint
		this.props.onHintAudio(textToSay);

		// Disable clicking on hint for some time before re-enabling
		setTimeout(function(){
			that.setState({
				hintClickDisable: false
			})
		}, 1000)
	},
	cancelRepeatOnClick: function() {
		// This does nothing
		// The code that triggers canceling of Speech lies in SpeechRecognition
		// The code that triggers askingForRepeat : false is handled in questionAsker: handleAskRepeat
	},
	askRepeatHelp: function() {
		console.log("Clicked for help");
		this.setState({askingForRepeatHelp: true});
	},
	render: function() {
		// Show Hint when hints are active
		// Change Miri's icon depending on type of hint/feedback
		var miriIconClass = "miriIcon";
		var hintDivClass = "hintDiv";

		// Case of hint being given
		if (this.props.hintActive === true) {
			miriIconClass += " miriGlow";
		} 
		// User answers wrong, provide feedback
		else if (this.props.answerFeedbackActive === true) {
			miriIconClass += " miriGlow";
			// They pressed first suggestion submit and want to confirm a suggestion
			if (this.state.suggestionMode) {
				hintDivClass += " hintDivGold";
			} 
			// All other cases
			else {
			}
		} 
		// User is asking for repeat 
		else if (this.props.askingForRepeat) {
			hintDivClass = "hintDiv";
		}
		else {
			hintDivClass = "hintDiv hidden"
		}
		return (
			<div>
				<div className={hintDivClass}>
					<HintIcon
						hintActive = {this.props.hintActive}
						answerFeedbackActive = {this.props.answerFeedbackActive} 
						suggestionMode = {this.props.suggestionMode} 
						suggestionSubmitted = {this.props.suggestionSubmitted} 
						activateSuggestionMode = {this.props.activateSuggestionMode} 
						submitSuggestion = {this.props.submitSuggestion}
						askingForRepeat = {this.props.askingForRepeat} />
					<MiriIconText 
						// Hint related
						hintActive = {this.props.hintActive}
						hintClickDisable = {this.props.hintClickDisable}
						handleHintAudioClick = {this.handleHintAudioClick}
						suggestionMode = {this.props.suggestionMode} 
						suggestionSubmitted = {this.props.suggestionSubmitted} 
						suggestionMode = {this.props.suggestionMode}

						// Wrong Answer Feedback related
						feedbackText = {this.props.feedbackText} 
						answerFeedbackActive = {this.props.answerFeedbackActive} 

						// Repeat related
						askingForRepeat = {this.props.askingForRepeat} 
						cancelRepeatOnClick = {this.cancelRepeatOnClick} 
						askRepeatHelp = {this.askRepeatHelp} 
						askingForRepeatHelp = {this.state.askingForRepeatHelp} />
				</div>
				<MiriIcon 
					miriClass={miriIconClass} 
					miriIconSrc={this.props.miriIconSrc} />

			</div>
		)
	}
});

module.exports = MiriFeedback;