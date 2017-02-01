var React = require('react')
var PropTypes = React.PropTypes;

function EpisodeSelectSidebar (props) {
	return (
		<div className="sidebarWrapper">
			<h1>{props.episodeName}</h1>
			<img className="characterImage" src={props.episodeCharacterImage} />
			<p><b>Scenario:</b> {props.episodeDescription}</p>
			<div><b>Can Do Statements:</b> <br /> {props.episodeCanDoStatements}</div>
		</div>
	)
}

module.exports = EpisodeSelectSidebar;

EpisodeSelectSidebar.propTypes = {

}
