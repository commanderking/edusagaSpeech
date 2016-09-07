var React = require('react');
var ReactDOM = require('react-dom');
var Constants = require('./helpers/Constants');

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

		// Create link for each scene that should be available to student
		if (this.state.teacherData) {
			scenes = this.state.teacherData.scenes.map(function(scene, i) {
				var link = scene.link + "?" + studentID;
				var className = "activeScene-" + scene.assigned;
				var starIconSrc = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
				var starIcon = scene.assigned ? <img src={starIconSrc} /> : null;
				return (<a href={link}
							key={i}
							data-index={i}>
							<li className={className}>
								{starIcon}
								<h3>{scene.name}</h3>
								<p><b>Scenario:</b> {scene.scenario}</p>
								<p><b>Key Phrases:</b> {scene.grammar}</p>
							</li>

						</a>)
			});
		} else { scenes = "Nothing!"; }

		if (!this.state.teacherData) {
				return <div>Loading</div>
		} else {
			return (
				<div className="container-fluid">
					<h1>Episodes Available</h1>
					<ul className="scenarioList">
						{scenes}
					</ul>
				</div>	
			)
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));