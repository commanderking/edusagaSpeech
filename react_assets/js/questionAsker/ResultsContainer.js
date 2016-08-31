var React = require('react');
var PropTypes = React.PropTypes;
var ResultsBase = require('./components/ResultsBase');


var ResultsContainer = React.createClass({
	render: function() {
		if (this.props.sceneComplete === false) {
			return null
		} else {
			return (
				<div className="menuContainer">
					<h1 className="menuHeader">LEVEL COMPLETE!</h1>
					<ResultsBase {...this.props} />
				</div>)
		}
	}
});

ResultsContainer.propTypes = {
	sceneComplete: PropTypes.bool.isRequired,
	loadSceneData: PropTypes.func.isRequired,
	completedTasks: PropTypes.array.isRequired,
	charProfilePic: PropTypes.string.isRequired
}

module.exports = ResultsContainer;