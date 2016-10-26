var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
import {replaceTextWithLink} from '../react_assets/js/helpers/ReplaceTextWithLink';


var sampleChoice = {
	"name" : "Max",
	"image" : "characters/maxwell/maxDefault.png",
	"imageLayer" : "blank.png",
	"text" : "Hey, if you want to listen along, visit this [[link]]!",
	"link" : {
		"text" : "link",
		"url" : "https://youtu.be/39rmwFLPB3k?t=48s"
	}
}

describe('replace text with link', () => {

	it('returns proper text', () => {
		var newText = replaceTextWithLink(sampleChoice);
		expect(newText).to.equal("Hey, if you want to listen along, visit this link!");
	})

});