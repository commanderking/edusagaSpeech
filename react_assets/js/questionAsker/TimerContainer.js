var React = require('react');

var TimerContainer = React.createClass({
	render: function() {
		if (this.props.taskPause || this.props.scenarioOn) {
			return null;
		} else {
			return (
				<div className="timerContainer">
					<span className="glyphicon glyphicon-time" aria-hidden="true"></span>
					<span className="timeText">{this.props.timeRemaining}</span>
				</div>
			)			
		}

	}
});

module.exports = TimerContainer;