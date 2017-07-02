var React = require('react')
var PropTypes = React.PropTypes;

function ActivityGradeBook (props) {
	if (props.activityData === null) {
		return null;
	} else {
		var studentActivityData = props.activityData.map(function(student, i) {
			var color = props.scoreToColor(student.score, props.totalScore);
			var percentageInteger = Math.floor(student.score/props.totalScore * 100);
			var displayScore = student.score + " / " + props.totalScore + " (" + percentageInteger + "%)";
			return (
				<tr id={color} key={i}>
					<td>{student.studentID}</td>
					<td>{displayScore}</td>
				</tr>
			)
		})
	}

	return (
		<div>
			<h1>Activity Data!</h1>
			<table className="averageScoreTable table table-striped">
				<tbody>
					<tr>
						<th>Student ID</th>
						<th>Activity 1: {props.activityData.activityName}</th>
					</tr>
					{studentActivityData}
				</tbody>
			</table>
		</div>
	)
}

module.exports = ActivityGradeBook;