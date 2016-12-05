var React = require('react');
var PropTypes = React.PropTypes;
var FlashCardHeader = require('./FlashCardHeader');
var FlashCardContent = require('./FlashCardContent');

var PracticeFlashCard = React.createClass({
	render: function() {
		return (
			<div className="flashCardWrapper">
				<FlashCardHeader 
					currentWordObject={this.props.currentWordObject}
					playSpeechSynth={this.props.playSpeechSynth}/>
				<FlashCardContent 
					currentWordObject={this.props.currentWordObject}
					changePinyinDisplay={this.props.changePinyinDisplay}
					showPinyin={this.props.showPinyin} 
					userAnswer={this.props.userAnswer}/>
			</div>
		)
	}
});

module.exports = PracticeFlashCard;

PracticeFlashCard.propTypes = {
	currentWordObject: PropTypes.object.isRequired,
	showPinyin: PropTypes.bool.isRequired,
	userAnswer: PropTypes.string.isRequired,
	playSpeechSynth: PropTypes.func.isRequired
}