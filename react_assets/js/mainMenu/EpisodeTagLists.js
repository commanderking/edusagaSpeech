var React = require('react')
var PropTypes = React.PropTypes;

var EpisodeTagList = React.createClass({
	getInitialState: function() {
		return {
			showMoreEpisodes: false
		}
	},
	displayMoreEpisodes: function() {
		this.setState({showMoreEpisodes: true});
		console.log(this.state.showMoreEpisodes);
	},
	render: function() {
		// Grab first three episodes of each topic
		var firstThreeEpisodes = [];
		for (var i=0; i<3; i++) {
			if (this.props.episodeList[i]) {
				firstThreeEpisodes.push(this.props.episodeList[i]);
			}
		}

		// Show See More button only if a category has more than three episodes and the see more episode button has not already been clicked
		var seeMoreButton = this.props.episodeList.length > 3 && this.state.showMoreEpisodes === false ? 
				<button className="buttonSeeMore"
					onClick={this.displayMoreEpisodes}>See More Episodes</button> : null;

		// Display 3 episodes or more episodes depending on showMoreEpisodes state
		var episodesToDisplay = this.state.showMoreEpisodes ? this.props.episodeList : firstThreeEpisodes;

		// Only display the category if there are more than one episode present
		if (this.props.episodeList.length > 0) {
			return (
				<div>
					<h2>{this.props.header}</h2>
					<ul className="scenarioList">
						{episodesToDisplay}
					</ul>
					{seeMoreButton}
				</div>
			)	
		} else {
			return null;
		}
	}
});

module.exports = EpisodeTagList;
