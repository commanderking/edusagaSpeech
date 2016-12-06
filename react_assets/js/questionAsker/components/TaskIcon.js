var React = require('react');
var TaskIconImage = require('./TaskIconImage');
var Constants = require('../../helpers/Constants.js');

var TaskIcon = React.createClass({
	// Reference to old mic if needed
	render: function() {
		// Default TaskIcon image when nothing is being recorded or answered
		var imgMic = Constants.IMAGE_PATH + "UI/Icon_Mic-01.png";
		var imgStar = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
		var imgCoins = Constants.IMAGE_PATH + "UI/Icon_10coins_flat_nostar-01.png";
		var imgQuestion = Constants.IMAGE_PATH + "UI/Icon_Questionmark-01.png";
		var imgRepeat = Constants.IMAGE_PATH + "UI/buttonRepeatOn.png";
		var imgCircle = Constants.IMAGE_PATH + "UI/circlePassiveTasklist.png";

		// If multiplechoice Task, show circle image
		if (this.props.taskType === "multipleChoice") {
			var taskIconImage = <div className="taskIconDiv">
								<TaskIconImage 
									ref={(ref) => this.mic = ref}
									keyToAttach="firstMic"
									imageSrc={imgCircle}
									imgClass="circle" />
							</div>;
		}
		// Default taskIconImage is the mic image
		else {

			var taskIconImage = <div className="taskIconDiv">
					<span className="icon-mic icon-mic-rest"></span>
					</div>;
		}

		// Sets to true if this task is the active task
		if(this.props.index === this.props.currentTaskIndex) {
			if (this.props.micActive) {
				return (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar" 
							imageSrc={imgStar}
							transition = "activateTaskStar"/>
						<span className="icon-mic icon-mic-large"></span>
					</div>
				)			
			} else if (this.props.correctAnswerState) {
				return (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar2" 
							imageSrc={imgStar} 
							transition="taskCorrectStar"/>
						<TaskIconImage
							keyToAttach="coins" 
							imageSrc={imgCoins} 
							transition="taskCorrectCoins"/>
						<TaskIconImage 
							keyToAttach="iconMic" 
							imageSrc={imgMic}
							transition ="taskCorrectMic"/>
					</div>
				)
			} else if (this.props.wrongAnswerState) {
				return (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar3" 
							imageSrc={imgStar} 
							transition="taskWrongStar"/>
						<TaskIconImage 
							keyToAttach="questionMark" 
							imageSrc={imgQuestion}
							transition="taskWrongQuestionMark" />
					</div>
				)
			}
		}

		// If this is the repeat button, return the repeat icon 
		if (this.props.icon === "repeatIcon") {
			return (<div className="taskIconDiv repeatOnDiv">
						<TaskIconImage 
							keyToAttach="repeat" 
							imageSrc={imgRepeat} />
					</div>)
		}
		return (
			<span>
			{taskIconImage}
			</span>
		)
	}
});

module.exports = TaskIcon;