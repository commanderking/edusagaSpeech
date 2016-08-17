var React = require('react');
var PropTypes = React.PropTypes;
var Constants = require('../helpers/Constants.js');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var CharacterImage = require('./components/CharacterImage');

var CharacterContainer = React.createClass({
	render: function() {
		var scenarioData = this.props.scenarioData;
		var scenarioIndex = this.props.scenarioIndex;
		var charImageDiv;
		var charImgSrc = Constants.IMAGE_PATH + this.props.charImage;
		if (this.props.scenarioOn === true) {
			charImageDiv =
			(
				<div className="characterImageDiv">
					<img className="charImage" src={scenarioData[scenarioIndex].image} />
					<img className="charImage" src={scenarioData[scenarioIndex].imageLayer} />
				</div>
			)
		} else if (this.props.hintActive === true) {
			charImageDiv = 
			(
				<div className="characterImageDiv">
					<img className="charImage" src={this.props.silhouette} />
				</div>				
			)
		}
			else {
			charImageDiv = 
			(
				<div className="characterImageDiv">
					<CharacterImage 
						src={charImgSrc}
						correctAnswerState={this.props.correctAnswerState} 
						wrongAnswerState = {this.props.wrongAnswerState} />
				</div>
			)
		}

		return (
			<div className="characterDiv col-md-4">
				{charImageDiv}
			</div>
		)
	}
});

CharacterContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	scenarioData: PropTypes.array.isRequired,
	scenarioIndex: PropTypes.number.isRequired,
	charImage: PropTypes.string.isRequired,
	correctAnswerState: PropTypes.bool.isRequired,
	wrongAnswerState: PropTypes.bool.isRequired
}


module.exports = CharacterContainer;