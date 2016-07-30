var React = require('react');

var ImageContainer = React.createClass({
	nextVocab: function() {
		var index = this.props.currentWordIndex;
		// If at end of Vocab list, loop back, otherwise move to next one
		if (index >= this.props.vocabList.length - 1) {
			index = 0;
		} else {
			index++;
		}
		this.props.onImageChange(index);
	},
	previousVocab: function() {
		var index = this.props.currentWordIndex;
		if (index <= 0 ) {
			index = this.props.vocabList.length - 1;
		} else {
			index--;
		}
		this.props.onImageChange(index);
	},
	render: function() {
		return (
			<div className="foodWrapper">
				<div className="leftArrow arrow" onClick={this.previousVocab}>
					<span className="glyphicon glyphicon glyphicon-triangle-left" aria-hidden="true"></span>
				</div>
				<div className="imageWrapper">
					<img src={this.props.currentImage} />
				</div>
				<div className="rightArrow arrow" onClick={this.nextVocab}>
					<span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
				</div>
			</div>
		)
	}
});

module.exports = ImageContainer;