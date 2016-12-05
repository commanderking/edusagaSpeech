var React = require('react')
var PropTypes = React.PropTypes;
var PracticeMic = require('./PracticeMic');
var PracticeDoneButton = require('./PracticeDoneButton');
var PracticeAudioButton = require('./PracticeAudioButton');
var ShowPinyinButton = require('./ShowPinyinButton');

function PracticeFooter (props) {
	// Displays mic when user has yet to answer correctly
	// Displays "check" when user already answered vocab correctly
	var micOrCheck = props.currentWordObject.correct ? 
			<div className="btn-continue-wrapper">
				<button 
					className="btn btn-success btn-lg btn-continue"
					onClick={props.nextVocab}>
					<span 
						className="glyphicon glyphicon-ok" 
						aria-hidden="true">
					</span> 
					Next
				</button>
			</div> : 
			<PracticeMic 
				micActive={props.micActive}
				onMicActivate={props.onMicActivate}
				onMicDeactivate={props.onMicDeactivate}/> 

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
				{micOrCheck}
				<ShowPinyinButton 
					changePinyinDisplay={props.changePinyinDisplay}
					showPinyin={props.showPinyin}/>
				<div className="rightArrow arrow" onClick={props.nextVocab}>
					<span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
				</div>
			</div>
			<PracticeDoneButton 
				changePracticeMode={props.changePracticeMode}
				currentAnswerCorrect={props.currentWordObject.correct}/>
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