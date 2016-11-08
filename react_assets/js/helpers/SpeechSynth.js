var speechSynth = {
	// Initialize with proper language, return "voicepack" for language
	init : function(lang) {
		// Temporarily stores 
		var voices = [];

		// Get current language
		var synthLang = "";

		// Convert the google language to the correct voice pack language
		if (lang == "es-es") {
			synthLang = "Monica";
		} else if (lang === "cmn-Hant-TW" || "zh-zh" || "zh-CN") {
			synthLang = "Google 普通话（中国大陆）";
		}

		// Set the voice of the robot to be the correct language from browser
		var voicePack = this.findVoice(synthLang);
		return voicePack;
	},
	findVoice: function(langToMatch) {
		var voiceData;
		var voices = window.speechSynthesis.getVoices();
		for(var i = 0; i < voices.length ; i++) {
			if(voices[i].name === langToMatch) {
				voiceData = voices[i];
			}
		}
		return voiceData;
	},
	play : function(textToSay, voicePack) {
		var utterThis = new SpeechSynthesisUtterance(textToSay);
		utterThis.voice = voicePack;
		utterThis.rate = 0.8;
		// console.log(utterThis.voice);
		window.speechSynthesis.speak(utterThis);
		return utterThis;

	}
};

module.exports = speechSynth;