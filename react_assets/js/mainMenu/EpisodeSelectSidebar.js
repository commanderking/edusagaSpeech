var React = require('react')
var PropTypes = React.PropTypes;

function EpisodeSelectSidebar (props) {
	console.log(props.episodeCanDoStatements);
	return (
		<div className="sidebarWrapper">
			<h1>{props.episodeName}</h1>
			<img className="characterImage" src={props.episodeCharacterImage} />
			<div>
				<p><b>Scenario:</b></p>
				<p>{props.episodeDescription}</p>
			</div>
			<div><b>Can Do Statements:</b>
				<ul>{props.episodeCanDoStatements}</ul>
			</div>
		</div>
	)
}

module.exports = EpisodeSelectSidebar;

EpisodeSelectSidebar.propTypes = {
	episodeCanDoStatements : PropTypes.array.isRequired,
	episodeName : PropTypes.string.isRequired,
	episodeCharacterImage: PropTypes.string.isRequired,
	episodeDescription: PropTypes.string.isRequired

}
