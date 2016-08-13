var React = require('react');

var HintIcon = React.createClass({

	render: function() {
		var hintIconDiv;
		if (this.props.hintActive) {
			hintIconDiv = (
				<div>
					<img className="hintIconImage payHintBg" src="static/images/UI/ICON_payforhelp_bg-01.png" />
					<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_qmark-01.png" />
					<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_Big_sparkle-01.png" />
					<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_L_spark-01.png" />
					<img className="hintIconImage" src="static/images/UI/ICON_payforhelp_R_sparkle-01.png" />
				</div>
			)
		} else if (this.props.answerFeedbackActive) {
			hintIconDiv = (<div>
				<div className="addSuggestionDiv">
					<span>+</span>
				</div>
				<img className="hintIconImage payHintBg" src="static/images/UI/Icon_Star-01.png" />
			</div>)	
		}


		return (
			<div className="hintIcon">
				{hintIconDiv}
			</div>
		)
	}
});

module.exports = HintIcon;