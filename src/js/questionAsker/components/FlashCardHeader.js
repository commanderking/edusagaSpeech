var React = require('react')
var PropTypes = React.PropTypes;

function FlashCardHeader (props) {
	return (
		<div className="flashCardHeader">
			<h1>{props.currentWordObject.task}</h1>
		</div>
	)
}

module.exports = FlashCardHeader;

FlashCardHeader.propTypes = {
}