
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
			expect(lengthCurrentTasks).to.equal(6);
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
		var possibleAnswers = [
			{
				"answers" : [
					["你", "您"],
					["今天", "下午"], 
					["想不想", "要不要"],
					["跟我", "和我"], 
					["打乒乓球"]
				],
				"response" : "好啊。",
				"soundID" : "ok1"
			},
			{
				"answers" : [
					["你", "您"], 
					["今天", "下午"],
					["想", "要", "想要"],
					["跟我", "和我"],
					["打乒乓球吗"]
				],
				"response" : "好啊。",
				"soundID" : "ok2"
			}
		];

		it ('test exact answers', () => {
			var userAnswer = "你怎么样";
			var userAnswer2 = "你好吗";
			var expectedOutput = {
				"answerCorrect" : true,
				"responseSoundID" : "feichanghao",
				"possibleAnswersIndex" : 0
			}

			var actualOutput = SpeechChecker.checkAnswer(userAnswer, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);

			var actualOutput = SpeechChecker.checkAnswer(userAnswer2, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);
	
		});

		it ('test that exact match functionality works', () => {
			// If 有吃 is a possible answer, but user says 没有吃, it'll still match.
			// In this case, an exact match should be used to prevent this mistake from happening
			var userAnswer = "没有吃"; // Should be wrong, even though contais "有吃" because of exact match

			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 2).answerCorrect;
			expect(answerCorrect).to.equal(false);

			// should be right, exact match
			var userAnswer2 = "有吃";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer2, testJSON, 2).answerCorrect;
			expect(answerCorrect).to.equal(true);

			// should be wrong, might technically be riht, but not exact match
			var userAnswer3 = "有吃汉堡";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer3, testJSON, 2).answerCorrect;
			expect(answerCorrect).to.equal(false);
		})

		it ('test correct, but non-exact answer', () => {
			var userAnswer = "你今天好吗";
			var userAnswer2 = "你好吗";
			var expectedOutput = {
				"answerCorrect" : true,
				"responseSoundID" : "feichanghao",
				"possibleAnswersIndex" : 0	
			}
			var actualOutput = SpeechChecker.checkAnswer(userAnswer, testJSON, 1);
			assert.deepEqual(actualOutput, expectedOutput);
		})

		it ('test incorrect answer', () => {
			var userAnswer = "你是笨蛋";
			var userAnswer2 = "杨怎么";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 1).answerCorrect;
			expect(answerCorrect).to.equal(false);

			var answerCorrect = SpeechChecker.checkAnswer(userAnswer2, testJSON, 1).answerCorrect;
			expect(answerCorrect).to.equal(false);

		});

		it ('test that if answer contains an exception, answer will be incorrect when matched', () => {
			// This is an answer that would be accepted for 吃了 or 没吃, but is grammatically wrong, so we want to make sure this answer is precluded
			var userAnswer = "没吃了";

			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 4).answerCorrect;
			expect(answerCorrect).to.equal(false);
		})

		describe ('test very tricky case with use of time', () => {

			it ('test 7点39分', () => {
				var userAnswer = "7点39分";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(true);
			})

			it ('test 七点半', () => {
				var userAnswer = "七点半";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(true);
			})

			it ('test 七点30分', () => {
				var userAnswer = "七点30分";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(true);
			})

			it ('test 七点分三十', () => {
				var userAnswer = "七点分三十";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(false);

				var userAnswer = "七点分30";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(false);
			})

			it ('test 我三点半起床', () => {
				var userAnswer = "我三点半起床";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(true);
			})

			it ('test 我三点半睡觉', () => {
				var userAnswer = "我三点半睡觉";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(false);
			})

			it ('test 我八点起床', () => {
				var userAnswer = "我八点起床";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(true);
			})
			it ('test 我八点分三十起床', () => {
				var userAnswer = "我八点分三十起床";
				var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 5).answerCorrect;
				expect(answerCorrect).to.equal(false);
			})
		})

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

		it ('advanced check based on grammar components - correct check', () => {
			var userAnswer = "你今天要不要跟我打乒乓球";
			// Test a couple of correct answer for testString
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			var soundID = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).responseSoundID;
			expect(answerCorrect).to.equal(true);
			expect(soundID).to.equal("ok1");


			var userAnswer = "你今天想和我打乒乓球吗";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			var soundID = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).responseSoundID;
			expect(answerCorrect).to.equal(true);
			expect(soundID).to.equal("ok2");

			var userAnswer = "你下午要不要跟我打乒乓球"
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			var soundID = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).responseSoundID;
			expect(answerCorrect).to.equal(true);
			expect(soundID).to.equal("ok1");

		});


		it ('advanced check - incorrect check', () => {
			// Test incorrect answers 
			var userAnswer = "你是笨蛋";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			expect(answerCorrect).to.equal(false);

			var userAnswer = "你今天想吃汉堡吗";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			expect(answerCorrect).to.equal(false);

			var userAnswer = "你";
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			expect(answerCorrect).to.equal(false);
		});

		it ('advanced check - reverse answer check' , () => {
			var userAnswer = "打乒乓球跟我要不要你下午"
			var answerCorrect = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).answerCorrect;
			var soundID = SpeechChecker.checkAnswer(userAnswer, testJSON, 3).responseSoundID;
			expect(answerCorrect).to.equal(false);
		})
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

