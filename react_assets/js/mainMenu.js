var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');

var MainMenu = React.createClass({
	render: function() {
		return (
			<MainMenuContainer />
		)
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));