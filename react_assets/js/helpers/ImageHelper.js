var Constants = require('./Constants');

export var iconSelector = function(characterName) {
	switch(characterName) {
		case "Alex":
			return Constants.IMAGE_PATH + "characters/icons/alexBlankRound.png";
		case "David":
			return Constants.IMAGE_PATH + "characters/icons/davidBlankRound.png";
		case "Chen Yang":
			return Constants.IMAGE_PATH + "characters/icons/chengBlankRound.png";
		default:
			return null;
	}
};