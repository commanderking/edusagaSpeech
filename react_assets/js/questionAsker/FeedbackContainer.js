var React = require('react');
var SpeechableSpan = require('./components/SpeechableSpan');
var CoinMeter = require('./components/CoinMeter');
var MiriIcon = require('./components/MiriIcon');
var HintIcon = require('./components/HintIcon');

var FeedbackContainer = React.createClass({
	getInitialState: function() {
		return { 
			hintClickDisable: false,
			suggestionMode: false,
			suggestionSubmitted: false,
		}
	},
	// Suggestions are activated when users want to add their answer to database
	activateSuggestionMode: function() {
		console.log("Suggestion Mode Activated");
		this.setState({ suggestionMode: true});
	},
	submitSuggestion: function() {
		var that = this;
		console.log("Suggestion submitted");
		this.setState({ suggestionMode: false});
		this.setState({ suggestionSubmitted: true});
		setTimeout(function(){
			that.setState({ suggestionSubmitted: false});
		}, 3000);
	},
	handleHintAudioClick: function() {
		var that = this;

		// Disable clicking on hint to play voice
		this.setState({ hintClickDisable: true })

		// PLay audio from hint
		this.props.onHintAudio(this.props.feedbackText);

		// Disable clicking on hint for some time before re-enabling
		setTimeout(function(){
			that.setState({
				hintClickDisable: false
			})
		}, 1000)
	},
	render: function() {
		// Show Hint when hints are active
		// Change Miri's icon depending on type of hint/feedback
		var hintDivClass;
		var hintTemplateText;
		var miriIconClass = "miriIcon";
		var spanClickFunction = this.state.hintClickDisable ? null : this.handleHintAudioClick;
		var hintDivClass = "hintDiv";

		// Case of hint being given
		if (this.props.hintActive === true) {
			hintTemplateText = 
			(	<p className="hintText">
					<span>Maybe you can say: </span>
					<SpeechableSpan clickFunction={spanClickFunction} feedbackText={this.props.feedbackText} />
				</p>) 
			miriIconClass += " miriGlow";
		} 

		// User answers wrong, provide feedback
		else if (this.props.answerFeedbackActive === true) {
			// They comfirmed a suggestion...
			if (this.state.suggestionSubmitted) {
				hintTemplateText = 
				(<p className="hintText">
						<span>I will add a request to add it to acceptable answers!</span>
				</p>) 
			} 
			// They pressed first suggestion submit and want to confirm a suggestion
			else if (this.state.suggestionMode) {
				hintTemplateText = 
				(<p className="hintText">
					<span>Suggest </span>
					<SpeechableSpan clickFunction={spanClickFunction} feedbackText={this.props.feedbackText} />
					<span> as a good answer?</span>
				</p>)
				hintDivClass += " hintDivGold";
			} 
			// All other cases
			else {
				hintTemplateText = 
				(<p className="hintText">
						<span>I heard you say: </span>
						<SpeechableSpan clickFunction={spanClickFunction} feedbackText={this.props.feedbackText} />
				</p>) 
			}
			miriIconClass += " miriGlow";
		} else {
			hintDivClass = "hintDiv hidden"
		}
		// If hintClick disabled, span should do nothing, otherwise, it should play audio
		return (
			<div className ="bottomNavBar">
				<div className="row-fluid">
					<div className="buttonLine">
						<CoinMeter coins={this.props.coins} />
						<p className="locationText">
							<i>{this.props.locationTextEnglish} </i>
							({this.props.locationTextChinese})
						</p>
						<div className={hintDivClass}>
							<HintIcon 
								hintActive = {this.props.hintActive}
								answerFeedbackActive = {this.props.answerFeedbackActive} 
								suggestionMode = {this.state.suggestionMode} 
								suggestionSubmitted = {this.state.suggestionSubmitted} 
								activateSuggestionMode = {this.activateSuggestionMode} 
								submitSuggestion = {this.submitSuggestion} />
							{hintTemplateText}
						</div>
						<MiriIcon miriClass={miriIconClass} miriIconSrc={this.props.miriIconSrc} />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FeedbackContainer;	