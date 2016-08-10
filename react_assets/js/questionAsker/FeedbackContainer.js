var React = require('react');
var SpeechableSpan = require('./components/SpeechableSpan');
var CoinMeter = require('./components/CoinMeter');
var MiriIcon = require('./components/MiriIcon');
var HintIcon = require('./components/HintIcon');

var FeedbackContainer = React.createClass({
	getInitialState: function() {
		return { 
			hintClickDisable: false,
		}
	},
	handleHintAudioClick: function() {
		that = this;

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
		if (this.props.hintActive === true) {
			hintDivClass = "hintDiv";
			hintTemplateText = "Maybe you could say: ";
			miriIconClass += " miriGlow";
		} else if (this.props.answerFeedbackActive === true) {
			hintDivClass = "hintDiv";
			hintTemplateText = "I heard you say:"; 
			miriIconClass += " miriGlow";
		} else {
			hintDivClass = "hintDiv hidden"
		}

		// If hintClick disabled, span should do nothing, otherwise, it should play audio
		var spanClickFunction = this.state.hintClickDisable ? null : this.handleHintAudioClick;
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
							<HintIcon />
							<p className="hintText">
								{hintTemplateText}
								<SpeechableSpan 
									clickFunction={spanClickFunction}
									feedbackText={this.props.feedbackText} />
							</p>
						</div>
						<MiriIcon miriClass={miriIconClass} miriIconSrc={this.props.miriIconSrc} />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FeedbackContainer;	