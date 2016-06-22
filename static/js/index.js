demoData = {
	"currentStep" : 0,
	"tasks" :
	[
		{
			"task" : 'Press the mic button and say "hi"',
			"possibilities" : ["What's up", "How are you", "How are you doing", "What's going on"],
			"response" : "I'm doing great! How are you?",
			"soundID" : "doingGreat",
			"emotion" : "laughing",
			"extensionTasks" :
			[
				{
					"task" : "Ask him how he's doing",
					"possibilities" : ["What's up", "How are you", "How are you doing", "What's going on"],
					"response" : "I'm doing great! Welcome to EduSaga, a platform for interactive speaking activities! Feel free to check out more in depth demos below!",
					"soundID" : "doingGreat",
					"emotion" : "laughing",
					"extensionTasks" :
					[]
				}
			]
		}
	]
};

demoView = {
	init: function() {
		this.taskText = $("#text");
		this.taskResponse = $(".demoHeader p");
	},
	render: function() {

	}
};