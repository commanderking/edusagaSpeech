var React = require('react')
var PropTypes = React.PropTypes;
var PracticeMic = require('./PracticeMic');
var PracticeDoneButton = require('./PracticeDoneButton');

function PracticeFooter (props) {
	return (
		<div className="practiceFooter">
			<PracticeMic 
				micActive={props.micActive}
				onMicActivate={props.handleMicActivate}
				onMicDeactivate={props.handleMicDeactivate}/>
			<PracticeDoneButton />
       	</div>
	)
}

module.exports = PracticeFooter;

PracticeFooter.propTypes = {
	micActive: PropTypes.bool.isRequired,
	onMicActivate: PropTypes.func.isRequired,
	onMicDeactivate: PropTypes.func.isRequired

}