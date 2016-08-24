
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var testJSON = require('./data/questionAskerTest.json');
var testHelper = require('./testHelper');
import {TaskController, SpeechChecker} from '../react_assets/js/helpers/QuestionAskerHelper';
import {currentTasks, tasksToQueue, queuedTasks, exepectedOutputaddQueuedTasksToCurrentTasks, expectedOutputAfterSplicing} from '../react_assets/js/helpers/QuestionAskerHelper';
import {addQueuedTasksToCurrentTasks, getIndexesToSpliceQueuedTasks, removeTasksfromQueue} from '../react_assets/js/helpers/QuestionAskerHelper';

describe('Question Asker Logic', () => {

	describe('Getting correct variables out of data structure', () => {
		it ('get current tasks', () => {
			// Doesn't actually deep compare data structure, just some key elements
			var lengthCurrentTasks = TaskController.getCurrentTasks(testJSON).length;
			var task1text = TaskController.getCurrentTasks(testJSON)[0].task;
			expect(lengthCurrentTasks).to.equal(2);
			expect(task1text).to.equal("Greet him");
		});

		it ('get the activeTask, which contains right keys', () => {
			var currentTask = TaskController.getActiveTask(testJSON, 0);

			var currentTaskText = currentTask.task;
			var taskID = currentTask.taskID;
			var possibleAnswersLength = currentTask.possibleAnswers.length;

			expect(currentTaskText).to.equal("Greet him");
			expect(taskID).to.equal(1);
			expect(possibleAnswersLength).to.equal(2);
		});

		it ('get taskIDsToQueue from current tasks', () => {
			var expectedIDs = [2,3,4];
			assert.deepEqual(TaskController.getTaskIDsToQueueOfCurrentTasks(testJSON), expectedIDs);
		});
	});

	describe('Check user answers', () => {
		it ('test exact answer', () => {
			var userAnswer = "你怎么样";
			var userAnswer2 = "你好吗";
			var expectedOutput = {
				"answerCorrect" : true,
				"responseSoundID" : "feichanghao",
				"possibleAnswersIndex" : 0
			}

			var actualOutput = SpeechChecker.typicalCheck(userAnswer, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);

			var answerCorrect = SpeechChecker.typicalCheck(userAnswer2, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);
		});

		it ('test correct, but non-exact answer', () => {
			var userAnswer = "你今天好吗";
			var expectedOutput = {
				"answerCorrect" : true,
				"responseSoundID" : "feichanghao",
				"possibleAnswersIndex" : 0	
			}
			var actualOutput = SpeechChecker.typicalCheck(userAnswer, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);
		})

		it ('test incorrect answer', () => {
			var userAnswer = "你是笨蛋";
			var userAnswer2 = "杨怎么";
			var answerCorrect = SpeechChecker.typicalCheck(userAnswer, testJSON, 1).answerCorrect;
			expect(answerCorrect).to.equal(false);

			var answerCorrect = SpeechChecker.typicalCheck(userAnswer2, testJSON, 1).answerCorrect;
			expect(answerCorrect).to.equal(false);

		});

		it ('add user answer to attemptedAnswers', () => {
			var userAnswer = "你不好";
			var expectedAttemptedAnswers = ["你不好"];
			assert.deepEqual(expectedAttemptedAnswers, SpeechChecker.addUserAnswerToAttemptedAnswers(userAnswer, testJSON, 0));

			// Update the testJSON to include the first attempted Answer
			var newTestJSON = JSON.parse(JSON.stringify(testJSON));
			newTestJSON.character.currentTasks[0].attemptedAnswers = expectedAttemptedAnswers;

			// Add second guess
			userAnswer = "你好";
			var expectedAttemptedAnswers = ["你不好", "你好"];
			assert.deepEqual(expectedAttemptedAnswers, SpeechChecker.addUserAnswerToAttemptedAnswers(userAnswer, newTestJSON, 0));
		});
	})

	describe('Updating current, queued, and completed tasks', () => {
		it ('add queued tasks to current tasks', () => {
			var expectedResult = exepectedOutputaddQueuedTasksToCurrentTasks;
			var actualResult = TaskController.addQueuedTasksToCurrentTasks(currentTasks, tasksToQueue, queuedTasks);
			assert.deepEqual(expectedResult, actualResult, "Queued tasks added to expected tasks");
		})

		it ('get indexes of tasks to remove from queued tasks', () => {
			var expectedResult = [0,1];
			var actualResult = TaskController.getIndexesToSpliceQueuedTasks(tasksToQueue, queuedTasks);
			assert.deepEqual(expectedResult, actualResult, "Correct indexes were grabbed");
		})

		it ('remove now current tasks from queued tasks', () => {
			var indexesToSplice = TaskController.getIndexesToSpliceQueuedTasks(tasksToQueue, queuedTasks);
			var newQueuedArray = TaskController.removeTasksfromQueue(indexesToSplice,queuedTasks);
			assert.deepEqual(expectedOutputAfterSplicing, newQueuedArray);
		}) 
	})

	describe ('Skipping Tasks', () => {
		// Grab the IDs of tasks To be queued on current tasks

		// Remove current tasks and add them to completed tasks 

		// Add them to current Tasks, check they have been removed from currentTasks

		// Return arrays in completed list without correct label

		var completedTasks = [];
		// expect(completedTasks[0].correctAnswer).to.equal(false);

	})
})

