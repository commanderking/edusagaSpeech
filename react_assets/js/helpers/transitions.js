// Transitions related to clicking a task to enter 

var activateTask = {
	mic: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 0.25, { scale: 0})
			.to(DOMnode, 0.25, {scale: 1.5})
	},
	star: function(DOMnode) {
		var tl = new TimelineMax({delay: 0.25});
		tl.to(DOMnode, 0.25, {scale: 2})
			.to(DOMnode, 0.25, {scale: 1.5})
			.to(DOMnode, 2, {rotation:"360", ease:Linear.easeNone, repeat: -1});
	}
}

var taskCorrect = {
	star: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 1, {scale: 0.5})
			.to(DOMnode, 1, {scale: 1.5})
			.to(DOMnode, 1, {scale: 1})
			.to(DOMnode, 1, {rotation:"360", scale: 0});
	},
	mic: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 0, {scale: 1.5})
			.to(DOMnode, 2, {opacity: 0, scale: 0});
	},
	coins: function(DOMnode) {
		var tl = new TimelineMax({delay: 1});
		tl.to(DOMnode, 0, {autoAlpha: 0})
			.to(DOMnode, 1, {y: '-=50', autoAlpha: 1})
			.to(DOMnode, 1, {autoAlpha:0});
	},
	character: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 0.8, { x: -300, opacity: 0})
			.to(DOMnode, 0.1, { x: 0})
			.to(DOMnode, 0.5, { opacity: 1})	
	},
	taskText: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 0.5, { y: -30, opacity: 0})
			.to(DOMnode, 0.5, { y: 0, opacity: 1})		
	}
}

var taskWrong = {
	star: function(DOMnode) {

		var tl = new TimelineMax();
		/*
		tl.to(DOMnode, 1, {scale: 1.5})
			.to(DOMnode, 1, {scale: 0});
		*/
		tl.fromTo(DOMnode, 1, {scale: 1.5}, {scale: 2.1})
			.to(DOMnode, 1, {scale: 1.5});
	},
	questionMark: function(DOMnode) {
		var tl = new TimelineMax();
		tl.fromTo(DOMnode, 1, {scale: 1.5}, {scale: 2.1})
			.to(DOMnode, 1, {scale: 1.5});
	},
	character: function(DOMnode) {
		var tl = new TimelineMax();
		tl.to(DOMnode, 0.5, { x: -500, opacity: 0})
			.to(DOMnode, 0.1, { x: 0})
			.to(DOMnode, 0.5, { opacity: 1})	
	}
}

var referenceForNow = {
	imageTransition: function(DOMnode, thisContext) {
		TweenMax.fromTo(DOMnode, 2, 
			{ width: 0, height: 0, scale: 0.2, opacity: 0, rotation: -180, left: -50 }, 
			{ width: 50, height: 50, scale: 1, opacity: 1, rotation: 0, left: -25,
			ease: Expo.easeInOut, onCompleteScope: thisContext });
	}
}

module.exports = {
	activateTask: activateTask,
	taskCorrect: taskCorrect,
	taskWrong: taskWrong
};