// Grabs all scene elements on page and fades them
// Modal Dialog windows are exempt

viewFadeAll = {
	init: function() {
		this.characterDialogueDiv = $(".characterDialogueDiv");
		this.sceneBG = $(".sceneBG");
		this.characterDiv = $(".characterDiv");
		this.taskList = $(".combinedTaskList");
		this.sceneWrapper = $(".sceneWrapper");
		this.respondButton = $(".respondButton");
		this.navbarTop = $(".navbarTop");
		this.bottomNavbar = $(".bottomNavbar");

		this.nonTutorialUI = [this.characterDialogueDiv, this.sceneBG, this.taskList, this.sceneWrapper, this.navbarTop, this.bottomNavbar];

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

		this.characterDialogueDiv.removeClass("hidden");
		this.characterDiv.removeClass("hidden");
		this.taskList.removeClass("hidden");
	}
}

viewFadeAll.init();
viewFadeAll.render();