var React = require('react');
var ReactDOM = require('react-dom');
var ReactTransitionGroup = require('react-addons-transition-group');
var MyBox = React.createClass({
    show: function(callback){
        var node = ReactDOM.findDOMNode(this);
        TweenMax.fromTo(node, 2, { width: 100, height: 100, backgroundColor: '#0cc', scale: 0.2, opacity: 0, rotation: -180 }, { width: 100, height: 100, backgroundColor: '#0cc', scale: 1, opacity: 1, rotation: 0, ease: Expo.easeInOut, onComplete: callback, onCompleteScope: this });
    },
    hide: function(callback){
        var node = ReactDOM.findDOMNode(this);
        TweenMax.to(node, 2, { width: 100, height: 100, backgroundColor: '#cc0', scale: 0.2, opacity: 0, ease: Expo.easeInOut, onComplete: callback, onCompleteScope: this });
    },
    componentWillAppear: function(didAppearCallback){
        console.log('MyBox.componentWillAppear');
        this.show(didAppearCallback);
    },
    componentDidAppear: function(){
        console.log('MyBox.componentDidAppear');
    },
    componentWillEnter: function(didEnterCallback){
        console.log('MyBox.componentWillEnter');
        this.show(didEnterCallback);
    },
    componentDidEnter: function(){
        console.log('MyBox.componentDidEnter');
    },
    componentWillLeave: function(didLeaveCallback){
        console.log('MyBox.componentWillLeave');
        this.hide(didLeaveCallback);
    },
    componentDidLeave: function(){
        console.log('MyBox.componentDidLeave');
    },
    componentDidMount: function() {
        console.log('MyBox.componentDidMount');
    },
    componentWillUnmount: function() {
        console.log('MyBox.componentWillUnmount');
    },
    render: function(){
        return <div>&nbsp;</div>;
    }
});
var TransitionContainer = React.createClass({
    getInitialState: function(){
        return { isShowing: false };
    },
    onButtonClicked: function(){
        this.setState({ isShowing: !this.state.isShowing });
    },
    render: function(){
        var myBox = this.state.isShowing ? <MyBox key="myBox" /> : '';
        return (
            <div id="container">
                <MyButton onButtonClicked={this.onButtonClicked} />
                <ReactTransitionGroup transitionName="hellotransition">
                    {myBox}
                </ReactTransitionGroup>
            </div>
        );
    }
});
var MyButton = React.createClass({
    render: function(){
        return <button onClick={this.props.onButtonClicked}>Click Me</button>;
    }
});

module.exports = TransitionContainer;
