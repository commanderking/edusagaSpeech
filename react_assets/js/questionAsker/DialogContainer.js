var React = require('react');
var PropTypes = React.PropTypes;
var Constants = require('../helpers/Constants');
var NextButton = require('./components/NextButton');
var RewindButton = require('./components/RewindButton');
var PracticeStartButton = require('./components/PracticeStartButton');

//TODO: The dialog's name and text should be their own component

var DialogContainer = React.createClass({
	render: function() {
		var dialogSlantSrc = Constants.IMAGE_PATH + "UI/dialogbox_slant.png" 
		var textNameWrapper;
		var characterName;
		var characterNameClass = "characterNameDiv";
		var characterTextResponse;
		var characterTextClass = "characterTextResponse";
		var dialogDivClass = "characterDialogueDiv col-md-12 col-sm-12 col-xs-12";
		var button = null;
		var repeatButton = null;

		// If it's assessment mode and there are no scenarios to show, no dialog is shown 
		if (this.props.assessmentMode && this.props.scenarioOn === false) {
			return null;
		} else {
			// Case 1: There's a scenario that's played; Change font size of text and get name from scenario
			var that = this;
			var currentScenarioData = this.props.currentScenarioData;
			if (this.props.scenarioOn === true) {
				characterName = currentScenarioData.name;

				// If there's a link, split the text (only works with one link) and then render;
				if (currentScenarioData.link) {
					var parsedResponseArray = currentScenarioData.text.split("[[link]]");
					var linkText = currentScenarioData.link.text;
					var linkURL = currentScenarioData.link.url;
					console.log(parsedResponseArray);
					characterTextResponse = 
					(<p className="scenarioText">
							{parsedResponseArray[0]} <a href={linkURL} target="_blank">{linkText}</a> {parsedResponseArray[1]}
						</p>)
				} else {
					characterTextResponse = 
					(<p className="scenarioText"> 
						{this.props.scenarioData[this.props.scenarioIndex].text}
					</p>)
				}

				// Play sound for scenario if exists
				if (this.props.scenarioData[this.props.scenarioIndex].soundID) {
					setTimeout(function() { 
						that.props.playSound(that.props.scenarioData[that.props.scenarioIndex].soundID);
					}, 500);
				}

			// Case 2: Hint's active; Name, Text should fade color and the div should invert colors
			} else if(this.props.hintActive === true) {
				dialogDivClass = "characterDialogueDiv dialogDivInverted col-md-12 col-sm-12 col-xs-12";
				characterName = this.props.charName;
				characterTextResponse = this.props.currentDialog;
				characterNameClass += " characterNameDivDisabled";
				characterTextClass += " characterTextResponseDisabled";
			}
			// Case 3: Default case - show the text given the current task
			else {
				characterName = this.props.charName;
				characterTextResponse = this.props.currentDialog;
			}

			// If sceneComplete, hide certain elements
			if (this.props.sceneComplete) {
				characterName = "";
				characterTextResponse = "";
			}
			return (
				<div className={dialogDivClass}>
					<img className="dialogSlantPiece" src={dialogSlantSrc}/>
					<div className="responseNameWrapper col-md-8 col-sm-8 col-xs-8">
						<div className={characterNameClass}>
							{characterName}
						</div>
						<div className={characterTextClass}>
							{characterTextResponse}
						</div>
					</div>
					<PracticeStartButton
						changePracticeMode={this.props.changePracticeMode} 
						practiceAvailable = {this.props.practiceAvailable}/>
					<NextButton
						nextScenario={this.props.nextScenario}
						scenarioOn={this.props.scenarioOn} />
					<RewindButton 
						scenarioData={this.props.scenarioData}
						scenarioIndex={this.props.scenarioIndex}
						nextScenario={this.props.nextScenario}
						scenarioData={this.props.scenarioData}
						scenarioIndex={this.props.scenarioIndex} 
						scenarioOn = {this.props.scenarioOn} 
						setRewindScenarioSound = {this.props.setRewindScenarioSound}
						playRewindScenarioSound = {this.props.playRewindScenarioSound}
						currentRewindSoundID={this.props.currentRewindSoundID}/>
				</div>
			)

		}
	}
});

DialogContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	scenarioData: PropTypes.array.isRequired,
	scenarioIndex: PropTypes.number.isRequired,
	playSound: PropTypes.func.isRequired,
	charName: PropTypes.string.isRequired,
	hintActive: PropTypes.bool.isRequired,
	onRepeat: PropTypes.func.isRequired,
	nextScenario: PropTypes.func.isRequired,
	assessmentMode: PropTypes.bool.isRequired,
	changePracticeMode: PropTypes.func.isRequired,
	practiceAvailable: PropTypes.bool.isRequired,
	turnOffPracticeOption: PropTypes.func.isRequired
}

module.exports = DialogContainer;	