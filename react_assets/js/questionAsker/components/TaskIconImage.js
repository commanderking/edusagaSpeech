var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;

var TaskIconImage = React.createClass({
	show: function(callback) {
		var node = ReactDOM.findDOMNode(this);
		console.log(callback);
	},
	componentWillEnter: function(callback) {
		console.log("Component Entered");
		callback();
	},
	componentWillLeave: function(callback) {
		callback();
	},
	componentDidMount: function() {
		console.log("Component Mounted");
		var node = ReactDOM.findDOMNode(this);
		this.props.imageTransition(node, this);
		console.log(node);

	},
	componentWillUnmount: function() {
		console.log("Component unmounted");
	},
	render: function() {
		return <img key={this.props.keyToAttach} className="" src={this.props.imageSrc} />
	}

});

module.exports = TaskIconImage;
