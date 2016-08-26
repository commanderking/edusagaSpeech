var React = require('react');
var Constants = require('../helpers/Constants.js');

var BackgroundImageContainer = React.createClass({
	render: function() {
		var bgImageSrc = Constants.IMAGE_PATH + this.props.bgImage;
		var fadedDiv;
		if (this.props.hintActive) {
			fadedDiv = 	<div className="bgFadeOverlay" ></div>
		} else {
			fadedDiv = <div></div>
		}
		return (
			<div>
				<img className="sceneBG" src={bgImageSrc} />
				{fadedDiv}
			</div>
		)
	}
});

module.exports = BackgroundImageContainer;