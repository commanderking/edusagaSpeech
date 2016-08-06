var React = require('react');
var SpeechableSpan = require('./components/SpeechableSpan');

var FeedbackContainer = React.createClass({
	getInitialState: function() {
		return { hintClickDisable: false }
	},
	handleHintAudioClick: function() {
		that = this;

		// Disable clicking on hint to play voice
		this.setState({ hintClickDisable: true })

		// PLay audio from hint
		this.props.onHintAudio(this.props.hintText);

		// Disable clicking on hint for some time before re-enabling
		setTimeout(function(){
			that.setState({
				hintClickDisable: false
			})
		}, 1000)
	},
	render: function() {
		// Show Hint when hints are active
		// Change Miri's icon depending on type of hint/feedback
		var hintDivClass;
		var miriIconSrc;
		if (this.props.hintActive === true) {
			hintDivClass = "hintDiv"
			miriIconSrc ="/static/images/miri/icons/Miri_Icon_Oh.png"
		} else {
			hintDivClass = "hintDiv hidden"
			miriIconSrc = "/static/images/miri/icons/Miri_Icon_default.png"
		}

		// Assign function to play span's words with speechsynth
		var spanClickFunction = this.state.hintClickDisable ? null : this.handleHintAudioClick;
		return (
			<div className ="bottomNavBar">
				<div className="row-fluid">
					<div className="buttonLine">
						<div className="coinDiv">
							<img className="coinIcon" src="/static/images/UI/Icon_coins-01.png" />
							<div className="coinCount">200</div>
						</div>
						<p className="locationText">Classroom 教室</p>
						<div className={hintDivClass}>
							<div className="payHintContainer">
								<img className="hintIconImage payHintBg" src="static/images/UI/ICON_payforhelp_bg-01.png" />
								<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_qmark-01.png" />
								<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_Big_sparkle-01.png" />
								<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_L_spark-01.png" />
								<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_R_sparkle-01.png" />
							</div>
							<p className="hintText">Maybe you could say... 
								<SpeechableSpan 
									clickFunction={spanClickFunction}
									hintText={this.props.hintText}/>
							</p>
						</div>
						<img className="miriIcon" src={miriIconSrc} />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FeedbackContainer;	