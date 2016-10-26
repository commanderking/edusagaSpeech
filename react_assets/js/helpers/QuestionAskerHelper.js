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
	getSpecificFeedbackResponses: function(data, activeTaskIndex) {
		return data.character.currentTasks[activeTaskIndex].specificFeedbackResponse;
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

export var SpeechChecker = {
	// determine whether to use typical check or advancedCheck, returns objectToReturn
	checkAnswer: function(userAnswer, data, activeTaskIndex) {
		var that = this;

		var possibleAnswers = TaskController.getPossibleCorrectAnswers(data, activeTaskIndex);
		var objectToReturn = {
			"answerCorrect" : false,
			"possibleAnswersIndex" : -1,
			"responseSoundID" : ""
		}

		// If the userAnswer contains a global exception, immediately mark it as wrong
		if (TaskController.getActiveTask(data, activeTaskIndex).exceptions !== undefined) {
			var exceptions = TaskController.getActiveTask(data, activeTaskIndex).exceptions;
			// console.log(exceptions);
			var exceptionMatch = false;
			exceptions.forEach(function(exception){
				// console.log(exception);
				if (userAnswer.indexOf(exception) >= 0) {
					exceptionMatch = true;
				}
			});

			// console.log("Exception loop done");	
			if (exceptionMatch === true) {
				// console.log(objectToReturn);
				return objectToReturn;
			}
		}

		possibleAnswers.forEach(function(possibleAnswerObject, i) {
			var checkResult = {};
			var tempSoundID = possibleAnswerObject.soundID;
			// if the first entry in answers array is an array, we will need advancedCheck

			/* possibleAnswerObject is something like
					{
						"answers": ["你好吗", "你怎么样", "怎么样", "吃饭了吗", "你最近怎么样", "你今天怎么样", "你今天好吗", "你今天过得怎么样"],
						"response": "非常好",
						"soundID": "feichanghao",
						"exceptions": []
					}
			*/

			// check if user answer contains an exception word for this answerObject
			var exceptionFound = false;

			if (possibleAnswerObject.exceptions !== undefined) {
				possibleAnswerObject.exceptions.forEach(function(exception){
					if (userAnswer.indexOf(exception) >= 0) {
						exceptionFound = true;
					}
				})
			}

			if (exceptionFound === false) {
				// If the answers are an array of arrays, then we must use an advanced check
				if (possibleAnswerObject.answers[0].constructor === Array) {
					// console.log("using advanced check");
					checkResult = that.advancedCheck(userAnswer, possibleAnswerObject);
					// Only set object to return if the result is true
					// console.log(possibleAnswerObject.answers);
					if (checkResult === true) {
						objectToReturn.answerCorrect = true;
						objectToReturn.possibleAnswersIndex = i;
						objectToReturn.responseSoundID = tempSoundID;
					}
				} else {
					// console.log("using typical check");
					checkResult = that.typicalCheck(userAnswer, possibleAnswerObject);
					if (checkResult === true) {
						objectToReturn.answerCorrect = true;
						objectToReturn.possibleAnswersIndex = i;
						objectToReturn.responseSoundID = tempSoundID;
					}
				}
			}
		})

		/*------------------------------------------------------------
		If answer is wrong, see if there's any specific feedback we want to give
		------------------------------------------------------------*/

		// Check if there's any specific feedback for wrong answers
		if (objectToReturn.answerCorrect === false ) {
			try {
				var possibleFeedbackAnswers = TaskController.getSpecificFeedbackResponses(data, activeTaskIndex);
				/* 
				objectToReturn.specificFeedback = true;
				objectToReturn.feedbackText = 
				console.log(objectToReturn.specificFeedback);
				*/	
			} catch(err) {
				console.log ("error");
			}
		}


		// Return object should contain a 4th entry, specificFeedback: true
		// Then in questionAsker script, if returnedObject answer is false, but contains specificFeedback: true, then enter specificFeedback phase

		return objectToReturn;
	},
	typicalCheck: function(userAnswer, possibleAnswerObject) {
		var tempSoundID = possibleAnswerObject.soundID;
		var answerCorrect = false;

		possibleAnswerObject.answers.forEach(function(possibleAnswer, i) {
			// Case for exact match
			if (possibleAnswerObject.exactMatch === true) {
				// console.log('in exact match');
					// console.log(possibleAnswer);
					// console.log(objectToReturn.answerCorrect);
					if (userAnswer === possibleAnswer) {
						// console.log("exact answer correct");
						answerCorrect = true;
					}
			} else {
				if (userAnswer.indexOf(possibleAnswer) >= 0) {
					answerCorrect = true;
				}
			}

		});
		return answerCorrect;
	},
	advancedCheck: function(userAnswer, possibleAnswerObject) {
		// console.log(possibleAnswer);

		var answerCorrect = false;
		// console.log("inside advancedCheck function");
		var checkListArray = [];
		var userAnswerIndex = 0;
		possibleAnswerObject.answers.forEach(function(answerPartArray, j) {
			// answerPartArray is a list of acceptable list of words that should be in user answer
			// i.e.: ["你", "您"], ["下午", "晚上"]

			// Tracks how far along we are in user answer
			// All entries in this array must be true for answer to be correct
			// Have something like ["你", "您"]
			var answerPartCorrect = false;
			for (var k=0;  k <answerPartArray.length; k++) {
				var newAnswerIndex = userAnswer.indexOf(answerPartArray[k]);
				// console.log(answerPartArray[k])
				// console.log(newAnswerIndex);
				// console.log(userAnswerIndex);
				if (newAnswerIndex >= userAnswerIndex) {
					answerPartCorrect = true;
					userAnswerIndex = newAnswerIndex;
					break;
				}
			}
			checkListArray.push(answerPartCorrect);

			// console.log(checkListArray);
		});

		// console.log(answerCorrect);
		// Check if all the entries in checkListArray are true;
		// if so, then the answer is correct
		var correctCounter = 0;
		for (var l=0; l < checkListArray.length; l++) {
			if (checkListArray[l]) {
				correctCounter += 1;
				// console.log(correctCounter);
			}
		}
		if (correctCounter === checkListArray.length) {
			answerCorrect = true;
		} else {
		}
		// console.log(answerCorrect);

		return answerCorrect;

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
