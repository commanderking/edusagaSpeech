var React = require('react')
var PropTypes = React.PropTypes;

function ShowPinyinButton (props) {
	return (
		<button 
			className="btn-round-small"
			onClick={props.changePinyinDisplay}>Show Pinyin</button>
	)
}

module.exports = ShowPinyinButton;