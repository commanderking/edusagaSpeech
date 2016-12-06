var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var Constants = require('../helpers/Constants');
var EpisodeTagList = require('./EpisodeTagLists');
import {iconSelector} from '../helpers/ImageHelper';

var MainMenuContainer = React.createClass({
	getInitialState: function() {
		return {
			teacherEpisodeData: null
		}
	},
	getTeacherEpisodes: function(teacherUsername, doneCallback) {
		$.ajax({
			url: "/" + teacherUsername + "/getEpisodes",
			type: "POST",
			data: teacherUsername,
			dataType: "json"

		}).done(function(result){
			if (result.success === true) {
				try {
					var parsedScenes = result["teacherEpisodeData"].scenes.replace('"[{', "[{").replace('}]"', '}]');
					result.teacherEpisodeData.scenes = JSON.parse(parsedScenes);
				} catch(err) {
					result.teacherEpisodeData.scenes = [];
				}
				console.log(result.teacherEpisodeData);
				doneCallback(result.teacherEpisodeData);
			}
		});
	},
	loadSceneData: function() {
		var that = this;

		// if props for teacherEpisodes are received that means we should display a special set of episodes based on props 
		// else, load all the episodes that are public
		if (this.props.publicDisplay === false) {
			var username = this.props.teacherUsername;
			console.log(username);
			var setEpisodeData = function(episodeData) {
				that.setState({teacherEpisodeData: episodeData}, console.log(episodeData));
			};
			that.getTeacherEpisodes(username, setEpisodeData);
		} else {
			$.getJSON("/static/data/teacherScenes/public.json", function(data) {})
				.success(function(data) {

					// Function to feed into getTeacherEpisode callback (only relevant for teacher's page)
					var setEpisodeData = function(episodeData) {

						// filteredEpisodes includes only remaining public episodes the teacher does not already have
						var filteredEpisodes = data.scenes.filter(function(episodePublic, i) {
							var episodeFound = false;
							episodeData.scenes.forEach(function(episodeDataEpisode, j) {
								if (episodeDataEpisode.id === episodePublic.id) {
									episodeFound = true;
								}
							});
							// If teacher has episode, do not return it to the publicly viewed array
							return episodeFound ? false : true;
						});
						// Create newEpisodeData data structure to set as teacherEpisodeData
						var newEpisodeData = {};
						newEpisodeData.scenes = filteredEpisodes;
						that.setState({teacherEpisodeData: newEpisodeData});
					};
					
					// teacherUsername undefined if coming from public version of site
					// lets viewers see all publicly available episodes
					if (that.props.teacherUsername === undefined) {
						that.setState({teacherEpisodeData: data});
					} else {
						that.getTeacherEpisodes(that.props.teacherUsername, setEpisodeData)
					}
				});
		}
	},
	addEpisode: function(episodeName, episodeArrayIndex) {
		var that = this;
		var username = this.props.teacherUsername;
		var postURL = "/" + username + "/addEpisode";
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

					// Remove the episode from public display
					var newTeacherEpisodeData = JSON.parse(JSON.stringify(that.state.teacherEpisodeData));
					newTeacherEpisodeData.scenes.splice(episodeArrayIndex,1);
					that.setState({teacherEpisodeData: newTeacherEpisodeData});
				}
				if (that.props.activateFlashMessage) {
					that.props.activateFlashMessage("Episode Added!");
				}
			});
	},
	removeEpisode: function(episodeName, episodeArrayIndex) {
		var that = this;
		var username = this.props.teacherUsername;
		var postURL = "/" + username + "/removeEpisode";
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
			if (that.props.activateFlashMessage) {
				that.props.activateFlashMessage("Episode removed!");
			}

		});	
	},
	// Sort episodes based on the sequence number in the JSON file
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
			// Convered indexes from each topic to absolute index
			// I.e. Introduction: [0,1,2], Family: [0,1,2,3,4] --> [0,1,2,3,4,5,6,7]
			// scene.originalArrayIndex is created in the render function
			var originalIndex = scene.originalArrayIndex;
			var link = scene.link + "?" + studentID;
			var className = "episodeBlock activeScene-" + scene.assigned;
			var characterImage = iconSelector(scene.characterName) === null ? 
				Constants.IMAGE_PATH + scene.characterImage : iconSelector(scene.characterName);
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
			var addButton = that.props.publicDisplay && that.props.teacherUsername !== undefined ? 
				<button onClick={() => that.addEpisode(scene.id, originalIndex)} className="btn btn-info">
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Assign
				</button> : null;

			// If passed teacherEpisodes, that means these episodes are already in teacher database
			// As a result, display the remove episode button
			var removeButton = !that.props.publicDisplay ?
				<button onClick={() => that.removeEpisode(scene.id, originalIndex)} className="btn btn-info" data-index={originalIndex}>
					<span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Unassign
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
		console.log(this.props.publicDisplay);
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
		} else if (this.state.teacherEpisodeData.scenes.length === 0) {
			return (<div className="container-fluid">
						<h2 className="menuTitle">No Episodes Added Yet</h2>
							<button 
								className="btn btn-info btn-add-episodes"
								onClick={() => this.props.changeContent("Public Episodes")}>
								Add New Episodes
							</button>
					</div>)
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

MainMenuContainer.propTypes = {
	changeContent : PropTypes.func
}