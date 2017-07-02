var React = require('react')
var PropTypes = React.PropTypes;

function PracticeStartButton (props) {
	if (props.practiceAvailable) {
		return (
			<button 
				className="button practiceStartButton"
				onClick={props.changePracticeMode}>
				<i className="fa fa-bolt" aria-hidden="true"></i>
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