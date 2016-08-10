var React = require('react')
var PropTypes = React.PropTypes;

function CoinMeter (props) {
	return (
		<div className="coinDiv">
			<img className="coinIcon" src="/static/images/UI/Icon_coins-01.png" />
			<div className="coinCount">{props.coins}</div>
		</div>
	)
}

module.exports = CoinMeter;