
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var testHelper = require('./testHelper');
import {currentTasks, tasksToQueue, queuedTasks, exepectedOutputaddQueuedTasksToCurrentTasks, expectedOutputAfterSplicing} from '../react_assets/js/helpers/CorrectAnswerLogic';
import {addQueuedTasksToCurrentTasks, getIndexesToSpliceQueuedTasks, removeTasksfromQueue} from '../react_assets/js/helpers/CorrectAnswerLogic';

describe('Correct Answer Logic', () => {

	describe('1+1=2', () => {

		it('returns true', () => {
			var i = 1;
			var sum = i + i;
			expect(sum).to.equal(2);
		})
	})
	describe('On Correct Answer', () => {
		it ('Add Queued Tasks to Current Tasks', () => {
			var expectedResult = JSON.stringify(exepectedOutputaddQueuedTasksToCurrentTasks);
			var actualResult = JSON.stringify(addQueuedTasksToCurrentTasks(currentTasks, tasksToQueue, queuedTasks));
			expect(actualResult).to.equal(expectedResult);
		})

		it ('get indexes of tasks to remove from queued tasks', () => {
			var expectedResult = [0,1];
			var actualResult = getIndexesToSpliceQueuedTasks(tasksToQueue, queuedTasks);
			assert.deepEqual(expectedResult, actualResult, "Correct indexes were grabbed");
		})

		it ('remove newly current tasks from queued tasks', () => {
			var indexesToSplice = getIndexesToSpliceQueuedTasks(tasksToQueue, queuedTasks);
			var newQueuedArray = removeTasksfromQueue(indexesToSplice,queuedTasks);
			console.log(expectedOutputAfterSplicing);
			assert.deepEqual(expectedOutputAfterSplicing, newQueuedArray);
		}) 
	}) 
})

