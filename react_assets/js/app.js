var React = require('react');
var HeaderContainer = require('./containers/HeaderContainer.js');
var InputContainer = require('./containers/InputContainer.js');
var ImageContainer = require('./containers/ImageContainer.js');

module.exports = React.createClass({
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
						'name' : ['牛肉面', "面条"],
						'imgURL' : 'http://image82.360doc.com/DownloadImg/2015/02/1709/50263666_2.jpg',
						'correct' : null,
						'tries': 0
					},
					{
						'name' : ['炒饭', '蛋炒饭', '虾仁炒饭'],
						'imgURL' : 'http://www.51dayaji.com/wp-content/uploads/2014/11/%E7%82%92%E9%A5%AD%E7%9A%84%E5%81%9A%E6%B3%953.jpg',
						'correct' : null,
						'tries' : 0
					},
					{
						'name' : ['汉堡', '汉堡包'],
						'imgURL' : 'http://science-all.com/images/wallpapers/hamburger/hamburger-6.PNG',
						'correct' : null,
						'tries' : 0
					},
					{
						'name' : ['寿司'],
						'imgURL' : 'https://img.grouponcdn.com/deal/fmPws6o2uTweCftZu7yj/p4-2048x1229/v1/c700x420.jpg',
						'correct' : null,
						'tries' : 0
					},
					{
						'name' : ['薯条', '炸薯条'],
						'imgURL' : 'http://ali.xinshipu.cn/20140121/original/1390268120219.jpg',
						'correct' : null,
						'tries' : 0
					},
					{
						'name' : ['冰淇淋'],
						'imgURL' : 'http://www.americasdairyland.com/assets/images/EWC/Ice-Cream-Hdr.jpg',
						'correct' : null,
						'tries' : 0
					}
				]
			}
		}
	},
	handleImageChange: function(newIndex) {
		var newVocabData = this.state.vocabData;
		newVocabData.currentWordIndex = newIndex;

		// Reset text based on if student already guessed the answer correctly before
		if (newVocabData.list[newIndex].correct) {
			newVocabData.lastAnswer = newVocabData.list[newIndex].name;
		} else {
			newVocabData.lastAnswer = ""
		}

		this.setState (
			{
				vocabData: newVocabData
			}
		)
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
		console.log(this.state.vocabData);
	},
    render: function(){
   		var currentWordIndex = this.state.vocabData.currentWordIndex;
   		var vocabList = this.state.vocabData.list;
        return (
       		<div className="practiceContainer">
	       		<HeaderContainer />
	       		<ImageContainer 
	       			currentWordIndex = {currentWordIndex}
	       			currentImage = {this.state.vocabData.list[currentWordIndex].imgURL}
	       			vocabList = {vocabList} 
	       			onImageChange = {this.handleImageChange} />
	       		<InputContainer 
	       			vocabList = {vocabList} 
	       			currentWordIndex = {currentWordIndex} 
	       			lang = {this.state.vocabData.lang}
	       			checkAnswer = {this.checkAnswer} 
	       			score = {this.state.vocabData.score}
	       			lastAnswer = {this.state.vocabData.lastAnswer}
	       			wordCorrect = {vocabList[currentWordIndex].correct} 
	       			tries = {vocabList[currentWordIndex].tries} />

	       	</div>
       	)

   }
})
