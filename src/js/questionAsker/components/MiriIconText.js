var React = require('react')
var PropTypes = React.PropTypes;
var SpeechableSpan = require('./SpeechableSpan');
var TaskIconImage = require('./TaskIconImage');

function MiriIconText (props) {
	var hintTemplateText;
	var spanClickFunction = props.hintClickDisable ? null : props.handleHintAudioClick;

	// Case of hint being given
	if (props.hintActive === true) {
		hintTemplateText = 
		(	<p className="hintText">
				<span>Maybe you can say: </span>
				<SpeechableSpan clickFunction={() => spanClickFunction(props.feedbackText)} feedbackText={props.feedbackText} />
			</p>) 
	} 

	// User answers wrong, provide feedback
	else if (props.answerFeedbackActive === true) {
		// They comfirmed a suggestion...
		if (props.suggestionSubmitted) {
			hintTemplateText = 
			(<p className="hintText">
					<span>I will add a request to add it to acceptable answers!</span>
			</p>) 
		} 
		// They pressed first suggestion submit and want to confirm a suggestion
		else if (props.suggestionMode) {
			hintTemplateText = 
			(<p className="hintText">
				<span>Suggest </span>
				<SpeechableSpan clickFunction={() => spanClickFunction(props.feedbackText)} feedbackText={props.feedbackText} />
				<span> as a good answer?</span>
			</p>)
		} 
		// All other cases (when user gets answer wrong)
		else {
			hintTemplateText = 
			(<p className="hintText">
					<span>I heard you say: </span>
					<SpeechableSpan clickFunction={() => spanClickFunction(props.feedbackText)} feedbackText={props.feedbackText} />
			</p>) 
		}
	} 
	// Case of asking for repeat 
	else if (props.askingForRepeat) {
		var span = <span>Ask them to say it again.</span>
		if (props.askingForRepeatHelp) {
			span = <span>Try saying: <SpeechableSpan clickFunction={() => spanClickFunction("请再说一遍")} feedbackText="请再说一遍" /></span>
		}
		hintTemplateText = 
		(<p className="hintText">
			{span}
			<span 
				className="glyphicon glyphicon-question-sign" 
				aria-hidden="true"
				onClick={props.askRepeatHelp}></span>
			<span 
				className="glyphicon glyphicon-remove stop-repeat" 
				aria-hidden="true"
				onClick={props.cancelRepeatOnClick}></span>
		</p>)
	}
	return (
		<div className="miriIconText">
			{hintTemplateText}
		</div>
	)
}

module.exports = MiriIconText;