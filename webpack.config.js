const path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js?hash=[hash]',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
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
            abortOnUnacceptableLicense: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
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
    ,
}
;


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
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

    ])
}