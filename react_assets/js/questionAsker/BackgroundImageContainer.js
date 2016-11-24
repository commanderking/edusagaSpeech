var React = require('react');
var Constants = require('../helpers/Constants.js');
var PropTypes = React.PropTypes;

var BackgroundImageContainer = React.createClass({
	render: function() {
		var bgImageSrc = Constants.IMAGE_PATH + this.props.bgImage;
		var fadedDiv = this.props.hintActive ? <div className="bgFadeOverlay" ></div> : null;
		var imageClass = this.props.scenarioOn ? "sceneBG" : "sceneBG sceneBG-fade";

		return (
			<div>
				<img className={imageClass} src={bgImageSrc} />
				{fadedDiv}
			</div>
		)
	}
});

module.exports = BackgroundImageContainer;

BackgroundImageContainer.PropTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	bgImage: PropTypes.string.isRequired,
	hintActive: PropTypes.bool.isRequired
}