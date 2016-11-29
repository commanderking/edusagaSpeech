var React = require('react');
var PropTypes = React.PropTypes;
var ResultsHeader = require('./ResultsHeader');
var ResultsSideBar = require('./ResultsSideBar');
var ResultsTasks= require('./ResultsTasks');


var ResultsBase = React.createClass({
	render: function() {
		return (
			<div className="resultsBaseContainer">
				<ResultsHeader 
					charProfilePic = {this.props.charProfilePic}
					charName = {this.props.charName}
					coins = {this.props.coins}
					possibleCoins = {this.props.possibleCoins}/>
				<div className="divSideBarContainer">
					<ResultsTasks 
						completedTasks = {this.props.completedTasks}
						showResultTaskAnswer = {this.props.showResultTaskAnswer}
						changeResultsTaskAnswers = {this.props.changeResultsTaskAnswers}
						locationEnglish = {this.props.locationEnglish} 
						locationChinese = {this.props.locationChinese}
						showResultTaskAnswerIndex = {this.props.showResultTaskAnswerIndex}
						playSpeechSynth = {this.props.playSpeechSynth}
						speechSynthPlaying = {this.props.speechSynthPlaying} />
					<ResultsSideBar 
						loadSceneData = {this.props.loadSceneData} 
						coins = {this.props.coins} 
						possibleCoins = {this.props.possibleCoins} />
				</div>
			</div>		
		)
	}
});

module.exports = ResultsBase;

ResultsBase.propTypes = {
	showResultTaskAnswer: PropTypes.bool.isRequired,
	changeResultsTaskAnswers: PropTypes.func.isRequired
}