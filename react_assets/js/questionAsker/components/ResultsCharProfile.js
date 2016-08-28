var React = require('react');
var PropTypes = React.PropTypes;
var Constants = require('../../helpers/Constants');

var ResultsCharProfile = React.createClass({
	render: function() {
		// Get default profile image source
		var charProfilePic = Constants.IMAGE_PATH + this.props.charProfilePic;
		// Get comment

		// Calculate completion decimal
		var completionRate = this.props.coins / this.props.possible * 100;
		var resultsComment;
		if (completionRate > 90) {
			resultsComment = "I had a really great time! Your Chinese is awesome!"
		} else if (completionRate > 70) {
			resultsComment = "I had a good time! It was fun to talk in Chinese.";
		} else {
			resultsComment = "Nice talking to you!"
		}

		return (
			<div className="resultsCharProfile">
				<img src={charProfilePic} />
				<div className="textContainer">
					<h3>{this.props.charName}</h3>
					<h4>{resultsComment}</h4>
				</div>
			</div>
		)
	}
});

ResultsCharProfile.propTypes = {
	charProfilePic: PropTypes.string.isRequired
}


module.exports = ResultsCharProfile;