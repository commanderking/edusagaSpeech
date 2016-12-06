var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');

var MainMenu = React.createClass({

	// teacherUsername={username}, username is defined in mainMenu.html and pulled from url
	// General case is when students visit a teacher page and need to load the teacher's data
	render: function() {
		console.log(username);
		if (username !== "public") {
			return <MainMenuContainer 
				publicDisplay={false}
				teacherUsername={username} />
		} else {
			return (
				<MainMenuContainer 
					publicDisplay={true}/>
			)
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));