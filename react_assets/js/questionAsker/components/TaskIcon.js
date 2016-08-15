var React = require('react');
var TaskIconImage = require('./TaskIconImage');
var TransitionsCSS = require('../../../../static/css/transitions.css');
var TransitionGroup = require('react-addons-transition-group');
var Transitions = require('../../helpers/transitions.js');

var TaskIcon = React.createClass({
	imageTransition: function(DOMnode, thisContext) {
		TweenMax.fromTo(DOMnode, 2, 
			{ width: 0, height: 0, scale: 0.2, opacity: 0, rotation: -180, left: -50 }, 
			{ width: 50, height: 50, scale: 1, opacity: 1, rotation: 0, left: -25,
			ease: Expo.easeInOut, onCompleteScope: thisContext });
	},
	render: function() {
		// Default TaskIcon image when nothing is being recorded or answered
		var taskIconImage = <div className="taskIconDiv">
								<TaskIconImage 
									imageSrc="/static/images/UI/Icon_Mic-01.png"
									imageTransition = {this.imageTransition} />
							</div>;
		// Sets to true if this task is the active task
		if(this.props.index === this.props.currentTaskIndex) {
			if (this.props.micActive) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar" 
							imageTransition = {this.imageTransition}
							imageSrc="/static/images/UI/Icon_Star-01.png" />

						<TaskIconImage 
							keyToAttach="iconMic" 
							imageSrc="/static/images/UI/Icon_Mic-01.png" 
							imageTransition = {this.imageTransition} />
					</div>
				)			
			} else if (this.props.correctAnswerState) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							imageSrc="/static/images/UI/Icon_Star-01.png"
							imageTransition = {this.imageTransition} />
						<TaskIconImage 
							imageSrc="/static/images/UI/Icon_10coins_flat_nostar-01.png" 
							imageTransition = {this.imageTransition}/>
					</div>
				)
			} else if (this.props.wrongAnswerState) {
				taskIconImage = (
					<div className="taskIconDiv">
						<TaskIconImage 
							keyToAttach="iconStar2" 
							imageSrc="/static/images/UI/Icon_Star-01.png"
							imageTransition = {this.imageTransition}/>
						<TaskIconImage keyToAttach="questionMark" imageSrc="/static/images/UI/Icon_Questionmark-01.png"/>
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