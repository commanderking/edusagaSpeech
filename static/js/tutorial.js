tutorialData = 
{
	"tutorialOn" : true,
	"currentStep" : 0,
	"steps" : 
	[
		{
			"title" : "Task List",
			"text" : "The Task List shows all the tasks that you can accomplish.",
			"highlightUI" : ["taskList"],
			"tutorialWindowPosition" : 
			{
				"x" : "27%",
				"y" : "25%"
			}
		},
		{
			"title" : "Completing a Task",
			"text" : "When ready to try a task, click on the speak microphone and say whatever is needed. In this case, try greeting him by saying '你好' (Ní hǎo).",
			"highlightUI" : ["respondButton"],
			"tutorialWindowPosition" : 
			{
				"x": "32%",
				"y": "15%"
			}
		},
		{
			"title" : "Completed Tasks",
			"text" : "Great work! You'll hear and see a response if you're correct, and the tasks will highlight in greend become checked as you complete them.",
			"highlightUI" : ["taskList", "characterTextResponse"],
			"tutorialWindowPosition" : 
			{
				"x": "20%",
				"y": "50%"
			}
		},
		{
			"title" : "Good luck!",
			"text" : "See if you can complete all the tasks for the character and then try talking to other characters!",
			"highlightUI" : ["navbarTop"],
			"tutorialWindowPosition" : 
			{
				"x": "35%",
				"y": "10%"
			}
		},
	]
}

octopusTutorial = 
{
	// Returns object about current Step's title, text etc...
	getCurrentStepInstructions : function() {
		return tutorialData.steps[tutorialData.currentStep];
	}, 
	getAllStepData : function() {
		return tutorialData.steps;
	},
	getCurrentStepIndex: function() {
		return tutorialData.currentStep;
	},
	nextStep : function() {
		tutorialData.currentStep++;
	}
}

viewTutorial = {
	init: function() {
		this.taskList = $(".taskList");
		this.sceneWrapper = $(".sceneWrapper");
		this.respondButton = $(".respondButton");
		this.navbarTop = $(".navbarTop");

		// Tutorial window related references
		this.tutorialWindow = $(".tutorialWindow");

		// Reference to all non-Tutorial related UI
		this.nonTutorialUI = [this.taskList, this.sceneWrapper, this.navbarTop];
	},

	renderTitleText: function() {
		this.tutorialWindow.children("h3").html(octopusTutorial.getCurrentStepInstructions().title);
		this.tutorialWindow.children("p").html(octopusTutorial.getCurrentStepInstructions().text);
	},
	// Reset CSS features for the tutorial and the scenes
	resetTutorialScene: function() {
		that = this;
		this.nonTutorialUI.forEach(function(element){
			element.removeClass("faded");
			element.removeClass("borderHighlight");
		})
		// remove previous event listeners
		that.tutorialWindow.children(".btn-confirm").unbind();
		this.sceneWrapper.children().removeClass("faded").removeClass("borderHighlight");
		that.navbarTop.children(".charList").children().removeClass("borderHighlight");
	},

	// Make tasks stand out and explain their purpose
	step1: function() {
		this.resetTutorialScene();
		// that = this to save reference to viewTutorial for when using "click functions"
		that = this;
		// get current tutorial step
		step = octopusTutorial.getCurrentStepInstructions();

		// Fade all relevant UI elements
		this.nonTutorialUI.forEach(function(element){
			element.addClass("faded");
		})
		// Render Title and Text
		this.tutorialWindow.removeClass("hidden");
		var currentStep = octopusTutorial.getCurrentStepInstructions();
		this.tutorialWindow.css("left", currentStep.tutorialWindowPosition.x);
		this.tutorialWindow.css("top", currentStep.tutorialWindowPosition.y);
		this.renderTitleText();

		// Highlight the appropriate UI elements
		step.highlightUI.forEach(function(stepUI) {
			switch(stepUI) {
				case "taskList" : 
					that.taskList.removeClass("faded").addClass("borderHighlight");
					break;
				case "respondButton" : 
					that.sceneWrapper.removeClass("faded");
					that.sceneWrapper.children().addClass("faded");
					that.sceneWrapper.children(".respondButton").removeClass("faded").addClass("borderHighlight");
					break;
				case "characterTextResponse" :
					that.sceneWrapper.removeClass("faded");
					that.sceneWrapper.children().addClass("faded");
					that.sceneWrapper.children(".characterTextResponse").removeClass("faded");
					break;
				case "navbarTop" :
					that.navbarTop.removeClass("faded");
					that.navbarTop.children(".charList").children().addClass("borderHighlight");
					break;
				default : 
			}		
		})


		/*
		this.sceneWrapper.addClass("faded");
		this.navbarTop.addClass("faded");
		this.taskList.addClass("borderHighlight");
		*/

		this.tutorialWindow.children(".btn-confirm").click(function(){
			console.log(octopusTutorial.getCurrentStepIndex());
			console.log(octopusTutorial.getAllStepData().length - 1);
			if (octopusTutorial.getCurrentStepIndex() < octopusTutorial.getAllStepData().length - 1) {
				octopusTutorial.nextStep();
				that.step1();
				console.log("Next Step");
			} else {
				console.log("over");
				that.resetTutorialScene();
				that.tutorialWindow.hide();
			}
		});
		this.tutorialWindow.children(".btn-endTutorial").click(function(){
			that.resetTutorialScene();
			that.tutorialWindow.hide();
		})

	}, 
	// Make microphone button stand out
	step2: function() {
		that = this;
		this.nonTutorialUI.forEach(function(element){
			element.addClass("faded");
		})
		this.sceneWrapper.removeClass("faded");
		this.sceneWrapper.children().addClass("faded");
		this.sceneWrapper.children(".respondButton").removeClass("faded").addClass("borderHighlight");

		this.renderTitleText();
	}

}

/*
viewTutorial.init();
viewTutorial.step1();
*/