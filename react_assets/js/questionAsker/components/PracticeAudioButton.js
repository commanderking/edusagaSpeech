var React = require('react')
var PropTypes = React.PropTypes;

function PracticeAudioButton (props) {
	return (
		<button className="button practiceAudioButton">
			<span className="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
			<span className="toolTipText">Practice</span>
		</button>
	)
}

module.exports = PracticeAudioButton;