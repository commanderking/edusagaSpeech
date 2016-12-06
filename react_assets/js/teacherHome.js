var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');
var NavBarButton = require('./teacherHome/NavBarButton');

var TeacherHome = React.createClass({
	getInitialState: function() {
		return {
			username: null,
			currentContent: "Assigned Episodes",
			flashMessageVisible: false,
			flashMessageContent: null
		}
	},
	changeContent: function(newContent) {
		this.setState({ currentContent: newContent});
	},
	componentWillMount: function() {
		// This username variable is passed from teacherHome.html
		if (username) {
			this.setState({username:username})
		}
	},
	activateFlashMessage: function(message) {
		this.setState({
			flashMessageVisible: true,
			flashMessageContent: message
		});
	},
	deactivateFlashMessage: function(message) {
		this.setState({
			flashMessageVisible: false
		})
	},
	render: function() {
		console.log("Username in teacherHome.js is " + username)
		var content;
		switch(this.state.currentContent) {
			case "Assigned Episodes": 
				content = <MainMenuContainer title="Assigned Episodes" 
						teacherUsername={this.state.username}
						publicDisplay={false}
						activateFlashMessage={this.activateFlashMessage}
						changeContent={this.changeContent}
						key="myEpisodes"/>
				break;
			case "Public Episodes":
				content = <MainMenuContainer 
							title="Public Episodes"
							teacherUsername={this.state.username}
							publicDisplay={true}
							activateFlashMessage={this.activateFlashMessage}
							key="publicEpisodes" />
				break;
			case "Vocab Lists":
				content = <div className="vocabLists">
						<h1>My Vocab Lists</h1>
						<button className="viewPublicEpisodes"></button>
					</div>;
				break;
			default:
				content = <div className="container-fluid">
							<h1>No Episodes Assigned</h1>
						</div>
				break;
		}
		var flashMessage = this.state.flashMessageVisible ?
			<div onClick={this.deactivateFlashMessage}>
				<span>{this.state.flashMessageContent}</span>
				<span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
			</div> : null

		return (
			<div>
				<div className="header">
					<h2>Welcome {username}</h2>
					{flashMessage}
				</div>
				<ul className="navBar">
					<NavBarButton 
						text="Assigned Episodes"
						clickFunction={this.changeContent} />
					<NavBarButton 
						text="Public Episodes"
						clickFunction={this.changeContent} />
					<NavBarButton 
						text="Vocab Lists"
						clickFunction={this.changeContent} />
					<li>Create Vocab List</li>
				</ul>
				<div className="content">
					{content}
				</div>
			</div>
		)
	}
});

ReactDOM.render(<TeacherHome />, document.getElementById('teacherHome'));