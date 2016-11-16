var React = require('react');
var ReactDOM = require('react-dom');
var MainMenuContainer = require('./mainMenu/MainMenuContainer');
var NavBarButton = require('./teacherHome/NavBarButton');

var TeacherHome = React.createClass({
	getInitialState: function() {
		return {
			username: null,
			currentContent: "My Episodes"
			// refreshData forces menu Container to call loadSceneData
			// Otherwise, episode data will only be loaded on mounting and my episode and public episode page look the same
		}
	},
	changeContent: function(newContent) {
		this.setState({ currentContent: newContent});
		console.log(newContent);
	},
	componentDidMount: function() {
		if (username) {
			this.setState({username: username});
		}
		console.log(username);
	},
	render: function() {
		var content;
		switch(this.state.currentContent) {
			case "My Episodes": 
				content = <MainMenuContainer title="My Episodes" 
						teacherEpisodes={episodeArray} 
						key="myEpisodes"/>
				break;
			case "Public Episodes":
				content = <MainMenuContainer 
							title="Public Episodes"
							teacher={this.state.username}
							key="publicEpisodes" />
				break;
			case "Vocab Lists":
				content = <div className="vocabLists">
						<h1>My Vocab Lists</h1>
						<button className="viewPublicEpisodes"></button>
					</div>;
				break;
			default:
				content = <h1>Nothing to see! </h1>
				break;
		}

		return (
			<div>
				<div className="header">
					<h2>Welcome {username}</h2>
				</div>
				<ul className="navBar">
					<NavBarButton 
						text="My Episodes"
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