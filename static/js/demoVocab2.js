var vocabData = {
	'currentWordIndex' : 0,
	'score' : 0,
	'lang' : 'zh-CN',
	'list' :
	[
		{
			'name' : '牛肉面',
			'imgURL' : 'http://image82.360doc.com/DownloadImg/2015/02/1709/50263666_2.jpg',
			'correct' : false,
			'tries': 0
		},
		{
			'name' : '炒饭',
			'imgURL' : 'http://www.51dayaji.com/wp-content/uploads/2014/11/%E7%82%92%E9%A5%AD%E7%9A%84%E5%81%9A%E6%B3%953.jpg',
			'correct' : false,
			'tries' : 0
		},
		{
			'name' : '汉堡',
			'imgURL' : 'http://science-all.com/images/wallpapers/hamburger/hamburger-6.PNG',
			'correct' : false,
			'tries' : 0
		},
		{
			'name' : '寿司',
			'imgURL' : 'https://img.grouponcdn.com/deal/fmPws6o2uTweCftZu7yj/p4-2048x1229/v1/c700x420.jpg',
			'correct' : false,
			'tries' : 0
		},
		{
			'name' : '薯条',
			'imgURL' : 'http://ali.xinshipu.cn/20140121/original/1390268120219.jpg',
			'correct' : false,
			'tries' : 0
		},
		{
			'name' : '冰淇淋',
			'imgURL' : 'http://www.americasdairyland.com/assets/images/EWC/Ice-Cream-Hdr.jpg',
			'correct' : false,
			'tries' : 0
		}
	]
};

var vocabController = {
	// Returns array of all the vocab list objects
	getAllVocabData: function() {
		return vocabData.list;
	},
	getCurrentVocabImage: function() {
		return vocabData.list[vocabData.currentWordIndex].imgURL;
	},
	// Returns the object of the current word
	getCurrentWord: function() {
		return vocabData.list[vocabData.currentWordIndex];
	},
	// Takes input from user and checks to see if they're correct; Updates view accordingly
	checkWord: function(wordToCheck) {
		vocabController.getAllVocabData().forEach(function(vocab, i) {
			if (wordToCheck == vocab.name) {
				// Find corresponding div and check it off
			}
		})
		if (wordToCheck == vocabController.getCurrentWord().name) {
			// Change 'correct' in list to true
			vocabData.list[vocabData.currentWordIndex].correct = true;
			vocabData.score++;
			return true;
		} else {
			vocabData.list[vocabData.currentWordIndex].tries++;
			return false;
		}
	},
	getNumberQuestions: function() {
		return vocabData.list.length;
	},
	nextVocab: function() {
		// If at end of Vocab list, loop back, otherwise move to next one
		if (vocabData.currentWordIndex >= vocabData.list.length - 1) {
			vocabData.currentWordIndex = 0;
		} else {
			vocabData.currentWordIndex++;
		}
		viewVocab.render();
		viewScore.renderOnNext();
	},
	// Returns true or false depending on whether user has already gotten the current word correct
	previousVocab: function() {
		if (vocabData.currentWordIndex <= 0 ) {
			vocabData.currentWordIndex = vocabData.list.length - 1;
		} else {
			vocabData.currentWordIndex--;
		}
		viewVocab.render();
		viewScore.renderOnNext();
	},

	// Checks if the current vocab is correct or not
	currentVocabCorrect: function() {
		console.log("currentVocabCorrect " + vocabData.list[vocabData.currentWordIndex].correct);
		return vocabData.list[vocabData.currentWordIndex].correct;
	},
	getScore: function() {
		return vocabData.score;
	},
	getTries: function() {
		return vocabData.list[vocabData.currentWordIndex].tries;
	}
};

var viewVocab = {
	init: function() {
		this.foodWrapper = $('.foodWrapper2');
		// Allow for skipping back and forth on Vocab
		this.leftArrow = $('.leftArrow');
		this.rightArrow = $('.rightArrow');
		this.rightArrow.click(function() {
			vocabController.nextVocab();
		});
		this.leftArrow.click(function() {
			vocabController.previousVocab();
		});
	},
	render: function() {
		var imagesHTML = '';
		vocabController.getAllVocabData().forEach(function(vocabObject, i) {
			imagesHTML += '<div class="imageWrapper" data-index="' + i + '">';
			imagesHTML += '<img src="' + vocabObject.imgURL + '">';
			imagesHTML += '</div>';
		});
		this.foodWrapper.html(imagesHTML);
	},
	// Renders fade when image is already correct
	
};

var viewScore = {
	init: function() {
		this.numerator = $(".numerator");
		this.denominator = $(".denominator");
		this.denominator.html("/ " + vocabController.getNumberQuestions());

		this.answerSlot = $(".answerSlot");
		this.attempts = $(".attempts");

		this.rightWrongSlot = $(".rightWrongSlot");
		this.tries = $(".tries");
	},
	// Takes interim text from input (i.e speech input) and displays it
	renderInterimText: function(interimText) {
		this.answerSlot.html("<span>" + interimText + " </span>");
	},
	renderCorrect: function() {
		this.numerator.html(vocabController.getScore());
		this.rightWrongSlot.html('<span class="glyphicon glyphicon glyphicon-ok" aria-hidden="true"></span>');
		this.tries.html("Correctly Answered");
	},
	renderIncorrect: function() {
		this.rightWrongSlot.html('<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>');
		this.tries.html("Tries: " + vocabController.getTries());
	},
	// Renders when the player hits previous or next button
	renderOnNext: function() {
		// Clear whatever text was left from previous answer
		this.answerSlot.html("");
		this.rightWrongSlot.html("");

		if (vocabController.currentVocabCorrect()) {
			this.renderInterimText(vocabController.getCurrentWord().name);
			this.rightWrongSlot.html("");
			this.tries.html("");
		} else {
			this.tries.html("Tries: " + vocabController.getTries());
		}
	}
};

var viewMic = {
	init: function() {
		this.mic = $(".micWrap");
		this.mic.click(function() {
			viewMic.activeMic();
			testSpeech();
		});
	},
	activeMic: function() {
		this.mic.children("span").attr("style", "color: red");
		this.mic.attr("style", "border: 7px solid red");
	},
	restoreMic: function() {
		this.mic.children("span").removeAttr("style");
		this.mic.removeAttr("style");
	},
	hideMic: function() {
		this.mic.addClass("hidden");
	},
	revealMic: function() {
		this.mic.removeClass("hidden");
	}
};

// Speech recognition Object 

function testSpeech() {
	var correctWord = vocabController.getCurrentWord().name;

	var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + correctWord + ';';
	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.lang = vocabData.lang;
	recognition.interimResults = true;
	recognition.maxAlternatives = 1;

	recognition.start();

	recognition.onresult = function(event) {
		// The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
		// The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
		// It has a getter so it can be accessed like an array
		// The first [0] returns the SpeechRecognitionResult at position 0.
		// Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
		// These also have getters so they can be accessed like arrays.
		// The second [0] returns the SpeechRecognitionAlternative at position 0.
		// We then return the transcript property of the SpeechRecognitionAlternative object 
		var speechResult = event.results[0][0].transcript;
		console.log(event.results[0][0].transcript);
		viewScore.renderInterimText(event.results[0][0].transcript);

		// Check task only when the speech input has been finalized
		// Check whether Task is correct and return appropriate response based on right or wrong
		// Logic of check is in the octopusTasks Controller
		if (event.results[0].isFinal) {
			if (vocabController.checkWord(speechResult)) {
				viewMic.hideMic();
				viewScore.renderCorrect();
			} else {
				viewScore.renderIncorrect();

			}
		}
	},

	recognition.onspeechend = function() {
		recognition.stop();
		viewMic.restoreMic();
	},

	recognition.onerror = function(event) {
		console.log("Error" + event.error);
		viewMic.restoreMic();
	}
};

try {
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
	var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
} catch(err) {
	alert("Sorry, the browser does not support Web Speech. Please use Google Chrome for Speech Access.");
}

viewVocab.init();
viewScore.init();
viewMic.init();
viewVocab.render();
