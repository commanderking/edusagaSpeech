var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');
var ResultsCharProfile = require('./ResultsCharProfile');


function ResultsHeader (props) {
	var miriIconSrc = Constants.IMAGE_PATH + "miri/icons/Miri_Icon_Yay.png";
	var resultsSrc = Constants.IMAGE_PATH + "UI/titleResults.png";
	return (
		<div className="resultsHeader">
			<img className="resultsImage" src={resultsSrc} />
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