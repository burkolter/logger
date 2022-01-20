const path = require('path');

module.exports = {

    // bundling mode
    mode: 'production',

    // entry files
    entry: './src/index.ts',

    // source-map
    devtool: "source-map",

    // output bundles (location)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'logger.min.js',
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

    // dev-Server
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
};