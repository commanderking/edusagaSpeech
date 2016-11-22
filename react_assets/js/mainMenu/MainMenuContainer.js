var React = require('react');
var ReactDOM = require('react-dom');
var Constants = require('../helpers/Constants');
var EpisodeTagList = require('./EpisodeTagLists');

var MainMenuContainer = React.createClass({
	getInitialState: function() {
		return {
			teacherEpisodeData: null
		}
	},
	loadSceneData: function() {
		var that = this;

		// if props for teacherEpisodes are received that means we should display a special set of episodes based on props 
		// else, load all the episodes that are public
		if (this.props.publicDisplay === false) {
			var username = this.props.teacherUsername;
			$.ajax({
				url: "/" + username + "/getEpisodes",
				type: "POST",
				data: username,
				dataType: "json"

			}).done(function(result){
				// Try to parse scenes return fromed views.py
				// If can't, that means that the user does not exist in database
				// so just return empty episodes
				if (result.success === true) {
					try {
						var parsedScenes = result["teacherEpisodeData"].scenes.replace('"[{', "[{").replace('}]"', '}]');
						result.teacherEpisodeData.scenes = JSON.parse(parsedScenes);
					} catch(err) {
						result.teacherEpisodeData.scenes = [];
					}
					that.setState({teacherEpisodeData: result.teacherEpisodeData});
				}
			});
		} else {
			$.getJSON("/static/data/teacherScenes/public.json", function(data) {})
				.success(function(data) {
					that.setState({teacherEpisodeData: data});
				});
		}
	},
	addEpisode: function(episodeName, episodeArrayIndex) {
		var that = this;
		var username = this.props.teacherUsername;
		var postURL = username + "/addEpisode";
		$.ajax({
			url: postURL,
			type: "POST",
			data: episodeName, 
			dataType: "json",
		})
			.done(function(result){
				if (result["success"] === true) {
					var parsedEpisodeArray = JSON.parse(result.episodeArray["scenes"]);	
					var newTeacherEpisodeData = {"scenes": parsedEpisodeArray};

					// Remove the episode from display
					var newTeacherEpisodeData = JSON.parse(JSON.stringify(that.state.teacherEpisodeData));
					newTeacherEpisodeData.scenes.splice(episodeArrayIndex,1);
					that.setState({teacherEpisodeData: newTeacherEpisodeData});
				}
			});

		// Remove the episode from the display;

	},
	removeEpisode: function(episodeName, episodeArrayIndex) {
		var that = this;
		var username = this.props.teacherUsername;
		var postURL = username + "/removeEpisode";
		$.ajax({
			url: postURL,
			type: "POST",
			data: episodeName, 
			dataType: "json"
		}).done(function(result){
			if (result["success"] = true) {
				var newTeacherEpisodeData = JSON.parse(JSON.stringify(that.state.teacherEpisodeData));
				newTeacherEpisodeData.scenes.splice(episodeArrayIndex,1);
				that.setState({teacherEpisodeData: newTeacherEpisodeData});
			}

		});	
	},
	sortEpisodeArraybySequence: function(episodeArray) {
		return episodeArray.sort(function(a,b) {
			var x = a["sequence"];
			var y = b["sequence"];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		})
	},
	generateDOMfromEpisodesArray: function(episodeArray) {
		var that = this;
		if (studentID === undefined) {
			var studentID = '';
		}
		var episodeListToReturn = episodeArray.map(function(scene, i) {
			// We are passed a sorted array based on topic;
			// But in render function, we store the originalArrayIndex and store it in object
			var originalIndex = scene.originalArrayIndex;

			var link = scene.link + "?" + studentID;
			var className = "episodeBlock activeScene-" + scene.assigned;
			var characterImage = Constants.IMAGE_PATH + scene.characterImage;
			var starIconSrc = Constants.IMAGE_PATH + "UI/Icon_Star-01.png";
			var starIcon = scene.assigned ? <img src={starIconSrc} /> : null;

			// Loop through can do statements for each episode to prepare DOM elements
			var canDoStatements = scene.objectives.map(function(objective, j) {
				var reactKey = "objective" + j;
				return (
					<li key={reactKey}>{objective}</li>
				)
			})

			// If it's the publicDisplay and the user is loggedin, allow user to add the episode to their library
			// Otherwise, it's the public display, and add functionality should not be there
			var addButton = that.props.publicDisplay && that.props.username !== undefined ? 
				<button onClick={() => that.addEpisode(scene.id, originalIndex)} className="btn btn-info">
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add
				</button> : null;

			// If passed teacherEpisodes, that means these episodes are already in teacher database
			// As a result, display the remove episode button
			var removeButton = !that.props.publicDisplay ?
				<button onClick={() => that.removeEpisode(scene.id, originalIndex)} className="btn btn-info" data-index={originalIndex}>
					<span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
				</button> : null;	

			return (
					<div key={originalIndex} className="episodeBlockWrapper">
						<li className={className}>
							{starIcon}
							<h3>{scene.name}</h3>
							<img className="characterImage" src={characterImage} />

							<p><b>Scenario:</b> {scene.scenario}</p>
							<div><b>Can Do Statements:</b> <br /> {canDoStatements}</div>
						</li>
						<div className="buttonLine">
							<a href={link} className="btn btn-info"
								id={scene.id} key={originalIndex} data-index={originalIndex}>
								<span className="glyphicon glyphicon-play" aria-hidden="true"></span>
								Play
							</a>
							{addButton}
							{removeButton}
						</div>
					</div>)
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
		if (this.state.teacherEpisodeData) {
			var that = this;
			// Divide teacherEpisodeData into subcategories

			var introEpisodes = [];
			var familyNationalityEpisodes = [];
			var dateTimeEpisodes = [];
			var likesDislikesEpisodes = [];
			var reviewEpisodes = [];
			var otherEpisodes = [];

			this.state.teacherEpisodeData.scenes.forEach(function(episode, arrayIndex) {
				// Add the tags to the set; use set to avoid repeats
				tagsSet.add(episode.tags[0]);

				episode.originalArrayIndex = arrayIndex;

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
						break;
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

			// Sort array by sequence and then generate DOM elements to display
			var introEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(introEpisodes));
			var familyNationalityEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(familyNationalityEpisodes));
			var dateTimeEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(dateTimeEpisodes));
			var likesDislikesEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(likesDislikesEpisodes));
			var reviewEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(reviewEpisodes));
			var otherEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(otherEpisodes));

		} else { scenes = "Nothing!"; }

		// Check for title text passed through as props
		var title = "Episodes Available"
		if (this.props.title) {
			title = this.props.title 
		}

		if (!this.state.teacherEpisodeData) {
				return <div>Loading</div>
		} else {
			return (
					<div className="container-fluid">
						<h2 className="menuTitle">{title}</h2>
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

module.exports = MainMenuContainer;