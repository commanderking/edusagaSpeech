var React = require('react');
var TaskIconImage = require('./TaskIconImage');
var TransitionsCSS = require('../../../../static/css/transitions.css');
var TransitionGroup = require('react-addons-transition-group');

var TaskIcon = React.createClass({
	render: function() {
		// Default TaskIcon image when nothing is being recorded or answered
		var taskIconImage = <div className="taskIconDiv">
								<TaskIconImage 
									keyToAttach="firstMic"
									imageSrc="/static/images/UI/Icon_Mic-01.png"/>
							</div>;
		// Sets to true if this task is the active task
		if(this.props.index === this.props.currentTaskIndex) {
			if (this.props.micActive) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar" 
							imageSrc="/static/images/UI/Icon_Star-01.png" 
							transition = "activateTaskStar"/>

						<TaskIconImage 
							keyToAttach="iconMic" 
							imageSrc="/static/images/UI/Icon_Mic-01.png" 
							transition ="activateTaskMic"/>
					</div>
				)			
			} else if (this.props.correctAnswerState) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar2" 
							imageSrc="/static/images/UI/Icon_Star-01.png" 
							transition="taskCorrectStar"/>
						<TaskIconImage
							keyToAttach="coins" 
							imageSrc="/static/images/UI/Icon_10coins_flat_nostar-01.png" 
							transition="taskCorrectCoins"/>
					</div>
				)
			} else if (this.props.wrongAnswerState) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar3" 
							imageSrc="/static/images/UI/Icon_Star-01.png" />
						<TaskIconImage 
							keyToAttach="questionMark" 
							imageSrc="/static/images/UI/Icon_Questionmark-01.png"/>
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