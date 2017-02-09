var React = require('react')
var PropTypes = React.PropTypes;

var EpisodeTagList = React.createClass({
	getInitialState: function() {
		return {
			showMoreEpisodes: false
		}
	},
	render: function() {
		// Only display the category if there are more than one episode present
		if (this.props.episodeList.length > 0) {
			return (
				<div className="episodeTopicWrapper">
					<div className="headerWrapper">
						<h2>{this.props.header}</h2>
					</div>
					<ul className="scenarioList">
						{this.props.episodeList}
					</ul>
				</div>
			)
		} else {
			return null;
		}
	}
});

module.exports = EpisodeTagList;
