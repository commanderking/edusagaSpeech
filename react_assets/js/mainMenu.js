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
	sortEpisodeArraybySequence: function(episodeArray) {
		return episodeArray.sort(function(a,b) {
			var x = a["sequence"];
			var y = b["sequence"];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		})
	},
	generateDOMfromEpisodesArray: function(episodeArray) {
		var episodeListToReturn = episodeArray.map(function(scene, i) {
			var link = scene.link + "?" + studentID;
			var className = "episodeBlock activeScene-" + scene.assigned;
			var characterImage = Constants.IMAGE_PATH + scene.characterImage;
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
							<img className="characterImage" src={characterImage} />

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

			// Sort array by sequence and then generate DOM elements to display
			var introEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(introEpisodes));
			var familyNationalityEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(familyNationalityEpisodes));
			var dateTimeEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(dateTimeEpisodes));
			var likesDislikesEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(likesDislikesEpisodes));
			var reviewEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(reviewEpisodes));
			var otherEpisodeList = this.generateDOMfromEpisodesArray(this.sortEpisodeArraybySequence(otherEpisodes));

		} else { scenes = "Nothing!"; }

		if (!this.state.teacherData) {
				return <div>Loading</div>
		} else {
			return (
				<body className="index">
					<div className="container-fluid">
						<h2 className="menuTitle">Episodes Available</h2>
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
      <script src="static/js/landingPage/jquery.min.js"></script>
      <script src="static/js/landingPage/jquery.dropotron.min.js"></script>
      <script src="static/js/landingPage/jquery.scrolly.min.js"></script>
      <script src="static/js/landingPage/jquery.scrollgress.min.js"></script>
      <script src="static/js/landingPage/skel.min.js"></script>
      <script src="static/js/landingPage/util.js"></script>
      <script src="static/js/landingPage/main.js"></script>

  </body>

			)
		}
	}
});

ReactDOM.render(<MainMenu />, document.getElementById('app'));