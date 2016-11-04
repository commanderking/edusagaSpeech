var React = require('react')
var PropTypes = React.PropTypes;
var PracticeAudioButton = require('./PracticeAudioButton');

function FlashCardHeader (props) {
	return (
		<div className="flashCardHeader">
			<h3>Task: {props.currentWordObject.task}</h3>
			<div className="checkbox pinyinCheckBox">
			 	<label>
			 		<input type="checkbox" onClick={props.changePinyinDisplay} value=""/>
			 			Show Pinyin
			 		</label>
			</div>
			<PracticeAudioButton />
		</div>
	)
}

module.exports = FlashCardHeader;

FlashCardHeader.propTypes = {
	changePinyinDisplay: PropTypes.func.isRequired,
	currentWordObject: PropTypes.object.isRequired
}