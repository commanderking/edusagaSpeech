var React = require('react');

var HeaderContainer = React.createClass({
	render: function() {
		return (
			<div className="header">
				<div className="titleDiv">
					<p className="title">Food</p>
					<p className="type">Vocabulary</p>
				</div>
			</div>
		)
	}
});

module.exports = HeaderContainer;