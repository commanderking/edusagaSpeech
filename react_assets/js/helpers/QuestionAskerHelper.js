// Functions to help grab the correct elements from data structure of QuestionAsker

export var TaskController = {
	getCurrentTasks: function(data) {
		return data.character.currentTasks;
	},
	getActiveTask: function(data, activeTaskIndex) {
		return data.character.currentTasks[activeTaskIndex];
	},
	getPossibleCorrectAnswers: function(data, activeTaskIndex) {
		return this.getActiveTask(data, activeTaskIndex).possibleAnswers;
	},
	getQueuedTasks: function(data) {
		return data.character.queuedTasks;
	},
	// Used if user skips a task, then need to populate all potential future tasks
	getTaskIDsToQueueOfCurrentTasks: function(data) {
		var taskIDs = [];
		this.getCurrentTasks(data).forEach(function(task){
			// loop through all taskIDs for each task
			task.tasksToQueue.forEach(function(taskID) {
				taskIDs.push(taskID);
			});
		});
		// Remove any duplicate IDs
		var uniqTaskIDs = [ ...new Set(taskIDs)];
		return uniqTaskIDs;
	},
	// Only get the TaskIDs to queue fo the active task
	getTaskIDsToQueueOfCurrentTask: function(data, activeTaskIndex) {
		var taskIDsToQueue = this.getActiveTask(data, activeTaskIndex).tasksToQueue;
		return taskIDsToQueue;
	},
	// Adds queued tasks to current tasks; Does not remove previous tasks
	addQueuedTasksToCurrentTasks: function(currentTasksArray, tasksToQueueIDArray, queuedTasksArray) {
		tasksToQueueIDArray.forEach(function(tasksToQueueID, i) {
			queuedTasksArray.forEach(function(taskObject, j) {
				if (tasksToQueueID === taskObject.taskID) {
					currentTasksArray.push(taskObject);
				}
			})
		});
		return currentTasksArray;
	},
	getIndexesToSpliceQueuedTasks: function(tasksToQueueIDArray, queuedTasksArray) {
		var indexesToSplice = []
		tasksToQueueIDArray.forEach(function(tasksToQueueID, i) {
			queuedTasksArray.forEach(function(taskObject , j) {
				if (tasksToQueueID === taskObject.taskID) {
					indexesToSplice.push(j);
				}
			})
		})
		return indexesToSplice;	
	},
	removeTasksfromQueue: function(indexesToRemove, queuedTasksArray) {
		var newQueuedTasksArray = queuedTasksArray;
		for (var i = indexesToRemove.length -1; i >= 0; i--) {
				newQueuedTasksArray.splice(indexesToRemove[i],1);
		}
		return newQueuedTasksArray;
	},
	skipTasks: function(data) {
		var taskIDs = this.getTaskIDsToQueueOfCurrentTasks(data);
		var currentTasksArray = this.getCurrentTasks(data);
		var queuedTaskArray = this.getQueuedTasks(data);

		this.addQueuedTasksToCurrentTasks(currentTasksArray, taskIDs, queuedTaskArray);
	}
}

export var ScenarioController = {
	nextScenario: function(scenarioIndex) {
		// Move to the next index 
		return scenarioIndex + 1;

	}
}


var possibleAnswers2 = [
	{
		"answers" : [
			["我"], 
			["不学", "不读"],
			["法语", "法文"],
			["可是", "但是"],
			["说一点", "会一点"]
		],
		"response" : "好啊。",
		"soundID" : "wojiao"
	}

]
export var SpeechChecker = {
	// determine whether to use typical check or advancedCheck
	checkAnswer: function(userAnswer, data, activeTaskIndex) {
		var that = this;

		var possibleAnswers = TaskController.getPossibleCorrectAnswers(data, activeTaskIndex);
		var objectToReturn = {
			"answerCorrect" : false,
			"possibleAnswersIndex" : -1,
			"responseSoundID" : ""
		}

		// If the userAnswer contains an exception, immediately mark it as wrong
		if (TaskController.getActiveTask(data, activeTaskIndex).exceptions !== undefined) {
			var exceptions = TaskController.getActiveTask(data, activeTaskIndex).exceptions;
			console.log(exceptions);
			var exceptionMatch = false;
			exceptions.forEach(function(exception){
				console.log(exception);
				if (userAnswer === exception) {
					console.log("exception exists");
					exceptionMatch = true;
				}
			});

			console.log("Exception loop done");	
			if (exceptionMatch === true) {
				console.log(objectToReturn);
				return objectToReturn;
			}
		}

		possibleAnswers.forEach(function(possibleAnswerObject, i) {
			var tempSoundID = possibleAnswerObject.soundID;

			// if the first entry in answers array is an array, we will need advancedCheck
			if (possibleAnswerObject.answers[0].constructor === Array) {
				objectToReturn = that.advancedCheck(userAnswer, possibleAnswers, objectToReturn);
			} else {
				objectToReturn = that.typicalCheck(userAnswer, possibleAnswers, objectToReturn);
			}
		})

		return objectToReturn;
	},
	typicalCheck: function(userAnswer, possibleAnswers, objectToReturn) {
		possibleAnswers.forEach(function(possibleAnswerObject, i) {
			var tempSoundID = possibleAnswerObject.soundID;
			console.log(objectToReturn.answerCorrect);
			// Case for exact match
			if (possibleAnswerObject.exactMatch === true) {
				console.log('in exact match');
				possibleAnswerObject.answers.forEach(function(possibleAnswer){
					console.log(possibleAnswer);
					console.log(objectToReturn.answerCorrect);
					if (userAnswer === possibleAnswer) {
						console.log("exact answer correct");
						objectToReturn.answerCorrect = true;
						objectToReturn.responseSoundID = tempSoundID;
						objectToReturn.possibleAnswersIndex = i; 
					}
				});
			} else {
				possibleAnswerObject.answers.forEach(function(possibleAnswer){
					if (userAnswer.indexOf(possibleAnswer) >= 0) {
						console.log("using contains - answer correct");

						objectToReturn.answerCorrect = true;
						objectToReturn.responseSoundID = tempSoundID;
						objectToReturn.possibleAnswersIndex = i; 
					}
				});				
			}

		});
		return objectToReturn;
	},
	advancedCheck: function(userAnswer, possibleAnswers, objectToReturn) {
		var answerCorrect = false;
		var possibleAnswersIndex;
		var responseSoundID;
		possibleAnswers.forEach(function(possibleAnswerObject, i) {
			var tempSoundID = possibleAnswerObject.soundID;
			possibleAnswersIndex = i;
			var checkListArray = [];
			possibleAnswerObject.answers.forEach(function(answerPartArray, j) {
				// Tracks how far along we are in user answer
				var userAnswerIndex = 0;

				// All entries in this array must be true for answer to be correct
				// Have something like ["你", "您"]
				for (var k=0;  k <answerPartArray.length; k++) {
					var answerPartCorrect = false;
					// console.log(answerPartArray[k]);
					var newAnswerIndex = userAnswer.indexOf(answerPartArray[k]);
					// console.log(newAnswerIndex);
					if (newAnswerIndex >= userAnswerIndex) {
						answerPartCorrect = true;
						userAnswerIndex = newAnswerIndex;
						break;
					}
				}
				checkListArray.push(answerPartCorrect);
				// console.log(checkListArray);
			})

			// Check if all the entries in checkListArray are true;
			// if so, then the answer is correct
			var correctCounter = 0;
			for (var l=0; l < checkListArray.length; l++) {
				if (checkListArray[l]) {
					correctCounter += 1;
				}
			}
			if (correctCounter === checkListArray.length) {
				responseSoundID = tempSoundID;
				answerCorrect = true;
			}

		});
		return {
			"answerCorrect" : answerCorrect,
			"responseSoundID" : responseSoundID,
			"possibleAnswersIndex" : possibleAnswersIndex
		};

	},
	addUserAnswerToAttemptedAnswers: function(userAnswer, data, activeTaskIndex) {
		var attemptedAnswers = data.character.currentTasks[activeTaskIndex].attemptedAnswers;
		attemptedAnswers.push(userAnswer);
		return attemptedAnswers;
	}
}

export var currentTasks = [
		{
			"taskID" : 2,
			"task" : "Ask how he's doing",
			"possibleAnswers" : 
			[	
				{
					"answers": ["你好吗", "你怎么样", "怎么样", "吃饭了吗", "你最近怎么样", "你今天怎么样", "你今天好吗", "你今天过得怎么样"],
					"response": "非常好",
					"soundID": "feichanghao"
				}
			],
			"correct" : false,
			"emotion" : "characters/david/davidLaughing.png",
			"tasksToQueue" : [3,4],
			"attemptedAnswers" : []
		}
]


// Tasks to Queue is an array of IDs on correctly answered task, ex, [4,5]
// queuedTasksArray = All possible tasks that are still to come 

export var tasksToQueue = [3,4];

export var queuedTasks = [
	{
		"taskID" : 3,
		"task" : "Ask for name", 
		"possibleAnswers" : 
		[
			{
				"answers": 	["你叫什么名字", "你叫什么", "你的名字是什么", "你是谁", "你的中文名字叫什么"],
				"response": "我叫张大伟.",
				"soundID" : "wojiao"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"tasksToQueue" : [],
		"attemptedAnswers" : []
	},
	{
		"taskID" : 4,
		"task" : "Ask for nationality", 
		"possibleAnswers" : 
		[
			{
				"answers" : ["你是哪国人", "你是哪里人", "你来自哪里?", "你是从哪里来的", "你从哪里来", "你从哪里来的"],
				"response" : "我是中国人.",
				"soundID" : "nationality"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"tasksToQueue" : [5],
		"attemptedAnswers" : []
	}, 
	{
		"taskID" : 5,
		"task" : "Ask for age", 
		"possibleAnswers" :
		[
			{
				"answers" : ["你几岁", "你多大", "你多大了", "你年纪多大", "你今年多大了"],
				"response" : "我十六岁.",
				"soundID" : "age"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"soundPath" : "david/age.ogg",
		"tasksToQueue" : [6,7],
		"attemptedAnswers" : []
	}
]

export var exepectedOutputaddQueuedTasksToCurrentTasks = [
	{
		"taskID" : 2,
		"task" : "Ask how he's doing",
		"possibleAnswers" : 
		[
			{
				"answers": ["你好吗", "你怎么样", "怎么样", "吃饭了吗", "你最近怎么样", "你今天怎么样", "你今天好吗", "你今天过得怎么样"],
				"response": "非常好",
				"soundID": "feichanghao"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidLaughing.png",
		"tasksToQueue" : [3,4],
		"attemptedAnswers" : []
	},
	{
		"taskID" : 3,
		"task" : "Ask for name", 
		"possibleAnswers" : 
		[
			{
				"answers": 	["你叫什么名字", "你叫什么", "你的名字是什么", "你是谁", "你的中文名字叫什么"],
				"response": "我叫张大伟.",
				"soundID" : "wojiao"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"tasksToQueue" : [],
		"attemptedAnswers" : []
	},
	{
		"taskID" : 4,
		"task" : "Ask for nationality", 
		"possibleAnswers" : 
		[
			{
				"answers" : ["你是哪国人", "你是哪里人", "你来自哪里?", "你是从哪里来的", "你从哪里来", "你从哪里来的"],
				"response" : "我是中国人.",
				"soundID" : "nationality"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"tasksToQueue" : [5],
		"attemptedAnswers" : []
	}
]

export var expectedOutputAfterSplicing = [
	{
		"taskID" : 5,
		"task" : "Ask for age", 
		"possibleAnswers" :
		[
			{
				"answers" : ["你几岁", "你多大", "你多大了", "你年纪多大", "你今年多大了"],
				"response" : "我十六岁.",
				"soundID" : "age"
			}
		],
		"correct" : false,
		"emotion" : "characters/david/davidDefault.png",
		"soundPath" : "david/age.ogg",
		"tasksToQueue" : [6,7],
		"attemptedAnswers" : []
	}
]
