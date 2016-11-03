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
			vocabData: {
				'currentWordIndex' : 0,
				'lastAnswer' : "",
				'score' : 0,
				'lang' : 'zh-CN',
				'list' :
				[
					{
						'task' : 'Say Hi ',
						'answer' : "你好",
						'pinyin' : 'nǐ hǎo',
						'correct' : false,
						'tries': 0
					},
					{
						'task' : "Ask how they're doing (Method 1)",
						'answer' : "怎么样",
						'pinyin' : 'zěnme yàng',
						'correct' : false,
						'tries' : 0
					},
					{
						'task' : "Ask how they're doing (Method 2)",
						'answer' : '你好吗',
						'pinyin' : 'nǐ hǎo ma',
						'correct' : false,
						'tries' : 0
					}
				]
			},
			micActive: false,
			userAnswer: "",
			showPinyin: false

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

		this.setState (
			{
				vocabData: newVocabData
			}
		)
	},
	setNewIndex: function(newIndex) {
		var newVocabData = this.state.vocabData;
		newVocabData.currentWordIndex = newIndex;
		this.setState({vocabData: newVocabData});
	},
	handleUserAnswer: function() {
		var that = this;
		console.log(this.state.vocabData);

		var possibleAnswers = this.state.vocabData.list[this.state.vocabData.currentWordIndex].answer;

		SpeechRecognition.activateSpeech(possibleAnswers, this.state.vocabData.lang)
			.then(function(userAnswer) {
				// Need to set var here, otherwise loses it in setState
				console.log(userAnswer);
				var answer = userAnswer;
				if (userAnswer !== null) {
					console.log("This is user's answer " + answer);
					that.setState(
						{
							userAnswer: userAnswer,
							micActive: false
						},
						that.props.checkAnswer(userAnswer)		
					)
				}
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

		// If correct, update info
		var correctAnswer = false;
		newVocabData.list[index].name.forEach(function(possibleWord) {
			if (userAnswer === possibleWord) {
				correctAnswer = true;
			}
		})
		if (correctAnswer) {
			newVocabData.list[index].correct = true;
			newVocabData.score +=1;
		} else {
			newVocabData.list[index].correct = false;
			newVocabData.list[index].tries += 1;
		}
		// Store their guess as the most recent guess
		newVocabData.lastAnswer = userAnswer;
		this.setState (
			{
				vocabData: newVocabData
			}
		)
	},
	changePinyinDisplay: function() {
		this.setState({showPinyin: !this.state.showPinyin}, console.log(this.state.showPinyin));
		console.log(this.state.showPinyin);
	},
    render: function(){
		if (this.props.practiceMode) {
			var currentWordIndex = this.state.vocabData.currentWordIndex;
			var vocabList = this.state.vocabData.list;
			var currentWordObject = vocabList[currentWordIndex];
			console.log(currentWordObject);
			return (
				<div className="practiceContainer">
					<PracticeHeader 
						currentWordObject={currentWordObject}/>
		       		<PracticeFlashCard
		       			currentWordIndex={currentWordIndex}
		       			vocabList={vocabList}
		       			currentWordObject={currentWordObject} 
		       			setNewIndex={this.setNewIndex} 
		       			changePinyinDisplay={this.changePinyinDisplay}
		       			showPinyin={this.state.showPinyin}/>
		       		<PracticeFooter 
		       			micActive={this.state.micActive}
		       			onMicActivate={this.handleMicActivate}
		       			onMicDeactivate={this.handleMicDeactivate} />
		       	</div>
	       	)   		
    	} else {
    		return null;
    	}


   }
})

module.exports = PracticeContainer;

PracticeContainer.propTypes = {
	practiceMode: PropTypes.bool.isRequired
}
