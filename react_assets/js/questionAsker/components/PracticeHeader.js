var React = require('react')
var PropTypes = React.PropTypes;
const Constants = require('../../helpers/Constants.js');


function PracticeHeader (props) {
	var headerImage = Constants.IMAGE_PATH + "UI/titleResults.png";
	return (
		<div className="practiceHeader">
			<img className="headerImageTextSlanted customSlant" src={headerImage} />
				<p className="description">
					Practice what you're going to say next
				</p>

			<div className="glyphiconWrapper">
				<span className="glyphicon glyphicon-record" aria-hidden="true"></span>
			</div>
			<div className="glyphiconWrapper">
				<i className="fa fa-bolt" aria-hidden="true"></i>
			</div>

		</div>
	)
}

module.exports = PracticeHeader;
