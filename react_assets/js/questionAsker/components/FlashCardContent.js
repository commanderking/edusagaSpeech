var React = require('react')
var PropTypes = React.PropTypes;

function FlashCardContent (props) {
	// Control over whether to display pinyin or not
	var pinyinDisplay = props.showPinyin ? <p className="pinyinPrompt">{props.currentWordObject.pinyin}</p> : null;

	// If answer already correct, display a match
	var userAnswerDisplay = props.currentWordObject.correct ? props.currentWordObject.answer : props.userAnswer !== "" ? props.userAnswer : "...";

	var color = props.currentWordObject.correct ? "inline-block correctGreenBG" : 
		props.userAnswer !== "" ? "inline-block wrongRedBG" : "inline-block";

	return (
		<div className="flashCardComparison">
			<div className="textWrapper">
				<h2 className="textLabel">
					Say: 
				</h2>
				<h2 className="characterPrompt flashCardCharacters">
					<div className={color}>
					{props.currentWordObject.answer}
					</div>
				</h2>
			</div>
			{pinyinDisplay}
			<div className="textWrapper">
				<h2 className="textLabel">
					You said: 
				</h2>
				<h2 className="userInputcharacters flashCardCharacters">
					<div className={color}>
					{userAnswerDisplay}
					</div>
				</h2>
			</div>
		</div>
	)
}

module.exports = FlashCardContent;

FlashCardContent.propTypes = {
	currentWordObject: PropTypes.object.isRequired,
	showPinyin: PropTypes.bool.isRequired,
	userAnswer: PropTypes.string.isRequired
}