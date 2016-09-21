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
	activateSpeech: function(possibleAnswers, lang) {
		return new Promise( function (resolve, reject) {

			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

			var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + possibleAnswers + ';';
			var recognition = new SpeechRecognition();
			var speechRecognitionList = new SpeechGrammarList();
			speechRecognitionList.addFromString(grammar, 1);
			recognition.grammars = speechRecognitionList;

			// Assume language is Chinese if not set
			if (!lang) {
				recognition.lang = 'zh-CN';
			} else {
				recognition.lang = lang;
	
			}
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
				// console.log(event.results[0][0].transcript);
				// viewScore.renderInterimText(event.results[0][0].transcript);

				// Check task only when the speech input has been finalized
				// Check whether Task is correct and return appropriate response based on right or wrong
				// Logic of check is in the octopusTasks Controller
				if (event.results[0].isFinal) {
					resolve(speechResult);
				}
			},

			// If user clicks task again, the task should cancel
			$(".taskDiv, .coinIcon").click(function() {
				recognition.abort();
			})

			// TODO: Fix hackiness of this with proper callbacks
			// Right now, stop-repeat is not loaded quickly enough on page. Without timeout, jquery wont' find it on page. So give a delay.
			setTimeout(function() {
				// Reset character image to default 
				console.log ($(".stop-repeat").length);
				$(".stop-repeat").click(function() {
					recognition.abort();
				})
			}, 200);

			recognition.onspeechend = function() {
				recognition.stop();
			},

			recognition.onerror = function(event) {
				console.log("Error " + event.error);
				resolve("Cancel Speech");
			}
		});
	}
}

	/*
	function(resolve, reject) {
		resolve("What is going on?");
	}*/


module.exports = speechHelper;
