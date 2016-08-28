var React = require('react');

var ResultsCompletedTask = React.createClass({
	render: function() {
		console.log(this.props);
		console.log(this.props.taskCorrect);
		var icon = this.props.taskCorrect ? <span className="glyphicon glyphicon-star" aria-hidden="true"></span> :
			<span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span> 
		console.log(icon);
		return (
			<div className="completedTaskContainer">
				{icon}
				<span className="text">{this.props.taskText}</span>
			</div>
		)
	}
});

module.exports = ResultsCompletedTask;