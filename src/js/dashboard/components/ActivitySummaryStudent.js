var React = require('react')
var PropTypes = React.PropTypes;

function ActivitySummaryStudent (props) {
	// Create task data for all students and their individual activity data
	var taskDataForAllIndvidiualStudents = props.activityData.map(function(student, i){
		var taskDataForIndividualStudent = props.activityData[i].allTaskData.map(function(task, j) {
			var attemptedAnswersString = task.attemptedAnswers.map(function(answer, i) {
				return answer + ", "; 
			});
			var taskCorrect = task.correct ? <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> :
											<span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
			return (
				<tr key={j}>
					<td>{task.task}</td>
					<td>{taskCorrect}</td>
					<td>0</td>
					<td>{task.attemptedAnswers.length}</td>
					<td>{attemptedAnswersString}</td>
				</tr>
			)
		})
		return (
			<div className="individualTaskResults" key={i}> 
				<h2>{student.studentID}</h2>
				<table className="individualTaskTable table table-striped">
					<tbody>
						<tr>
							<th>Task</th>
							<th>Correct</th>
							<th>Hint Used</th>
							<th>Attempts</th>
							<th>Attempted Phrases</th>
						</tr>
						{taskDataForIndividualStudent}
					</tbody>
				</table>
			</div>
		)

	});
	return (
		<div>
			<h1>Individual Data for Students</h1>
			{taskDataForAllIndvidiualStudents}
		</div>
	)
}

module.exports = ActivitySummaryStudent;