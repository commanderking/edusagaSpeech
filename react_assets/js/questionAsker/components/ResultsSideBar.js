var React = require('react');
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

var ResultsSideBar = React.createClass({
	render: function() {
		var coinImageSrc = Constants.IMAGE_PATH + "UI/Icon_coins-01.png";
		var coinsToMax = this.props.possibleCoins - this.props.coins;
		return (
			<div className="resultsSideBar">
				<h1>REWARD</h1>
				<div className="coinWrapper">
					<img src={coinImageSrc} />
					<h2> {this.props.coins}/{this.props.possibleCoins} </h2>
				</div>
				<h4>Try again for <b>{coinsToMax} MORE COINS?</b></h4>
				<div className="buttonContainer">
					<button className="btn btn-replay"
						onClick = {this.props.loadSceneData}>
						<span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
						<span className="buttonText">Go Now</span>
					</button>
					<button className="btn btn-map">
						<span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
						<span className="buttonText">Back to Map</span>
					</button>
				</div>
			</div>
		)
	}
});


ResultsSideBar.propTypes = {
	loadSceneData: PropTypes.func.isRequired,
	coins: PropTypes.number.isRequired,
	possibleCoins: PropTypes.number.isRequired
}


module.exports = ResultsSideBar;