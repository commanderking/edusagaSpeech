var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

function ResultsHeader (props) {
	var miriIconSrc = Constants.IMAGE_PATH + "miri/icons/Miri_Icon_default.png";
	return (
		<div className="resultsHeader">
			<h1>RESULTS</h1>
			<div className="miriIcon">
				<img src={miriIconSrc} />
			</div>
		</div>
	)
}

module.exports = ResultsHeader;