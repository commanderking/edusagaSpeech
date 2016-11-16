var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');

var TeacherHome = React.createClass({
	render: function() {
		console.log(episodeArray["scenes"][0]);
		return (
			<div>
				Welcome {username}
				<div className="episodes">
					<h1>My episodes</h1>
					<MainMenuContainer 
						title="My Episodes"
						teacherEpisodes={episodeArray}/>
					<button className="viewPublicEpisodes">View Public Episodes</button>
					<h1>Public Episodes</h1>
					<MainMenuContainer />

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