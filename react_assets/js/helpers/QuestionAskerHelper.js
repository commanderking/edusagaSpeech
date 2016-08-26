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

export var SpeechChecker = {
	typicalCheck: function(userAnswer, data, activeTaskIndex) {
		var possibleAnswers = TaskController.getPossibleCorrectAnswers(data, activeTaskIndex);
		var answerCorrect = false;
		var possibleAnswersIndex;
		var responseSoundID;
		possibleAnswers.forEach(function(possibleAnswerObject, i) {
			var tempSoundID = possibleAnswerObject.soundID;
			console.log(possibleAnswerObject.soundID);
			possibleAnswerObject.answers.forEach(function(possibleAnswer){
				if (userAnswer.indexOf(possibleAnswer) >= 0) {
					answerCorrect = true;
					responseSoundID = tempSoundID;
					possibleAnswersIndex = i; 
				}
			});
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
