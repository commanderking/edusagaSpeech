var React = require('react')
var PropTypes = React.PropTypes;

function NextButton (props) {

	if (props.scenarioOn === true) {
		return (
			<button 
				className="button nextButton"
				onClick={props.nextScenario} >
				<span className="glyphicon glyphicon-play" aria-hidden="true"></span>
			</button>
		)		
	} else {
		return null;
	}

}

module.exports = NextButton;