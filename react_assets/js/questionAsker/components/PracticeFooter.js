var React = require('react')
var PropTypes = React.PropTypes;
var PracticeMic = require('./PracticeMic');
var PracticeDoneButton = require('./PracticeDoneButton');
var PracticeAudioButton = require('./PracticeAudioButton');
var ShowPinyinButton = require('./ShowPinyinButton');

function PracticeFooter (props) {
	return (
		<div className="practiceFooter">
			<div className="practiceButtonsWrapper">

				<div className="leftArrow arrow" onClick={props.previousVocab}>
					<span className="glyphicon glyphicon glyphicon-triangle-left" aria-hidden="true"></span>
				</div>
				<PracticeAudioButton 
					playSpeechSynth={props.playSpeechSynth}
					currentWord={props.currentWordObject.answer}
					speechSynthPlaying={props.speechSynthPlaying}/>
				<PracticeMic 
					micActive={props.micActive}
					onMicActivate={props.onMicActivate}
					onMicDeactivate={props.onMicDeactivate}/>
				<ShowPinyinButton 
					changePinyinDisplay={props.changePinyinDisplay}
					showPinyin={props.showPinyin}/>
				<div className="rightArrow arrow" onClick={props.nextVocab}>
					<span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
				</div>
			</div>
			<PracticeDoneButton 
				changePracticeMode={props.changePracticeMode}/>
       	</div>
	)
}

module.exports = PracticeFooter;

PracticeFooter.propTypes = {
	micActive: PropTypes.bool.isRequired,
	onMicActivate: PropTypes.func.isRequired,
	onMicDeactivate: PropTypes.func.isRequired,
	changePracticeMode: PropTypes.func.isRequired,
	playSpeechSynth: PropTypes.func.isRequired,
	currentWordObject: PropTypes.object.isRequired,
	changePinyinDisplay: PropTypes.func.isRequired,
	showPinyin: PropTypes.bool.isRequired,
	previousVocab: PropTypes.func.isRequired,
	nextVocab: PropTypes.func.isRequired,
	speechSynthPlaying: PropTypes.bool.isRequired

}