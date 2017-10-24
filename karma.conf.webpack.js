module.exports = function(config) {

    var karmaConf = require('./karma.conf');

    var webpackConfig = {

        devtool: 'inline-source-map',
        target: 'web',

        externals: ['sinon', 'chai', 'sinon-chai'], // already provided by Karma

        output: {
            library: ['RingCentral', 'SDK'],
            libraryTarget: 'umd',
            path: __dirname + '/build',
            publicPath: '/build/',
            sourcePrefix: '',
            filename: "[name].js",
            chunkFilename: "[id].chunk.js"
        },

        node: {
            http: false,
            Buffer: false,
            process: false,
            timers: false
        }
    };

    karmaConf(config);

    config.set({

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },

        files: [
            require.resolve('whatwg-fetch/fetch'), //FIXME We need to add it manually for fetch-mock
            './src/test/env.js'
        ].concat(karmaConf.specs),

        preprocessors: {
            './src/test/env.js': ['webpack', 'sourcemap']
        },

        plugins: config.plugins.concat([
            'karma-sourcemap-loader',
            'karma-webpack'
        ]),

        reporters: ['mocha'],
        browsers: ['PhantomJS']

    });

};
