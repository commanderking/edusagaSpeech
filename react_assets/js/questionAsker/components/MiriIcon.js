var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

function MiriIcon (props) {
	var miriImgSrc = Constants.IMAGE_PATH + props.miriIconSrc;
	return (
		<div>
			<img className={props.miriClass} src={miriImgSrc} />
		</div>
	)
}

module.exports = MiriIcon;