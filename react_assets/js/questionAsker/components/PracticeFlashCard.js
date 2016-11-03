var React = require('react');
var PropTypes = React.PropTypes;
var FlashCardHeader = require('./FlashCardHeader');
var FlashCardContent = require('./FlashCardContent');

var PracticeFlashCard = React.createClass({
	nextVocab: function() {
		var index = this.props.currentWordIndex;
		// If at end of Vocab list, loop back, otherwise move to next one
		var newIndex = index >= this.props.vocabList.length -1 ? 0 : index++;
		/*
		if (index >= this.props.vocabList.length - 1) {
			index = 0;
		} else {
			index++;
		}
		*/
		this.props.setNewIndex(index);
	},
	previousVocab: function() {
		var index = this.props.currentWordIndex;
		var newIndex = index <= 0 ? this.props.vocabList.length - 1 : index--;
		/*
		if (index <= 0 ) {
			index = this.props.vocabList.length - 1;
		} else {
			index--;
		}
		*/
		this.props.setNewIndex(index);
	},
	render: function() {
		console.log(this.props.currentWordIndex);
		return (
			<div className="flashCardWrapper">
				<div className="leftArrow arrow" onClick={this.previousVocab}>
					<span className="glyphicon glyphicon glyphicon-triangle-left" aria-hidden="true"></span>
				</div>
				<FlashCardHeader 
					currentWordObject={this.props.currentWordObject}
					changePinyinDisplay={this.props.changePinyinDisplay}/>
				<FlashCardContent 
					currentWordObject={this.props.currentWordObject}
					changePinyinDisplay={this.props.changePinyinDisplay}
					showPinyin={this.props.showPinyin} />
				<div className="rightArrow arrow" onClick={this.nextVocab}>
					<span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
				</div>
			</div>	
		)
	}
});

module.exports = PracticeFlashCard;

PracticeFlashCard.propTypes = {
	currentWordObject: PropTypes.object.isRequired,
	changePinyinDisplay: PropTypes.func.isRequired,
	showPinyin: PropTypes.bool.isRequired
}