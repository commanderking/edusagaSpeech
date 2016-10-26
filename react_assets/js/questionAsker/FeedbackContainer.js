var React = require('react');
var SpeechableSpan = require('./components/SpeechableSpan');
var CoinMeter = require('./components/CoinMeter');
var HintIcon = require('./components/HintIcon');
var RepeatButton = require('./components/RepeatButton');
var SkipButton = require('./components/SkipButton');
var MiriIconText = require('./components/MiriIconText');
var MiriFeedback = require('./components/MiriFeedback');

var FeedbackContainer = React.createClass({
	render: function() {
		return (
			<div className ="bottomNavBar">
				<div className="row-fluid">
					<div className="buttonLine">
						<CoinMeter coins={this.props.coins} />
						<p className="locationText">
							<i>{this.props.locationTextEnglish} </i>
							({this.props.locationTextChinese})
						</p>

						<MiriFeedback 
								hintActive = {this.props.hintActive}
								answerFeedbackActive = {this.props.answerFeedbackActive} 
								feedbackText = {this.props.feedbackText}
								miriIconSrc = {this.props.miriIconSrc} 
								onHintAudio = {this.props.onHintAudio} 
								askingForRepeat = {this.props.askingForRepeat} />
						<RepeatButton
							scenarioOn = {this.props.scenarioOn}
							repeatActive = {this.props.repeatActive} 
							handleAskRepeat = {this.props.handleAskRepeat}
							onDisableHint = {this.props.onDisableHint}
							deactivateFeedbackMode = {this.props.deactivateFeedbackMode}
							turnMicStateOn = {this.props.turnMicStateOn}
							repeatPhrases = {this.props.repeatPhrases}
							taskLang = {this.props.currentLanguage}
							hintActive = {this.props.hintActive} 
							correctAnswerState = {this.props.correctAnswerState}
							micActive = {this.props.micActive} 
							wrongAnswerState = {this.props.wrongAnswerState}
							tasks = {this.props.tasks}
							setCurrentTaskIndex = {this.props.setCurrentTaskIndex} 
							askingForRepeat = {this.props.askingForRepeat} 
							activateRepeatMode = {this.props.activateRepeatMode} 
							currentScenarioData = {this.props.currentScenarioData} />
						<SkipButton 
							scenarioOn = {this.props.scenarioOn}
							askingForRepeat = {this.props.askingForRepeat} 
							correctAnswerState = {this.props.correctAnswerState}
							micActive = {this.props.micActive} 
							wrongAnswerState = {this.props.wrongAnswerState} 
							skipTasks = {this.props.skipTasks} 
							hintActive = {this.props.hintActive} />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FeedbackContainer;	