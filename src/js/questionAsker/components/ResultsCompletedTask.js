var React = require('react');
var PropTypes = React.PropTypes;
var SpeechableSpan = require('./SpeechableSpan');


var ResultsCompletedTask = React.createClass({
	render: function() {
		var icon = this.props.taskCorrect ? <span className="glyphicon glyphicon-star" aria-hidden="true"></span> :
			<span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
		var showAnswersSpan = this.props.taskCorrect ? 
			null : <span 
						className="glyphicon glyphicon-menu-down" 
						aria-hidden="true"
						onClick={() => this.props.changeResultsTaskAnswers(this.props.index)}>
						</span>;
		var answerSpan = this.props.showResultTaskAnswer && this.props.index === this.props.showResultTaskAnswerIndex ? 
			<div>
				<span className="answerDescription">One way to accomplish task: </span>
				<SpeechableSpan
					feedbackText = {this.props.possibleCorrectAnswers[0]} 
					clickFunction = {() => this.props.playSpeechSynth(this.props.possibleCorrectAnswers[0])}/>
			</div> : null;

		return (
			<div className="completedTaskContainer">
				{icon}
				<span className="text">{this.props.taskText}</span>
				{showAnswersSpan}
				{answerSpan}
			</div>
		)
	}
});

module.exports = ResultsCompletedTask;

ResultsCompletedTask.propTypes = {
	completedTasks: PropTypes.array.isRequired,
	showResultTaskAnswer: PropTypes.bool.isRequired,
	changeResultsTaskAnswers: PropTypes.func.isRequired
}