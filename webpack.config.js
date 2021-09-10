
const path = require('path');
const proxy = require('./proxy.config').proxy;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
        index: './index.js',
        aa: './aa.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        environment: {
            arrowFunction: false
        }
    },
    // snapshot:{managedPaths:[]},//剔除覆盖原来的优化，从而支持监听node_modules文件的变化
    devServer: {
        contentBase: './public',//额外静态资源路径，非webpack打包输出的文件资源
        publicPath: '/',
        proxy,
        hot: true,
        // open:true
    },
    devtool: 'eval-cheap-module-source-map',
    optimization: {
        runtimeChunk: "single",
        splitChunks: {

            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]|[\\/]src[\\/]/,
                    //   name:false,//设为 false 将保持 chunk 的相同名称
                    name: 'verdor',//会将所有常见模块和 vendor 合并为一个 chunk
                    chunks: 'all',
                    //   minChunks:2,
                },
            },

        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    "targets": "> 0.01%, not dead",
                                    "useBuiltIns": "usage",
                                    "corejs": { version: 3 }
                                }
                            ],
                            '@babel/preset-react'
                        ]
                    }
                }
            },

            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,//在css-loader工作的过程中，如果遇到.css文件则回退给它的上一个loader进入处理流程（1代表回退一个，2代表回退俩个）
                            esModule: false,
                        }

                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            // sourceMap: true,
                            modules: {
                                auto: (resourcePath) => {
                                    console.log(resourcePath, 'resourcePath')
                                    if (resourcePath.includes('antd.css')) {
                                        return false
                                    }
                                    return true
                                },
                                localIdentName: "[local]___[hash:base64:5]"
                            },
                            esModule: false,
                            importLoaders: 1//这个配置的作用为了防止less文件中使用@import引入一个css文件，如果引入的是less文件，则不需要该处理，原因在于less-loader对@import(.css|.less)处理的不同

                        }
                    },
                    'postcss-loader',
                    {
                        loader: "less-loader"
                    }
                ]
            },
            // {
            //     test: /\.(jpg|png)$/i,
            //     use: [
            //         {
            //             loader:'url-loader',
            //             options:{
            //                 limit: 20*1024,
            //                 // esModule: false,
            //                 name:`static/[name]-[hash:8].[ext]`,
            //                 // outputPath:'static'
            //             }
            //     }

            //     ],

            // },
            {
                test: /\.(jpg|png)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 20 * 1024 // 20kb
                    }
                },
                generator: {
                    filename: 'img/[name]-[hash:8][ext]'
                }

            },
            {
                test: /\.(ttc|ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[name]-[hash:8][ext]'
                }
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './public/index.html', filename: 'index.html', chunks: ['index'] }),
        // new HtmlWebpackPlugin({ template: './aa.html', filename: 'aa.html', chunks: ['aa'] }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: ["**/index.html"],
                      },
                }
            ]

        })
    ],


};