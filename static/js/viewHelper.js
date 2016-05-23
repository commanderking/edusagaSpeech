// Grabs all scene elements on page and fades them
// Modal Dialog windows are exempt

viewFadeAll = {
	init: function() {
		this.taskList = $(".taskList");
		this.sceneWrapper = $(".sceneWrapper");
		this.respondButton = $(".respondButton");
		this.navbarTop = $(".navbarTop");

		this.nonTutorialUI = [this.taskList, this.sceneWrapper, this.navbarTop];

	},
	render: function() {
		// Fade all relevant UI elements
		this.nonTutorialUI.forEach(function(element){
			element.addClass("faded").addClass("disabled");
		})
	},

	resetFade: function() {
		// Return fade to original
		this.nonTutorialUI.forEach(function(element){
			element.removeClass("faded").removeClass("disabled");
		})
	}
}

viewFadeAll.init();
viewFadeAll.render();