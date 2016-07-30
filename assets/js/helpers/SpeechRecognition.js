var speechHelper = {
	checkBrowser: function() {
		try {
			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
		} catch(err) {
			alert("Sorry, the browser does not support Web Speech. Please use Google Chrome for Speech Access.");
		}
	},
	// CurrentIndex refers to index of the vocab/phrase/question data in the overall vocab/question list
	testSpeech: function(currentIndex, vocabList, lang) {
		// var correctWord = vocabController.getCurrentWord().name;

		var correctWord = vocabList[currentIndex].name;

		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
		var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
		var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

		var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + correctWord + ';';
		var recognition = new SpeechRecognition();
		var speechRecognitionList = new SpeechGrammarList();
		speechRecognitionList.addFromString(grammar, 1);
		recognition.grammars = speechRecognitionList;
		recognition.lang = lang;
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
			// viewScore.renderInterimText(event.results[0][0].transcript);

			// Check task only when the speech input has been finalized
			// Check whether Task is correct and return appropriate response based on right or wrong
			// Logic of check is in the octopusTasks Controller
			if (event.results[0].isFinal) {
				console.log(speechResult);
				console.log("results[0].isFinal is true");
				return Promise.resolve(speechResult);
			}
		},

		recognition.onspeechend = function() {
			recognition.stop();
		},

		recognition.onerror = function(event) {
			console.log("Error" + event.error);
		}
	},
	promiseTestSpeech: function(currentIndex, vocabList, lang) {
		return new Promise( function (resolve, reject) {

			var correctWord = vocabList[currentIndex].name;

			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

			var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + correctWord + ';';
			var recognition = new SpeechRecognition();
			var speechRecognitionList = new SpeechGrammarList();
			speechRecognitionList.addFromString(grammar, 1);
			recognition.grammars = speechRecognitionList;
			recognition.lang = lang;
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
				// viewScore.renderInterimText(event.results[0][0].transcript);

				// Check task only when the speech input has been finalized
				// Check whether Task is correct and return appropriate response based on right or wrong
				// Logic of check is in the octopusTasks Controller
				if (event.results[0].isFinal) {
					resolve(speechResult);
				}
			},

			recognition.onspeechend = function() {
				recognition.stop();
			},

			recognition.onerror = function(event) {
				console.log("Error " + event.error);
				resolve()
			}
		});
	}
}

	/*
	function(resolve, reject) {
		resolve("What is going on?");
	}*/


module.exports = speechHelper;
