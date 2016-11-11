var React = require('react')
var PropTypes = React.PropTypes;

function PracticeAudioButton (props) {
	return (
		<button 
			className="button btn-round-small"
			onClick={() => props.playSpeechSynth(props.currentWord)}>
			<span className="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
		</button>
	)
}

module.exports = PracticeAudioButton;

PracticeAudioButton.propTypes = {
	playSpeechSynth: PropTypes.func.isRequired,
	currentWord: PropTypes.string.isRequired
}