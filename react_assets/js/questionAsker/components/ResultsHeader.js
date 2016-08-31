var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');
var ResultsCharProfile = require('./ResultsCharProfile');


function ResultsHeader (props) {
	var miriIconSrc = Constants.IMAGE_PATH + "miri/icons/Miri_Icon_Yay.png";
	return (
		<div className="resultsHeader">
			<h1>RESULTS</h1>
			<div className="miriIcon">
				<img src={miriIconSrc} />
			</div>
			<ResultsCharProfile 
				charProfilePic = {props.charProfilePic}
				charName = {props.charName}
				coins = {props.coins}
				possibleCoins = {props.possibleCoins} />
		</div>
	)
}

module.exports = ResultsHeader;