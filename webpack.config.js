var webpack = require('webpack');
var path = require('path');
var projectName = 'Chart';
var outputFile = 'chart.common.js';

var config = {
    entry: './src/chart.common.js',
    devtool: 'source-map',
    output: {
        path: __dirname+ '/dist',
        filename: outputFile,
        library: projectName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                },
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    plugins: [
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
