var React = require('react');
var PropTypes = React.PropTypes;


var MenuContainer = React.createClass({
	render: function() {
		if (this.props.sceneComplete === false) {
			return null
		} else {
			return (
				<div className="menuContainer">
					<h1>You did it!</h1>
					<h1> You earned {this.props.coins} coins out of {this.props.possibleCoins} coins.</h1>
					<button className="btn btn-danger restart"
						onClick={this.props.loadSceneData}>Replay Scene
					</button>
				</div>)
		}
	}
});

MenuContainer.propTypes = {
	sceneComplete: PropTypes.bool.isRequired,
}

module.exports = MenuContainer;