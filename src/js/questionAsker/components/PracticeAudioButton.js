var React = require('react')
var PropTypes = React.PropTypes;

function PracticeAudioButton (props) {
	if (props.speechSynthPlaying) {
		return (
			<button 
				className="button btn-round-small btn-round-small-active"
				onClick={() => props.playSpeechSynth(props.currentWord)}>
				<span className="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
			</button>
		)
	} else {
		return (
			<button 
				className="button btn-round-small btn-round-small-inactive"
				onClick={() => props.playSpeechSynth(props.currentWord)}>
				<span className="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
			</button>
		)
	}
}

module.exports = PracticeAudioButton;

PracticeAudioButton.propTypes = {
	playSpeechSynth: PropTypes.func.isRequired,
	currentWord: PropTypes.string.isRequired,
	speechSynthPlaying: PropTypes.bool.isRequired
}