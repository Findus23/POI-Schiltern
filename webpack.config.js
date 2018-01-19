const path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
let SriPlugin = require('webpack-subresource-integrity');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'build-[hash].js',
        path: path.resolve(__dirname, 'dist'),
        crossOriginLoading: "anonymous"
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: 'Umgebungsplan Schiltern',
            template: 'index.ejs',
            devServer: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8081',
        }),
        new webpack.IgnorePlugin(/^jquery/),
        new LicenseWebpackPlugin({
            pattern: /^(MIT|ISC|BSD.*)$/,
            unacceptablePattern: /GPL/,
            abortOnUnacceptableLicense: true,
            perChunkOutput:false
        }),
        new SriPlugin({
            hashFuncNames: ['sha256'],
            enabled: process.env.NODE_ENV === 'production',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": {
                                        "browsers": [
                                            ">1% in AT"
                                        ]
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: (process.env.NODE_ENV === 'production' ? ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }) : [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ])
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader'
                ]
            },
            {
                test: /\.js$/, // include .js files
                enforce: "pre", // preload the jshint loader
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                use: [
                    {
                        loader: "jshint-loader"
                    }
                ]
            }
        ]
    }
};


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin("dist"),
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin("style-[hash].css"),
    ])
}
