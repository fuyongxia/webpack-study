
const path = require('path');
const proxy = require('./proxy.config').proxy;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: {
        index: './index.js',
        aa: './aa.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        environment: {
            arrowFunction: false
        }
    },
    // snapshot:{managedPaths:[]},//提出优化，从而支持监听node_modules文件的变化
    devServer: {
        contentBase: './public',//额外静态资源路径，非webpack打包输入的文件资源
        publicPath:'/',
        proxy,
        hot: true
    },
    devtool: 'eval-cheap-module-source-map',
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
           
            cacheGroups: {
                commons: {
                  test: /[\\/]node_modules[\\/]|[\\/]src[\\/]/,
                  // cacheGroupKey here is `commons` as the key of the cacheGroup
                  name:false,
                  chunks: 'all',
                  minChunks:2,
                },
              },

        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    "targets": {
                                        "ie": "11",
                                        "edge": "17",
                                        "firefox": "60",
                                        "chrome": "67",
                                        "safari": "11.1"
                                    },
                                    "useBuiltIns": "entry",
                                    "corejs": { version: 3 }
                                }
                            ],
                            '@babel/preset-react'
                        ]
                    }
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './index.html', filename: 'index.html',chunks:['index'] }),
        new HtmlWebpackPlugin({ template: './aa.html', filename: 'aa.html', chunks: ['aa'] }),
        new webpack.HotModuleReplacementPlugin()
    ],

};