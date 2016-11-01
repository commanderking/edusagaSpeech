var React = require('react')
var PropTypes = React.PropTypes;


var PracticeMic = React.createClass({
	render: function() {
		var className = "btn btn-info micWrap micActive-" + this.props.micActive;
		var micFunction;
		if (this.props.micActive) {
			micFunction = this.props.onMicDeactivate;
		} else {
			micFunction = this.props.onMicActivate;
		}
		return (
			<div className="micDiv">
				<button id="mic" className={className} onClick={micFunction}>
					<span className='icon-mic'></span>
				</button>
			</div>		
		)
	}
});

module.exports = PracticeMic;