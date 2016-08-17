var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var Transitions = require('../../helpers/Transitions.js');

var CharacterImage = React.createClass({
	componentDidUpdate: function() {
		// If correct or wrong answer, character has special transition entrance
		var node = ReactDOM.findDOMNode(this);
		if (this.props.correctAnswerState) {
			Transitions.taskCorrect.character(node);
		} else if (this.props.wrongAnswerState) {
			Transitions.taskWrong.character(node);
		}
	},
	render: function() {
		return (
			<img className="charImage" src={this.props.src} />
		)
	}
});

CharacterImage.propTypes = {
	correctAnswerState: PropTypes.bool.isRequired,
	wrongAnswerState: PropTypes.bool.isRequired,
	src: PropTypes.string.isRequired
}


module.exports = CharacterImage;