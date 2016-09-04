var React = require('react');
var PropTypes = React.PropTypes;
var ResultsCharProfile = require('./ResultsCharProfile');
var ResultsCompletedTask = require('./ResultsCompletedTask');

var ResultsTasks = React.createClass({
	render: function() {
		// Function to render all completed tasks
		var completedTasks = this.props.completedTasks;
		var d = new Date();
		var date = d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getFullYear() + "年";
		var locationEnglish = this.props.locationEnglish.toUpperCase();
		var tasks = completedTasks.map(function(task, i) {
			return (<ResultsCompletedTask
						key = {task.task}
						index = {i}
						taskText={task.task}
						taskCorrect = {task.correct}
						attemptedAnswers = {task.attemptedAnswers}
						possibleCorrectAnswers = {task.possibleAnswers[0].answers} />)
		})

		return (
			<div className="resultsTasks">
				<div className="sceneInfo">
					<h3>{locationEnglish} ({this.props.locationChinese})</h3>
					<p>{date}</p>
				</div>
				<div className="completedTasks">
					{tasks}
				</div>

			</div>
		)
	}
});

ResultsTasks.propTypes = {
	completedTasks: PropTypes.array.isRequired
}

module.exports = ResultsTasks;