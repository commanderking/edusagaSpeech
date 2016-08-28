var React = require('react');
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

var ResultsSideBar = React.createClass({
	render: function() {
		var coinImageSrc = Constants.IMAGE_PATH + "UI/Icon_coins-01.png";
		var coinsToMax = this.props.possibleCoins - this.props.coins;
		return (
			<div className="resultsSideBar">
				<h1>Coins Earned</h1>
				<div className="coinWrapper">
					<img src={coinImageSrc} />
					<h2> {this.props.coins}/{this.props.possibleCoins} </h2>
				</div>
				<h5>Try again for <b>{coinsToMax} MORE COINS</b></h5>
				<div className="buttonContainer">
					<button className="btn"
						onClick = {this.props.loadSceneData}>Go Now</button>
					<button className="btn">Back to Map</button>
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