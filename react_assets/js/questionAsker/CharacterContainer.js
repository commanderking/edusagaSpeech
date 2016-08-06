var React = require('react');
var PropTypes = React.PropTypes;

var CharacterContainer = React.createClass({
	render: function() {
		var scenarioData = this.props.scenarioData;
		var scenarioIndex = this.props.scenarioIndex;
		var charImageDiv;
		if (this.props.scenarioOn === true) {
			charImageDiv =
			(
				<div className="characterImageDiv">
					<img className="charImage" src={scenarioData[scenarioIndex].image} />
					<img className="charImage" src={scenarioData[scenarioIndex].imageLayer} />
				</div>
			)
		} else {
			charImageDiv = 
			(
				<div className="characterImageDiv">
					<img className="charImage" src={this.props.charImage} />
				</div>
			)
		}

		return (
			<div className="sceneWrapper col-md-12 col-sm-12 col-xs-12">
				<div className="characterDiv col-md-4">
					{charImageDiv}
				</div>
			</div>
		)
	}
});

CharacterContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	scenarioData: PropTypes.array.isRequired,
	scenarioIndex: PropTypes.number.isRequired,
	charImage: PropTypes.string.isRequired
}


module.exports = CharacterContainer;