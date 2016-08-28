var React = require('react');
var PropTypes = React.PropTypes;
var ResultsCharProfile = require('./ResultsCharProfile');
var ResultsCompletedTask = require('./ResultsCompletedTask');

var ResultsTasks = React.createClass({
	render: function() {
		// Function to render all completed tasks
		var completedTasks = this.props.completedTasks;
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
				<ResultsCharProfile 
					charProfilePic = {this.props.charProfilePic}
					charName = {this.props.charName}
					coins = {this.props.coins}
					possibleCoins = {this.props.possibleCoins} />
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