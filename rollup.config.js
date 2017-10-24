var json = require('rollup-plugin-json');
var virtual = require('rollup-plugin-virtual');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');
var builtins = require('rollup-plugin-node-builtins');

module.exports = {
    input: 'src/SDK.js',
    output: {
        file: 'build/ringcentral.js',
        format: 'umd',
        name: 'RingCentral.SDK',
        sourcemap: true
    },
    plugins: [
        json(),
        virtual({
            'x-package.json': 'module.exports = ' + JSON.stringify({
                version: require('./package.json').version
            })
        }),
        commonjs(), // support of commonjs modules
        builtins(), // adds qs and events
        resolve() // adds object-assign and is-plain-object
    ],
    external: [
        'es6-promise',
        'fetch-ponyfill',
        'pubnub'
    ],
    globals: {
        // we intentionally disable this in order to use globals resolver at SDK level
        'pubnub': 'disabled-PubNub',
        'es6-promise': 'disabled-Promise',
        'fetch-ponyfill': 'disabled-fetch'
    }
};