var React = require('react');

var ResultsCompletedTask = React.createClass({
	render: function() {
		var icon = this.props.taskCorrect ? <span className="glyphicon glyphicon-star" aria-hidden="true"></span> :
			<span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span> 
		return (
			<div className="completedTaskContainer">
				{icon}
				<span className="text">{this.props.taskText}</span>
			</div>
		)
	}
});

module.exports = ResultsCompletedTask;