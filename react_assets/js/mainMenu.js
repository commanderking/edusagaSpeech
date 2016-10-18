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
	generateDOMfromEpisodesArray: function(episodeArray) {
		console.log("in generate");
		var episodeListToReturn = episodeArray.map(function(scene, i) {
			console.log(scene);
			var link = scene.link + "?" + studentID;
			var className = "episodeBlock activeScene-" + scene.assigned;
			var starIconSrc = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
			var starIcon = scene.assigned ? <img src={starIconSrc} /> : null;


			// Loop through can do statements for each episode to prepare DOM elements
			var canDoStatements = scene.objectives.map(function(objective, i) {
				var reactKey = "objective" + i;
				return (
					<li key={reactKey}>{objective}</li>
				)
			})

			return (<a href={link}
						key={i}
						data-index={i}>
						<li className={className}>
							{starIcon}
							<h3>{scene.name}</h3>
							<p><b>Scenario:</b> {scene.scenario}</p>
							<div><b>Can Do Statements:</b> <br /> {canDoStatements}</div>
						</li>
					</a>)
		});
		return episodeListToReturn;
	},
	componentDidMount: function() {
		this.loadSceneData();
	},
	render: function() {

		var scenes;

		// Create link for each scene that should be available to student
		var tagsSet = new Set();
		if (this.state.teacherData) {
			var that = this;
			// Divide teacherData into subcategories

			var introEpisodes = [];
			var familyNationalityEpisodes = [];
			var dateTimeEpisodes = [];
			var likesDislikesEpisodes = [];
			var reviewEpisodes = [];
			var otherEpisodes = [];

			this.state.teacherData.scenes.forEach(function(episode, i) {
				// Generate array of tags
				tagsSet.add(episode.tags[0]);
				console.log(episode.tags[0]);
				switch(episode.tags[0]) {
					case "introduction":
					case "greetings": 
						introEpisodes.push(episode);
						break;
					case "family":
					case "nationality":
						familyNationalityEpisodes.push(episode);
						break;
					case "date":
					case "time": 
						dateTimeEpisodes.push(episode);
						break;
					case "hobbies":
					case "food": 
						likesDislikesEpisodes.push(episode);
						break;
					case "review":
						reviewEpisodes.push(episode);
						break;
					case "activities":
						otherEpisodes.push(episode);
						break;
					default:
						break;
				}
			})

			// Sort episodes by their tag in one object
			var sortedEpisodes = {};

			tagsSet.forEach(function(tag) {
				sortedEpisodes[tag] = [];
				that.state.teacherData.scenes.forEach(function(episode) {
					if (episode.tags[0] === tag) {
						sortedEpisodes[tag].push(episode);
					}
				})
			})
			console.log(introEpisodes);
			console.log(familyNationalityEpisodes);
			console.log(otherEpisodes);
			console.log(sortedEpisodes);

			// Generate DOM elements to display
			var introEpisodeList = this.generateDOMfromEpisodesArray(introEpisodes);
			var familyNationalityEpisodeList = this.generateDOMfromEpisodesArray(familyNationalityEpisodes);
			var dateTimeEpisodeList = this.generateDOMfromEpisodesArray(dateTimeEpisodes);
			var likesDislikesEpisodeList = this.generateDOMfromEpisodesArray(likesDislikesEpisodes);
			var reviewEpisodeList = this.generateDOMfromEpisodesArray(reviewEpisodes);
			var otherEpisodeList = this.generateDOMfromEpisodesArray(otherEpisodes);




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
					<h2>Introduction/Greetings</h2>
					<ul className="scenarioList">
						{introEpisodeList}
					</ul>
					<h2>Family/Nationality</h2>
					<ul className="scenarioList">
						{familyNationalityEpisodeList}
					</ul>
					<h2>Dates and Times</h2>
					<ul className="scenarioList">
						{dateTimeEpisodeList}
					</ul>
					<h2>Likes and Dislikes, Appointments</h2>
					<ul className="scenarioList">
						{likesDislikesEpisodeList}
					</ul>
					<h2>Review</h2>
					<ul className="scenarioList">
						{reviewEpisodeList}
					</ul>
					<h2>Additional</h2>
					<ul className="scenarioList">
						{otherEpisodeList}
					</ul>
				</div>	
			)
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));