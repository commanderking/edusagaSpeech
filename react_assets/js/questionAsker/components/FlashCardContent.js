var React = require('react')
var PropTypes = React.PropTypes;

function FlashCardContent (props) {
	// Control over whether to display pinyin or not
	console.log(props.showPinyin);
	var pinyinDisplay = props.showPinyin ? <p className="pinyinPrompt">{props.currentWordObject.pinyin}</p> : null;
	return (
		<div className="flashCardComparison">
			<h2 className="characterPrompt flashCardCharacters">{props.currentWordObject.answer}
			</h2>
			{pinyinDisplay}
			<h2 className="userInputCharacters flashCardCharacters">你好
			</h2>
		</div>
	)
}

module.exports = FlashCardContent;

FlashCardContent.propTypes = {
	currentWordObject: PropTypes.object.isRequired,
	showPinyin: PropTypes.bool.isRequired
}