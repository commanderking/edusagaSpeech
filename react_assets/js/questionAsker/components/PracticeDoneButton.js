var React = require('react')
var PropTypes = React.PropTypes;

function PracticeDoneButton (props) {
	return (
		<div className="btn-practice-done-container">
			<button 
				className="btn btn-danger btn-lg btn-practice-done"
				onClick={props.changePracticeMode}>
					End Practice
			</button>
		</div>
	)
}

module.exports = PracticeDoneButton;

PracticeDoneButton.propTypes = {
	changePracticeMode: PropTypes.func.isRequired,
	currentAnswerCorrect: PropTypes.bool.isRequired
}