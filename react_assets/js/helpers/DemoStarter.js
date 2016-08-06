// Demo Language should be set in web.py on routing
var startDemo = {
	init: function() {
		if (!demoLanguage) {
			console.log("No Demo Language Loaded");
			return;
		} else
		{
			$.getJSON("./static/data/demo" + demoLanguage + ".json", function(data) {
				// Calls in here to make sure that the data is loaded before any other functions are run
				// voice list loaded asynchornously, so can't be grabbed on page load
				// http://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-of-chrome-web-speech-api
				// Wait until the voiceslist changes and then initialize speechSynth
				window.speechSynthesis.onvoiceschanged = function() {
					// window.speechSynthesis.getVoices();
					console.log(data);
					var voiceData = speechSynth.init(data);
					// console.log(voiceData);
					if (voiceData !== null) {
						data.voiceData = voiceData;
					}
					// synth.speak(utterThis);
				};
			}).done(function(data) {
				console.log("Done Function");

				return data;
			})
		}
	}
};

var speechSynth = {
	// Initialize with proper language, returns voice data for that langauge
	init : function(data) {
		var synth = window.speechSynthesis;
		// Temporarily stores 
		var voices = [];

		// Get current language
		var lang = data.currentLanguage;
		var synthLang = "";

		// Find the correct language of the activity
		if (lang == "es-es") {
			synthLang = "Monica";
		} else if (lang === "cmn-Hant-TW" || "zh-CN") {
			synthLang = "Google 普通话（中国大陆）";
		}

		// Set the voice of the robot to be the correct language from browser
		var setVoice = function() {
			voices = synth.getVoices();
			// console.log(voices);
			for(i = 0; i < voices.length ; i++) {
				if(voices[i].name === synthLang) {
					// console.log(voices[i]);
					return voices[i]
				}
			}
		};
		voiceToAdd = setVoice();
		return voiceToAdd;

	},
	play : function(textToSay) {
		var utterThis = new SpeechSynthesisUtterance(textToSay);
		console.log(octopusSpeechSynth.getVoice().name);
		utterThis.voice = octopusSpeechSynth.getVoice();
		utterThis.rate = 0.8;
		console.log(utterThis.voice);
		window.speechSynthesis.speak(utterThis);

	}
};

module.exports = startDemo;