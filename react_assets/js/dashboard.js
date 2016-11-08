var React = require('react');
var ReactDOM = require('react-dom');
var StudentGradebook = require('./dashboard/components/StudentGradebook');
var ActivitySummary = require('./dashboard/components/ActivitySummary');
var ActivitySummaryStudent = require('./dashboard/components/ActivitySummaryStudent');
var Dashboard = React.createClass({
	getInitialState: function() {
		return {
			gradebookData : {},
			taskData: {},
			activityData: null,
			totalScore: 0,
		}
	},
	scoreToColor: function(score, maxScore) {
		var decimalScore = score/maxScore
		if (decimalScore >= .80) {
			return "green";
		} else if (decimalScore >= .60) {
			return "yellow";
		} else if (decimalScore >= .40) {
			return "orange";
		} else {
			return "red";
		}
	},
	loadDashboard: function() {
		var that = this;
		// Get all JSON for all activities in the teacher's data folder
		$.getJSON("/static/data/" + teacher + "/studentData/" + "sampleData.json", function(data) {})
			.success(function(data) {
				// Check total possible score based on length of task array
				var totalPossibleScore = data[0].allTaskData.length;

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

					// Comparing alphanumeric IDs and then sort
					var reA = /[^a-zA-Z]/g;
					var reN = /[^0-9]/g;
					function sortStudentID(a,b) {
						a = String(a.studentID);
						b = String(b.studentID);

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
				that.setState({activityData: activityData,
								totalScore: totalPossibleScore });
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
			//TODO: Implement display of summary of information
			/*
			// Summary metrics for activity (Average)
			var scoreArray = this.state.activityData.map(function(student, i) {
				return student.score;
			})
			var sum = scoreArray.reduce(function(a,b) { return a + b});
			var avg = sum / scoreArray.length;
			*/
			return (
				<div className="resultsContainer">
					<StudentGradebook 
						activityData={this.state.activityData}
						totalScore={this.state.totalScore}
						scoreToColor={this.scoreToColor}/> 

					<ActivitySummary 
						activityData={this.state.activityData}
						scoreToColor={this.scoreToColor} />

					<ActivitySummaryStudent
						activityData={this.state.activityData}/>
				</div>
			)
		}
	}
});

module.exports = Dashboard;

ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
