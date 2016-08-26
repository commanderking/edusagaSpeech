var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

function CoinMeter (props) {
	var coinIconSrc = Constants.IMAGE_PATH + "UI/Icon_coins-01.png";
	return (
		<div className="coinDiv">
			<img className="coinIcon" src={coinIconSrc} />
			<div className="coinCount">{props.coins}</div>
		</div>
	)
}

module.exports = CoinMeter;