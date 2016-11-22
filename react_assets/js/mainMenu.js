var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');

var MainMenu = React.createClass({

	// This page is generally only called when accessed from a public page (loads mainMenu.html)
	// As a result, it should display the public version of the site
	render: function() {
		return (
			<MainMenuContainer 
				publicDisplay={true}/>
		)
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));