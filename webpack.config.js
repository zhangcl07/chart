var webpack = require('webpack');
var path = require('path');
var projectName = 'Chart';
var fileName = 'chart.common';
var outputFile = 'chart.common.js';

var config = {
    entry: {
        [fileName]: './src/chart.common.js',
        line: './examples/line.js',
        main: './examples/main.js'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js",
        library: projectName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
    // ,
    // resolve: {
    //     root: path.resolve(__dirname, 'src'),
    //     extensions: ['', '.js']
    // }
};

module.exports = config;
