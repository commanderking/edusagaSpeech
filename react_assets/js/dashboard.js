var React = require('react');
var ReactDOM = require('react-dom');

var Dashboard = React.createClass({
	getInitialState: function() {
		return {
			gradebookData : {},
			taskData: {},
			activityData: null
		}
	},
	loadDashboard: function() {
		var that = this;
		// Get all JSON for all activities in the teacher's data folder
		$.getJSON("/static/data/" + teacher + "/studentData/" + "sampleData.json", function(data) {})
			.success(function(data) {
				// Narrow all entries to one entry / student
				var activityData = []
				data.forEach(function(studentResponse, i) {
					var currentStudentID = studentResponse.studentID;

					var studentAlreadyEntered = false;
					var enteredIndex;
					var enteredResponse;
					// Loop through activityData array to see if student already has a response
					activityData.forEach(function(alreadyEnteredResponse, j) {
						if (studentResponse.studentID === alreadyEnteredResponse.studentID) {
							studentAlreadyEntered = true;
							enteredResponse = alreadyEnteredResponse;
							enteredIndex = j;
						}
					})
					if (studentAlreadyEntered === true) {
						// Do a comparison to see which one got the higher score, keep the higher score entry
						if (studentResponse.score > enteredResponse.score) {
							activityData[enteredIndex] = studentResponse;
						}
					}
					else if (studentAlreadyEntered === false) {
						// Add to the array
						var studentIDUpperCase = studentResponse.studentID.toUpperCase();
						activityData.push({
							"studentID" : studentIDUpperCase,
							"activityID" : "",
							"score" : studentResponse.score,
							"allTaskData" : studentResponse.allTaskData
						});
					}

					var reA = /[^a-zA-Z]/g;
					var reN = /[^0-9]/g;
					function sortStudentID(a,b) {
						console.log(a);
						a = String(a.studentID);
						b = String(b.studentID);
						console.log(a);
						console.log(b);

						var aA = a.replace(reA, "");
						var bA = b.replace(reA, "");
						if(aA === bA) {
					    	var aN = parseInt(a.replace(reN, ""), 10);
					    	var bN = parseInt(b.replace(reN, ""), 10);
					    	return aN === bN ? 0 : aN > bN ? 1 : -1;
					    } else {
					        return aA > bA ? 1 : -1;
					    }
					}
					activityData.sort(sortStudentID);
				})
				that.setState({activityData: activityData});
			})
	},
	componentDidMount: function() {
		this.loadDashboard();
	},
	render: function() {
		var that = this;
		if (this.state.activityData === null) {
			return null;
		} else {
			var studentActivityData = this.state.activityData.map(function(student, i) {
				return (
					<tr key={i}>
						<td>{student.studentID}</td>
						<td>{student.score}</td>
					</tr>
				)
			})

			// Summary metrics for activity (Average)
			var scoreArray = this.state.activityData.map(function(student, i) {
				return student.score;
			})
			var sum = scoreArray.reduce(function(a,b) { return a + b});
			var avg = sum / scoreArray.length;
			console.log(avg);


			// Create task data based on one student's activity data

			// Create task data for all students and their individual activity data
			var taskDataForAllIndvidiualStudents = this.state.activityData.map(function(student, i){
				var taskDataForIndividualStudent = that.state.activityData[i].allTaskData.map(function(task, j) {
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


			/*--------------------------------------------
			Create task data based on aggregate student data
			--------------------------------------------*/

			// First get all possible taskIDs
			var taskIDArray = this.state.activityData[0].allTaskData.map(function(task,i) {
				return {
					"taskID" : task.taskID, 
					"taskText" : task.task};
			})

			var taskDataAggregate = taskIDArray.map(function(taskObject, i) {
				var taskCorrectTally = 0;
				var totalStudents = 0;
				// Loop over all the students
				that.state.activityData.map(function(student) {
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
				var classColor;
				if (taskObject.percentageInteger >= 80) {
					classColor = "green";
				} else if (taskObject.percentageInteger >=60) {
					classColor = "yellow"
				} else {
					classColor = "red"
				}
				return (
					<tr key={i} className={classColor}>
						<td>{taskObject.taskText}</td>
						<td>{taskObject.totalCorrect} / {taskObject.totalStudents} ({taskObject.percentageCorrect})</td>
						<td>0</td>
						<td>0</td>
					</tr>
				)
			})

			return (
				<div className="resultsContainer">
					<h1>Activity Data!</h1>
					<table className="averageScoreTable table table-striped">
						<tbody>
							<tr>
								<th>Student ID</th>
								<th>Activity 1: {this.state.activityData.activityName}</th>
							</tr>
							{studentActivityData}
						</tbody>
					</table>

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

					<h1>Individual Data for Students</h1>
					{taskDataForAllIndvidiualStudents}

				</div>
			)
		}
	}
});

module.exports = Dashboard;

ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
