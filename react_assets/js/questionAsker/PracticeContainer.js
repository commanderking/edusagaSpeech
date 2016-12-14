var React = require('react');
var PropTypes = React.PropTypes;
var HeaderContainer = require('../containers/HeaderContainer.js');
var InputContainer = require('../containers/InputContainer.js');
var ImageContainer = require('../containers/ImageContainer');
var PracticeHeader = require('./components/PracticeHeader');
var PracticeFooter = require('./components/PracticeFooter');
var PracticeFlashCard = require('./components/PracticeFlashCard');
var SpeechRecognition = require('../helpers/SpeechRecognition.js');

var PracticeContainer = React.createClass({
	getInitialState: function() {
		return {
			vocabData: {},
			micActive: false,
			userAnswer: "",
			showPinyin: false,
			updateVocabForReview: true
		}
	},
	componentWillMount: function() {
		this.setState({vocabData: this.props.vocabList}, console.log(this.state.vocabData));
	},
	componentWillUpdate: function() {
		if (this.props.sceneComplete && this.state.updateVocabForReview) {
			this.setState({vocabData: this.props.vocabPracticeData, updateVocabForReview: false});
		}
	},
	handleImageChange: function(newIndex) {
		var newVocabData = this.state.vocabData;
		newVocabData.currentWordIndex = newIndex;

		// Reset text based on if student already guessed the answer correctly before
		if (newVocabData.list[newIndex].correct) {
			newVocabData.lastAnswer = newVocabData.list[newIndex].answer;
		} else {
			newVocabData.lastAnswer = ""
		}
		this.setState ({vocabData: newVocabData});
	},
	setNewIndex: function(newIndex) {
		var newVocabData = this.state.vocabData;
		newVocabData.currentWordIndex = newIndex;
		this.setState({vocabData: newVocabData, userAnswer: ""});
		// Reset userAnswer

	},
	handleUserAnswer: function() {
		var that = this;
		var possibleAnswers = this.state.vocabData.list[this.state.vocabData.currentWordIndex].answer;

		SpeechRecognition.activateSpeech(possibleAnswers, this.state.vocabData.lang)
			.then(function(userAnswer) {
				// Need to set var here, otherwise loses it in setState
				console.log(userAnswer);
				var answer = userAnswer;

				// Case where user cancels their answer, SpeechRecognition.js gives back "Cancel Speech", don't save that if that's the case
				if (userAnswer === "Cancel Speech") {
					userAnswer = "";
				}
				that.setState(
					{
						userAnswer: userAnswer,
						micActive: false
					},
					that.checkAnswer(userAnswer)
				);
				that.handleMicDeactivate();
			}
		);
	},
	handleMicActivate: function() {
		this.setState({micActive: true});
		this.handleUserAnswer();
	},
	handleMicDeactivate: function() {
		this.setState({micActive: false});
	},
	checkAnswer: function(userAnswer) {
		var newVocabData = this.state.vocabData;
		var index = this.state.vocabData.currentWordIndex;
		var correctAnswer = false;

		// Remove any punctuation marks when checking answer
		var answer = newVocabData.list[index].answer.replace(/[.,。，\/#?？。!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g, '');
		console.log(answer);

		if (userAnswer === answer) {
			correctAnswer = true;
		}

		if (correctAnswer) {
			newVocabData.list[index].correct = true;
			newVocabData.score +=1;
		} else {
			newVocabData.list[index].correct = false;
			newVocabData.list[index].tries += 1;
		}

		newVocabData.lastAnswer = userAnswer;
		this.setState ({vocabData: newVocabData});
	},
	changePinyinDisplay: function() {
		this.setState({showPinyin: !this.state.showPinyin});
	},
	nextVocab: function() {
		var index = this.state.vocabData.currentWordIndex;
		// If at end of Vocab list, loop back, otherwise move to next one
		var newIndex = index >= this.state.vocabData.list.length -1 ? 0 : index+1;
		this.setNewIndex(newIndex);
	},
	previousVocab: function() {
		var index = this.state.vocabData.currentWordIndex;
		var newIndex = index <= 0 ? this.state.vocabData.list.length - 1 : index-1;
		this.setNewIndex(newIndex);
	},
    render: function(){
		if (this.props.practiceMode) {
			var currentWordIndex = this.state.vocabData.currentWordIndex;
			var vocabList = this.state.vocabData.list;
			var currentWordObject = vocabList[currentWordIndex];
			return (
				<div className="practiceContainer">
					<PracticeHeader 
						currentWordObject={currentWordObject}/>
					<div className="practiceInner">
			       		<PracticeFlashCard
			       			currentWordIndex={currentWordIndex}
			       			vocabList={vocabList}
			       			currentWordObject={currentWordObject} 
			       			setNewIndex={this.setNewIndex} 
			       			showPinyin={this.state.showPinyin}
			       			userAnswer={this.state.userAnswer}
			       			playSpeechSynth={this.props.playSpeechSynth}/>
			       		<PracticeFooter 
			       			micActive={this.state.micActive}
			       			onMicActivate={this.handleMicActivate}
			       			onMicDeactivate={this.handleMicDeactivate} 
			       			changePracticeMode={this.props.changePracticeMode}
			       			playSpeechSynth={this.props.playSpeechSynth}
			       			currentWordObject={currentWordObject}
			       			changePinyinDisplay={this.changePinyinDisplay}
			       			showPinyin={this.state.showPinyin}
			       			previousVocab={this.previousVocab}
			       			nextVocab={this.nextVocab}
			       			speechSynthPlaying={this.props.speechSynthPlaying} />
			    	</div>
		       	</div>
	       	)   		
    	} else {
    		return null;
    	}


   }
})

module.exports = PracticeContainer;

PracticeContainer.propTypes = {
	practiceMode: PropTypes.bool.isRequired,
	changePracticeMode: PropTypes.func.isRequired,
	playSpeechSynth: PropTypes.func.isRequired,
	speechSynthPlaying: PropTypes.bool.isRequired,
	sceneComplete: PropTypes.bool.isRequired
}
