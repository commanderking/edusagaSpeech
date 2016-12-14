const IMAGE_PATH = "https://s3.amazonaws.com/edusaga/assets/images/";
const SOUND_PATH = "https://s3.amazonaws.com/edusaga/assets/audio/";

module.exports = {
	IMAGE_PATH: IMAGE_PATH,
	SOUND_PATH: SOUND_PATH,
	VOCAB_LIST_TEMPLATE: {
		"currentWordIndex" : 0,
		"lastAnswer" : "",
		"score" : 0,
		"lang" : "zh-CN",
		"list" : []
	},
	VOCAB_WORD_TEMPLATE: {
		"task" : "",
		"answer" : "",
		"pinyin" : "",
		"correct" : false,
		"tries" : 0
	}
};