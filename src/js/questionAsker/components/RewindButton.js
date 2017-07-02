var React = require('react')
var PropTypes = React.PropTypes;

function RewindButton (props) {
	if (props.scenarioData[props.scenarioIndex].rewindAvailable) {
		return (
			<button 
				className="button rewindButton"
				onClick={props.playRewindScenarioSound} >
				<span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
			</button>
		)
	} else {
		return null;
	}
}

module.exports = RewindButton;