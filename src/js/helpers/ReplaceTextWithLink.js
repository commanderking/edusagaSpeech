// Replace text in Dialog Container with the appropriate link
export var replaceTextWithLink = function(sampleChoiceObject, newLink) {
	var linkStart = sampleChoiceObject.text.indexOf("[[link]]");
	if (linkStart >= 1) {
		var textToReturn = sampleChoiceObject.text.replace("[[link]]", sampleChoiceObject.link.text);
	}
	console.log(sampleChoiceObject.text.split("[[link]]"));
	return textToReturn;
}
