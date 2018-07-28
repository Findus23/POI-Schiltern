const path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
let SriPlugin = require('webpack-subresource-integrity');
let CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    mode: process.env.NODE_ENV,
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
            perChunkOutput: false
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
                            ],
                        ],
                        "plugins": ["syntax-dynamic-import"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: (process.env.NODE_ENV === 'production' ? [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader"
                ] : [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ])
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader'
                ]
            }
        ]
    }
};


if (process.env.NODE_ENV === 'production') {
    module.exports.optimization = {
        splitChunks: {
            name: "commons"
        },
        minimize: true
    };
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
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ])
}
