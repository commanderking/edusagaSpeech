var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var testJSON = require('./data/questionAskerTest.json');

describe('Check data structure of question asker tests', () => {
	describe('hintUsed key present for all tasks and initiates as false', () => {

		var currentTasks = testJSON.character.currentTasks;
		var queuedTasks = testJSON.character.queuedTasks;
		var allTasks = currentTasks.concat(queuedTasks);
		console.log(allTasks);

		var hintUsedAbsentArray = [];
		allTasks.forEach(function(task) {
			// console.log(task.hintUsed);
			if (task.hintUsed === false) {
			} else {
				hintUsedAbsentArray.push(task.task);
			}
		})
		// console.log(hintUsedAbsentArray);
		expect(hintUsedAbsentArray.length).to.equal(0);
	})
}) 