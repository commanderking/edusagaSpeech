var React = require('react')
var PropTypes = React.PropTypes;

function NavBarButton (props) {
	return (
		<li onClick={() => props.clickFunction(props.text)}>
			{props.text}
		</li>
	)
}

module.exports = NavBarButton;

NavBarButton.PropTypes = {
	text: PropTypes.string.isRequired,
	clickFunction: PropTypes.func.isRequred
}