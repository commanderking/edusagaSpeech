var React = require('react')
var PropTypes = React.PropTypes;

function ActivitySummary (props) {
	/*--------------------------------------------
	Create task data based on aggregate student data
	--------------------------------------------*/

	// First get all possible taskIDs
	var taskIDArray = props.activityData[0].allTaskData.map(function(task,i) {
		return {
			"taskID" : task.taskID, 
			"taskText" : task.task};
	})

	var taskDataAggregate = taskIDArray.map(function(taskObject, i) {
		var taskCorrectTally = 0;
		var totalStudents = 0;
		// Loop over all the students
		props.activityData.map(function(student) {
			totalStudents += 1;
			// Loop over the student's answers, find matching task, see if task was correct
			var studentTask = student.allTaskData.map(function(thisTask) {
				if (thisTask.taskID === taskObject.taskID) {
					taskCorrectTally = thisTask.correct ? taskCorrectTally + 1 : taskCorrectTally
				}
			})
		})
		taskObject.totalCorrect = taskCorrectTally;
		taskObject.totalStudents = totalStudents;
		taskObject.percentageInteger = Math.floor(taskCorrectTally/totalStudents * 100);
		taskObject.percentageCorrect = taskObject.percentageInteger + "%";
		return taskObject;
	});


	var taskDataAggregateTable = taskDataAggregate.map(function(taskObject, i) {

		var classColor = props.scoreToColor(taskObject.totalCorrect, taskObject.totalStudents);

		return (
			<tr key={i} id={classColor}>
				<td>{taskObject.taskText}</td>
				<td>{taskObject.totalCorrect} / {taskObject.totalStudents} ({taskObject.percentageCorrect})</td>
				<td>0</td>
				<td>0</td>
			</tr>
		)
	})
	return (
		<div>
			<h1>Student Performance on Each Task - Activity 1</h1>
			<table className="taskTable table table-striped">
				<tbody>
					<tr>
						<th>Task</th>
						<th>% Correct</th>
						<th>% Used Hints</th>
						<th>% Skipped</th>
					</tr>
					{taskDataAggregateTable}
				</tbody>
			</table>
		</div>

	)
}

module.exports = ActivitySummary;