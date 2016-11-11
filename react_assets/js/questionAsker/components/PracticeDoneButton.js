var React = require('react')
var PropTypes = React.PropTypes;

function PracticeDoneButton (props) {
	return (
		<button 
			className="btn btn-info btn-lg btn-practice-done"
			onClick={props.changePracticeMode}>
				Done!
		</button>
	)
}

module.exports = PracticeDoneButton;

PracticeDoneButton.propTypes = {
	changePracticeMode: PropTypes.func.isRequired
}