var React = require('react');
var ReactDOM = require('react-dom');
var Constants = require('./helpers/Constants');
var EpisodeTagList = require('./mainMenu/EpisodeTagLists');

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
		var episodeListToReturn = episodeArray.map(function(scene, i) {
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
			/*
			var sortedEpisodes = {};

			tagsSet.forEach(function(tag) {
				sortedEpisodes[tag] = [];
				that.state.teacherData.scenes.forEach(function(episode) {
					if (episode.tags[0] === tag) {
						sortedEpisodes[tag].push(episode);
					}
				})
			})*/

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
					<EpisodeTagList
						header = "Introduction/Greetings"
						episodeList = {introEpisodeList} />
					<EpisodeTagList
						header = "Family/Nationality"
						episodeList = {familyNationalityEpisodeList} />
					<EpisodeTagList
						header = "Dates and Times"
						episodeList = {dateTimeEpisodeList} />
					<EpisodeTagList
						header = "Likes and Dislikes, Inviting People"
						episodeList = {likesDislikesEpisodeList} />
					<EpisodeTagList
						header = "Review"
						episodeList = {reviewEpisodeList} />
					<EpisodeTagList
						header = "Additional"
						episodeList = {otherEpisodeList} />
				</div>	
			)
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));