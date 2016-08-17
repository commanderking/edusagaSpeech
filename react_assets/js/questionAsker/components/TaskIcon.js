var React = require('react');
var TaskIconImage = require('./TaskIconImage');
var TransitionsCSS = require('../../../../static/css/transitions.css');
var TransitionGroup = require('react-addons-transition-group');
var Constants = require('../../helpers/Constants.js');

var TaskIcon = React.createClass({
	render: function() {
		// Default TaskIcon image when nothing is being recorded or answered
		var imgMic = Constants.IMAGE_PATH + "UI/Icon_Mic-01.png";
		var imgStar = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
		var imgMic = Constants.IMAGE_PATH + "UI/Icon_Mic-01.png";
		var imgCoins = Constants.IMAGE_PATH + "UI/Icon_10coins_flat_nostar-01.png";
		var imgQuestion = Constants.IMAGE_PATH + "UI/Icon_Questionmark-01.png"
		var taskIconImage = <div className="taskIconDiv">
								<TaskIconImage 
									ref={(ref) => this.mic = ref}
									keyToAttach="firstMic"
									imageSrc={imgMic} />
							</div>;
		// Sets to true if this task is the active task
		if(this.props.index === this.props.currentTaskIndex) {
			if (this.props.micActive) {
				return (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar" 
							imageSrc={imgStar}
							transition = "activateTaskStar"/>
						<TaskIconImage 
							keyToAttach="iconMic" 
							imageSrc={imgMic}
							transition ="activateTaskMic"/>
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
		return (
			<span>
			{taskIconImage}
			</span>
		)
	}
});

module.exports = TaskIcon;