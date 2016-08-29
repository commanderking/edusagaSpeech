var React = require('react');
var ReactDOM = require('react-dom');

var MainMenu = React.createClass({
	getInitialState: function() {
		return {
			teacherData: null
		}
	},
	loadSceneData: function() {
		var that = this;
		$.getJSON("/static/data/teacherScenes/" + teacher + ".json", function(data) {})
			.success(function(data) {
				that.setState({teacherData: data});
			});
	},
	componentDidMount: function() {
		this.loadSceneData();
	},
	render: function() {
		var scenes;
		if (this.state.teacherData) {
			this.state.teacherData.scenes.forEach(function(scene, i) {
				scenes = <a href="../pa1"><li>{scene.name}</li></a>
			});
		} else {
			scenes = "Nothing!";
		}


		if (!this.state.teacherData) {
			return <div>Loading</div>
		} else {
			return (
				<div>
					<h1>{this.state.teacherData.name}</h1>
					<ul>
						{scenes}
					</ul>
				</div>	
			)	
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));