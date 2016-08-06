var React = require('react');
var PropTypes = React.PropTypes;

var DialogContainer = React.createClass({
	render: function() {
		var textNameWrapper;
		if (this.props.scenarioOn === true) {
			textNameWrapper = 
			(
				<div className="responseNameWrapper col-md-8 col-sm-8 col-xs-8">
					<div className="characterNameDiv">
						{this.props.scenarioData[this.props.scenarioIndex].name}
					</div>
					<div className="characterTextResponse">
						<p className="scenarioText"> 
							{this.props.scenarioData[this.props.scenarioIndex].text}
						</p>
					</div>
				</div>
			) 
		} else if(this.props.hintActive === true) {
			textNameWrapper = 
			(
				<div className="responseNameWrapper col-md-8 col-sm-8 col-xs-8">
					<div className="characterNameDiv characterNameDivDisabled">
						{this.props.charName}
					</div>
					<div className="characterTextResponse characterTextResponseDisabled">
						{this.props.currentDialog}
					</div>
				</div>
			)
		}
		else {
			textNameWrapper = 
			(
				<div className="responseNameWrapper col-md-8 col-sm-8 col-xs-8">
					<div className="characterNameDiv">
						{this.props.charName}
					</div>
					<div className="characterTextResponse">
						{this.props.currentDialog}
					</div>
				</div>
			)
		}


		var dialogDivClass;
		if (this.props.hintActive === true) {
			dialogDivClass = "characterDialogueDiv dialogDivInverted col-md-12 col-sm-12 col-xs-12";
		} else {
			dialogDivClass = "characterDialogueDiv col-md-12 col-sm-12 col-xs-12";
		}
		return (
			<div className={dialogDivClass}>
				<img className="dialogSlantPiece" src="static/images/UI/dialogbox_slant.png" />
				{textNameWrapper}
			</div>
		)
	}
});

DialogContainer.propTypes = {
	scenarioOn: PropTypes.bool.isRequired,
	scenarioData: PropTypes.array.isRequired,
	scenarioIndex: PropTypes.number.isRequired,
	charName: PropTypes.string.isRequired
}

module.exports = DialogContainer;	