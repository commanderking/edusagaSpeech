var React = require('react');

var BackgroundImageContainer = React.createClass({
	render: function() {
		var fadedDiv;
		if (this.props.hintActive) {
			fadedDiv = 	<div className="bgFadeOverlay" ></div>
		} else {
			fadedDiv = <div></div>
		}
		return (
			<div>
				<img className="sceneBG" src={this.props.bgImage} />
				{fadedDiv}
			</div>
		)
	}
});

module.exports = BackgroundImageContainer;