var React = require('react');
var ReactDOM = require('react-dom');

var TeacherHome = React.createClass({
	render: function() {
		return (
			<div>
				{username}
				{episodeArray}
				<div className="episodes">
					<h1>My episodes</h1>
					<button className="viewPublicEpisodes">View Public Episodes</button>
					<div id="#app"></div>
				</div>
				<div className="vocabLists">
					<h1>My Vocab Lists</h1>
					<button className="viewPublicEpisodes"></button>
				</div>
			</div>
		)
	}
});

ReactDOM.render(<TeacherHome />, document.getElementById('teacherHome'));