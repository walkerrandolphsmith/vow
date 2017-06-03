var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var outputPath = path.resolve(__dirname, 'dist');
var entry = path.resolve(__dirname, 'src', 'index.js');

var nodeModules = fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .reduce((nodeModules, mod) => Object.assign({}, nodeModules, {[mod]: `commonjs ${mod}`}), {});

module.exports = {
    target: 'node',
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true
    },
    entry: entry,
    output: {
        path: outputPath,
        filename: 'index.js',
        library: 'vow',
        libraryTarget: 'umd'
    },
    externals: nodeModules,
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: [nodeModulesPath]
            }
        ]
    }
};