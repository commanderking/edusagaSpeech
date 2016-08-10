var React = require('react')
var PropTypes = React.PropTypes;

function MiriIcon (props) {
	return (
		<div>
			<img className={props.miriClass} src={props.miriIconSrc} />
		</div>
	)
}

module.exports = MiriIcon;