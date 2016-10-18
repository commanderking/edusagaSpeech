var React = require('react')
var PropTypes = React.PropTypes;

function EpisodeTagList (props) {
	if (props.episodeList.length > 0) {
		console.log(props.episodeList);
		return (
			<div>
				<h2>{props.header}</h2>
				<ul className="scenarioList">
					{props.episodeList}
				</ul>
			</div>
		)	
	} else {
		return null;
	}

}

module.exports = EpisodeTagList;