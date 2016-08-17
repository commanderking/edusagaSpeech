var React = require('react');
var PropTypes = React.PropTypes;

//TODO: The dialog's name and text should be their own component

var DialogContainer = React.createClass({
	render: function() {
		var textNameWrapper;
		var characterName;
		var characterNameClass = "characterNameDiv";
		var characterTextResponse;
		var characterTextClass = "characterTextResponse";
		var dialogDivClass = "characterDialogueDiv col-md-12 col-sm-12 col-xs-12";

		// Case 1: There's a scenario that's played; Change font size of text and get name from scenario
		if (this.props.scenarioOn === true) {
			characterName = this.props.scenarioData[this.props.scenarioIndex].name;
			characterTextResponse = 
			(
				<p className="scenarioText"> 
					{this.props.scenarioData[this.props.scenarioIndex].text}
				</p>
			)
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

		return (
			<div className={dialogDivClass}>
				<img className="dialogSlantPiece" src="static/images/UI/dialogbox_slant.png" />
				<div className="responseNameWrapper col-md-8 col-sm-8 col-xs-8">
					<div className={characterNameClass}>
						{characterName}
					</div>
					<div className={characterTextClass}
						onClick={this.props.onRepeat}>
						{characterTextResponse}
					</div>
				</div>
			</div>
		)
	}
});

DialogContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	scenarioData: PropTypes.array.isRequired,
	scenarioIndex: PropTypes.number.isRequired,
	charName: PropTypes.string.isRequired,
	hintActive: PropTypes.bool.isRequired,
	onRepeat: PropTypes.func.isRequired
}

module.exports = DialogContainer;	