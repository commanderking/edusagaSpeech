var tutorialData = [];

var startTutorial = 
{
	init: function() {
		if (!demoLanguage) {
			console.log("No Demo Language Loaded for Tutorial");
		} 
		else 
		{
			$.getJSON("./static/data/tutorial" + demoLanguage + ".json", function(data) {
				// Calls in here to make sure that the data is loaded before any other functions are run
				console.log(data);
				tutorialData = data;
				console.log(tutorialData);
				viewTutorial.init();
			});
		}
	}
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
	},
	resetSteps : function() {
		tutorialData.currentStep = 0;
	}, 
	disableTutorial: function() {
		tutorialData.tutorialOn = false;
	},
	checkTutorialOn: function() {
		return tutorialData.tutorialOn;
	}
}

viewTutorial = {
	init: function() {
		this.taskList = $(".combinedTaskList");
		this.sceneWrapper = $(".sceneWrapper");
		this.respondButton = $(".respondButton");
		this.navbarTop = $(".navbarTop");

		// Tutorial window related references
		this.tutorialWindow = $(".tutorialWindow");

		// Reference to all non-Tutorial related UI
		this.nonTutorialUI = [this.taskList, this.sceneWrapper, this.navbarTop, this.taskList.children(".completedTaskList")];
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

		//remove any highlighting
		this.sceneWrapper.children().removeClass("faded").removeClass("borderHighlight");
		that.navbarTop.children(".charList").children().removeClass("borderHighlight");
	},

	// Make steps stand out and explain their purpose
	render: function() {
		if (octopusTutorial.checkTutorialOn) {
			this.resetTutorialScene();
			// that = this to save reference to viewTutorial for when using "click functions"
			var that = this;
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
					case "completedTaskList" : 

						that.taskList.children(".completedTaskList").removeClass("faded").addClass("borderHighlight");
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

			// Add Event Listener for Next Step Button
			this.tutorialWindow.children(".btn-confirm").click(function(){
				console.log(octopusTutorial.getCurrentStepIndex());
				console.log(octopusTutorial.getAllStepData().length - 1);
				if (octopusTutorial.getCurrentStepIndex() < octopusTutorial.getAllStepData().length - 1) {
					octopusTutorial.nextStep();
					that.render();
					console.log("Next Step");
				} else {
					octopusTutorial.disableTutorial();
					octopusTutorial.resetSteps();
					console.log("Tutorial over");
					that.resetTutorialScene();
					that.tutorialWindow.addClass("hidden");
				}
			});

			// Add Event Listener for End Tutorial Button
			this.tutorialWindow.children(".btn-endTutorial").click(function(){
				that.resetTutorialScene();
				that.tutorialWindow.hide();
			})
		}
	}
}

startTutorial.init();