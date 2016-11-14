var React = require('react')
var PropTypes = React.PropTypes;

function ShowPinyinButton (props) {
	console.log(props.showPinyin);
	if (props.showPinyin) {
		return (
			<button 
				className="btn-round-small btn-round-small-active"
				onClick={props.changePinyinDisplay}>Show Pinyin</button>
		)		
	} else {
		return (
			<button 
				className="btn-round-small btn-round-small-inactive"
				onClick={props.changePinyinDisplay}>Show Pinyin</button>
		)		
	}

}

module.exports = ShowPinyinButton;

ShowPinyinButton.PropTypes = {
	showPinyin: PropTypes.bool.isRequired
}