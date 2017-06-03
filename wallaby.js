module.exports = function(wallaby) {
    var packageConfig;
    var specFilePattern;
    var srcFilePattern;
    var babelProcessor;
    var wallabyWebpack = require('wallaby-webpack');

    var wallabyPostprocessor = wallabyWebpack({});

    packageConfig = require('./package.json');
    specFilePattern = 'src/**/*.spec.js';
    srcFilePattern = 'src/**/*.js';

    babelProcessor = wallaby.compilers.babel(packageConfig.babel);

    return {
        testFramework: 'mocha',
        debug: true,
        workers: {
            initial: 12,
            regular: 12
        },
        files: [
            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false },
            { pattern: srcFilePattern, load: false },
            { pattern: specFilePattern, ignore: true }
        ],
        tests: [
            { pattern: specFilePattern, load: false }
        ],
        compilers: {
            '**/*.js': babelProcessor
        },
        postprocessor: wallabyPostprocessor,
        bootstrap: function() {
            chai.should();
            wallaby.testFramework.ui('tdd');
            window.__moduleBundler.loadTests();
        }
    };
};