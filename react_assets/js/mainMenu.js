var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');

var MainMenu = React.createClass({
	// username is passed down from mainMenu.html
	// TODO: Make it less hacky and set username to state OR query databse for current user
	render: function() {
		return (
			<MainMenuContainer 
				teacherUsername={username}/>
		)
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));