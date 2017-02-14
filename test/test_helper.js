import jsdom from 'jsdom';
import jquery from 'jquery';
import TestUtils from 'react-addons-test-utils';
import ReactDom from 'react-dom';
import { expect } from 'chai';
import React from 'react';

// Set up testing environment to run like a browser in the command line

// global takes the place of window (html) in node.js to mimic browser
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

// Hacky jquery - don't use DOM window, use jsdom window
const $ = jquery(global.window);

// build 'renderComponent' helper that should render a given react class
function renderComponent(ComponentClass) {
  const componentInstance = TestUtils.renderIntoDocument(<ComponentClass />);

  // wrap in jquery to get acces to jquery-chai testing
  return $(ReactDOM.findDOMNode(componentInstance)); // produces HTML
}

export { renderComponent, expect };
