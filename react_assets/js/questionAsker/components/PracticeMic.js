var React = require('react')
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants.js');
var TaskIconImage = require('./TaskIconImage');

var PracticeMic = React.createClass({
	render: function() {
		var className = "btn btn-info micWrap micActive-" + this.props.micActive;
		var micFunction;
		var imgMic = Constants.IMAGE_PATH + "UI/Icon_Mic-01.png";
		var imgStar = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
		var taskIconImage;

		if (this.props.micActive === true) {
			micFunction = this.props.onMicDeactivate;
			taskIconImage = <div>
							<span className='icon-mic'></span>
							<TaskIconImage 
								keyToAttach="iconStar" 
								imageSrc={imgStar}
								transition = "activateTaskStar"/>
							</div>
		} else {
			micFunction = this.props.onMicActivate;
			taskIconImage = <span className='icon-mic'></span>
		}
		return (
			<div className="micDiv">
				<button id="mic" className={className} onClick={micFunction}>
					{taskIconImage}
				</button>
			</div>		
		)
	}
});

module.exports = PracticeMic;

PracticeMic.propTypes = {
	onMicDeactivate: PropTypes.func.isRequired,
	onMicActivate:PropTypes.func.isRequired

}