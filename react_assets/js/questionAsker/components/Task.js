var React = require('react')
var PropTypes = React.PropTypes;

var Task = React.createClass({

	render: function() {
		var hintClassName;
		var taskDivClass;
		if (this.props.hintActive === true && this.props.index === this.props.currentHintIndex) {
			hintDiv = <a 
						className='taskHelpIcon taskHelpActive glyphicon glyphicon-question-sign'
						onClick={this.props.onDisableHint}></a>;
			taskDivClass = 'taskDiv taskDivActive';
		} else if (this.props.hintActive === true && this.props.index !== this.props.currentHintIndex) {
			hintDiv = <a 
						className='taskHelpIcon taskHelpDisabled glyphicon glyphicon-question-sign'
						onClick={this.props.onDisableHint}></a>;
			taskDivClass = 'taskDiv taskDivDisabled';
		}
		else {
			hintDiv = <a 
						className='taskHelpIcon taskHelpInactive glyphicon glyphicon-question-sign'
						onClick={ () => this.props.onHintClick(this.props.index) }>
					</a>
			taskDivClass = 'taskDiv';
		}

		return (
			<li className='inactiveLink' role='presentation' data-index={this.props.index}>
				<div className={taskDivClass} data-index={this.props.index}>
					<span className='icon-mic'></span>
					<div 
						className="taskText" 
						data-index={this.props.index} 
						onClick={ () => this.props.onSpeechInput(this.props.index) }>
							{this.props.taskName}
					</div>
					{hintDiv}
				</div>
			</li>
		)
	}
});

module.exports = Task;