var React = require('react')
var PropTypes = React.PropTypes;

function SpeechableSpan (props) {
	return (
		<span className="speechableSpan"
			onClick={ props.clickFunction }>
			{props.feedbackText}
		</span>
	)
}

module.exports = SpeechableSpan;