var React = require('react')
var PropTypes = React.PropTypes;

function PracticeHeader (props) {
	return (
		<div className="practiceHeader">
			<div className="titleDiv">
				<p className="title">Food</p>
				<p className="type">Vocabulary</p>
			</div>
		</div>
	)
}

module.exports = PracticeHeader;