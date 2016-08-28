var React = require('react');
var PropTypes = React.PropTypes;
var ResultsHeader = require('./ResultsHeader');
var ResultsSideBar = require('./ResultsSideBar');
var ResultsTasks= require('./ResultsTasks');


var ResultsBase = React.createClass({
	render: function() {
		return (
			<div className="resultsBaseContainer">
				<ResultsHeader />
				<ResultsTasks 
					completedTasks = {this.props.completedTasks} 
					charProfilePic = {this.props.charProfilePic} 
					charName = {this.props.charName} 
					coins = {this.props.coins}
					possibleCoins = {this.props.possibleCoins} />
				<ResultsSideBar 
					loadSceneData = {this.props.loadSceneData} 
					coins = {this.props.coins} 
					possibleCoins = {this.props.possibleCoins} />
			</div>		
		)
	}
});

module.exports = ResultsBase;