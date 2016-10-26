

var React = require('react');

var RewindButton = React.createClass({
	componentWillUpdate: function() {
		/*
		console.log("Component will update");
		console.log(this.props.scenarioData);
		console.log(this.props.scenarioData[this.props.scenarioIndex]);
		console.log(this.props.scenarioData[this.props.scenarioIndex].saveSoundForRewind);
		if (this.props.scenarioData[this.props.scenarioIndex].saveSoundForRewind) {
			this.props.setRewindScenarioSound(this.props.scenarioData[this.props.scenarioIndex].soundID);
			console.log("sound saved");
		}
		*/
		
	},
	render: function() {
		if (this.props.scenarioData[this.props.scenarioIndex].rewindAvailable) {
			return (
				<button 
					className="button rewindButton"
					onClick={this.props.playRewindScenarioSound} >
					<span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
				</button>
			)
		} else {
			return null;
		}
	}
});

module.exports = RewindButton;