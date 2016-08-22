
// Tasks to Queue is an array of IDs on correctly answered task, ex, [4,5]
// queuedTasksArray = All possible tasks that are still to come

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

// Returns the new CurrentTasksArray
export function addQueuedTasksToCurrentTasks(currentTasksArray, tasksToQueueIDArray, queuedTasksArray) {
	tasksToQueueIDArray.forEach(function(tasksToQueueID, i) {
		queuedTasksArray.forEach(function(taskObject, j) {
			if (tasksToQueueID === taskObject.taskID) {
				currentTasksArray.push(taskObject);
			}
		})
	});
	return currentTasksArray;
}

export function getIndexesToSpliceQueuedTasks(tasksToQueueIDArray, queuedTasksArray) {
	var indexesToSplice = []
	tasksToQueueIDArray.forEach(function(tasksToQueueID, i) {
		queuedTasksArray.forEach(function(taskObject , j) {
			if (tasksToQueueID === taskObject.taskID) {
				indexesToSplice.push(j);
			}
		})
	})
	return indexesToSplice;
}

export function removeTasksfromQueue(indexesToRemove, queuedTasksArray) {
	var newQueuedTasksArray = queuedTasksArray;
	for (var i = indexesToRemove.length -1; i >= 0; i--) {
			newQueuedTasksArray.splice(indexesToRemove[i],1);
	}
	return newQueuedTasksArray;
}

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


					/*
					var tasksToQueueIDs = currentTaskData.tasksToQueue;
					var queuedTasks = newSceneData.character.queuedTasks;

					console.log(addQueuedTasksToCurrentTasks);
					// Create new current task list
					newSceneData.character.queuedTasks = addQueuedTasksToCurrentTasks(tasksToQueueIDs, queuedTasks) 

					// Get indexes of tasks from queue to remove
					var indexesToRemove = getIndexesToSpliceQueuedTasks(tasksToQueueIDArray, queuedTasks)

					// Remove tasks that are no longer in queue
					newSceneData.character.queuedTasks = removeTasksfromQueue(indexesToRemove, queuedTasks)
					*/

