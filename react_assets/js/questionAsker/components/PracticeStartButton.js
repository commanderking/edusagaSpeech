var React = require('react')
var PropTypes = React.PropTypes;

function PracticeStartButton (props) {
	if (props.practiceAvailable) {
		return (
			<button 
				className="button practiceStartButton"
				onClick={props.changePracticeMode}>
				<span className="glyphicon glyphicon-record" aria-hidden="true"></span>
				<span className="toolTipText">Practice</span>
			</button>
		)		
	} else {
		return null;
	}
}

module.exports = PracticeStartButton;

PracticeStartButton.propTypes = {
	practiceAvailable: PropTypes.bool.isRequired,
}