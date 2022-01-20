const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {

    // bundling mode
    mode: 'production',

    // entry files
    entry: {
        "logger": './src/index.ts',
        "logger.min": './src/index.ts'
    },

    // source-map
    devtool: "source-map",

    // output bundles (location)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'logger',
        libraryTarget: 'global'
    },

    // file resolutions
    resolve: {
        extensions: ['.ts', '.js'],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min.m?js(\?.*)?$/i
            })
        ]
    },

    // dev-Server
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
};