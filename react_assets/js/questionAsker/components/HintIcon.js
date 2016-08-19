var React = require('react');
var Constants = require('../../helpers/Constants.js');

var HintIcon = React.createClass({
	render: function() {
		var hintIconDiv;
		var iconBG = Constants.IMAGE_PATH + "UI/ICON_payforhelp_bg-01.png";
		var iconQMark = Constants.IMAGE_PATH + "UI/ICON_payforhelp_qmark-01.png";
		var iconBigSparkle = Constants.IMAGE_PATH + "UI/ICON_payforhelp_Big_sparkle-01.png";
		var iconLeftSparkle = Constants.IMAGE_PATH + "UI/ICON_payforhelp_L_spark-01.png";
		var iconRightSparkle = Constants.IMAGE_PATH + "UI/ICON_payforhelp_R_sparkle-01.png";

		if (this.props.hintActive) {
			hintIconDiv = (
				<div>
					<img className="hintIconImage payHintBg" src={iconBG} />
					<img className="hintIconImage" src={iconQMark} />
					<img className="hintIconImage" src={iconBigSparkle} />
					<img className="hintIconImage" src={iconLeftSparkle} />
					<img className="hintIconImage" src={iconRightSparkle} />
				</div>
			)
		} 
		// User has confirmed a suggestion
		else if (this.props.suggestionSubmitted) {
			hintIconDiv = <div></div>
		}
		// User has answered, but not clicked to add a suggestion
		else if (this.props.answerFeedbackActive && !this.props.suggestionMode) {
			hintIconDiv = (<div>
				<div className="suggestNewPhraseButton promptSuggestNewPhraseButton" 
					onClick={this.props.activateSuggestionMode}> 
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
				</div>
			</div>)
		} 
		// User answered and wants to add suggestion, prompt confirm suggestion
		else if (this.props.answerFeedbackActive && this.props.suggestionMode) {
			hintIconDiv = (<div>
				<div className="suggestNewPhraseButton confirmSuggestNewPhraseButton"
					onClick={this.props.submitSuggestion}>
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
				</div>
			</div>)	
		} 

		return (
			<div className="hintIcon">
				{hintIconDiv}
			</div>
		)
	}
});

module.exports = HintIcon;