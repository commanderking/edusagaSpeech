var React = require('react')
var PropTypes = React.PropTypes;
var PracticeAudioButton = require('./PracticeAudioButton');

function FlashCardHeader (props) {
	return (
		<div className="flashCardHeader">
			<h1>Task: {props.currentWordObject.task}</h1>
		</div>
	)
}

module.exports = FlashCardHeader;

FlashCardHeader.propTypes = {
}