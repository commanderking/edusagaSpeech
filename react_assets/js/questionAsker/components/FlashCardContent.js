var React = require('react')
var PropTypes = React.PropTypes;

function FlashCardContent (props) {
	// Control over whether to display pinyin or not
	var pinyinDisplay = props.showPinyin ? <p className="pinyinPrompt">{props.currentWordObject.pinyin}</p> : null;

	// If answer already correct, display a match
	var userAnswerDisplay = props.currentWordObject.correct ? props.currentWordObject.answer : props.userAnswer !== "" ? props.userAnswer : null;

	var characterPromptClass = props.currentWordObject.correct ? "characterPrompt flashCardCharacters correctGreenBG" :
		"characterPrompt flashCardCharacters";

	var userInputClass = props.currentWordObject.correct ? "userInputCharacters flashCardCharacters correctGreenBG" :
		"userInputCharacters flashCardCharacters";

	return (
		<div className="flashCardComparison">
			<div>
				<h2 className={characterPromptClass}>
					{props.currentWordObject.answer}
				</h2>
			</div>
			{pinyinDisplay}
			<div>
				<h2 className={userInputClass}>
					{userAnswerDisplay}
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