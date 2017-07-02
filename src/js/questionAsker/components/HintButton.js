var React = require('react');
var PropTypes = React.PropTypes;


var HintButton = React.createClass({
	render: function() {
		if (this.props.assessmentMode || this.props.taskType === "multipleChoice") {
			return null;
		} else {
			// Handling how to display each hint when hint is active or inactive
			if (this.props.hintActive) {
				if (this.props.index === this.props.currentHintIndex) {
					return (<a className='taskHelpIcon taskHelpActive glyphicon glyphicon-question-sign'
								onClick={this.props.onDisableHint}></a>);
				} 
				// If hint's active, but this is not the task for which a hint is requested, disable it
				else {
					return (<a className='taskHelpIcon taskHelpDisabled glyphicon glyphicon-question-sign'
								onClick={this.props.onDisableHint}></a>);
				}
			}
			// Display the normal taskDiv
			else {
				return(<a className='taskHelpIcon taskHelpInactive glyphicon glyphicon-question-sign'
							onClick={ () => this.props.onHintClick(this.props.index) }>
						</a>)
			}
		}
	}
});

HintButton.propTypes = {
	assessmentMode: PropTypes.bool.isRequired,
	hintActive: PropTypes.bool.isRequired,
	currentHintIndex: PropTypes.number.isRequired,
	onDisableHint: PropTypes.func.isRequired,
	onHintClick: PropTypes.func.isRequired
}


module.exports = HintButton;