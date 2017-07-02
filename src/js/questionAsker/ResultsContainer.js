var React = require('react');
var PropTypes = React.PropTypes;
var ResultsBase = require('./components/ResultsBase');


var ResultsContainer = React.createClass({
	render: function() {
		if (this.props.sceneComplete === false || this.props.practiceMode === true) {
			return null
		} else {
			return (
				<div className="menuContainer">
					<h1 className="menuHeader">EPISODE COMPLETE!</h1>
					<ResultsBase {...this.props} />
				</div>)
		}
	}
});

ResultsContainer.propTypes = {
	sceneComplete: PropTypes.bool.isRequired,
	loadSceneData: PropTypes.func.isRequired,
	completedTasks: PropTypes.array.isRequired,
	getEmotionImagePath: PropTypes.func.isRequired,
	sceneMainChar: PropTypes.string.isRequired,
	showResultTaskAnswer: PropTypes.bool.isRequired,
	changeResultsTaskAnswers: PropTypes.func.isRequired
}

module.exports = ResultsContainer;
