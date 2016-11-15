var React = require('react');
var ReactDOM = require('react-dom');

var TeacherHome = React.createClass({
	render: function() {
		return (
			<div>
				{username}
				{episodeArray}
				<div className="episodes">

				</div>
				<div className="vocabLists">
				</div>
			</div>
		)
	}
});

ReactDOM.render(<TeacherHome />, document.getElementById('teacherHome'));