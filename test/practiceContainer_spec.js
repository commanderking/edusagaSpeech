/*

import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import QuestionAsker from '../react_assets/js/questionAsker.js';

import jsdom from 'jsdom'
const document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = document
global.window = document.defaultView

describe ('<QuestionAsker />', () => {
	it ('calls componentDidMount', () => {
		// expect(shallow(<Foo />).contains(<div className="foo" />)).to.equal(true);
		console.log(shallow(<QuestionAsker />));
		expect(shallow(<QuestionAsker />).contains(<div className="gameWrapper col-md-12 col-sm-12 col-xs-12" />)).to.equal(true);
	})
})
*/