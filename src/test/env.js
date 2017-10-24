/**
 * This file provides global environment for NodeJS/Webpack tests
 */

require("es6-promise").polyfill();

global.chai = require("chai");
global.sinon = require("sinon");
global.fetchMock = require("fetch-mock");
global.RingCentral = {SDK: require("../SDK")};

require('./test');

console.log('Node test env was set up');