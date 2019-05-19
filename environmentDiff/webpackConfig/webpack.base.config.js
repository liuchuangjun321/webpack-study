const path = require("path");
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');  // 对每次打包后的缓存文件进行删除确保每次都是最新的
const HtmlWebpackPlugin = require('html-webpack-plugin');  // 生成html文件
const ExtractTextWebpackPligin = require('extract-text-webpack-plugin');  // 配置抽离css文件。目的是避免css文件和js文件混在一起。导致bundle.js文件过大，有可能导致加载时延过大。
const PurifycssWebpack = require('purifycss-webpack');  // 消除冗余的css代码
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');  // 主要用来优化css文件的输出，默认使用cssnano，其优化策略主要包括：摈弃重复的样式定义、砍掉样式规则中多余的参数、移除不需要的浏览器前缀等。

const lessExtract = new ExtractTextWebpackPligin({
	filename: 'css/index.css',
	disable: process.env.NODE_ENV === "development"
});

const config = require('./config.js');

module.exports = {
	context: config.rootPath,
	entry: {
		pageA: "./src/pageA", // 引用utility1.js  utility2.js
		pageB: "./src/pageB", // 引用utility2.js  utility3.js
		pageC: "./src/pageC", // 引用utility2.js  utility3.js,
	},
	plugins: [
		lessExtract,
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'webpack测试',
			hash: true,
			filename: 'pageA.html',
			chunks: ['pageA'],
			minify: process.env.NODE_ENV === "development" ? false : {
				removeAttributeQuotes: true, // 去除双引号
				collapseWhitespace: true, // 合并代码到一行
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'webpack测试',
			hash: true,
			filename: 'pageB.html',
			chunks: ['pageB'],
			minify: process.env.NODE_ENV === "development" ? false : {
				removeAttributeQuotes: true, // 去除双引号
				collapseWhitespace: true, // 合并代码到一行
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'webpack测试',
			hash: true,
			filename: 'pageC.html',
			chunks: ['pageC'],
			minify: process.env.NODE_ENV === "development" ? false : {
				removeAttributeQuotes: true, // 去除双引号
				collapseWhitespace: true, // 合并代码到一行
			}
		}),
		new PurifycssWebpack({
			paths: glob.sync(path.resolve('src/*.html'))
		}),
		new CleanWebpackPlugin(),
		new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessorOptions: {
                safe: true,
                autoprefixer: { disable: true },
                mergeLonghand: false,
                discardComments: {
                    removeAll: true // 移除注释
                }
            },
            canPrint: true
        })
	],
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				commons: {
					chunks: "initial",
					minChunks: 2,
					name: "commons",
					maxInitialRequests: 5,
					minSize: 0, // 默认是30kb,
					priority: 2,
				},
				reactBase: {
					test: (module) => {
						return /react|redux|prop-types/.test(module.context);
					}, // 直接使用 test 来做路径匹配
					chunks: "initial",
					name: "reactBase",
					priority: 10,
				}
			}
		},
		runtimeChunk: {
			name: "manifest"
		}
	},
	module: {
        rules: [
        {
            test: /\.css$/,
			use: process.env.NODE_ENV === "development"
			? ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
			: lessExtract.extract({
                fallback: 'style-loader',
                use: [
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader'},
                ]
            }),
            exclude: /node_modules/
        },
        {
            test: /\.less$/,
			// 三个loader的顺序不能变
			// 不分离的写法
			// use: ["style-loader", "css-loader", "less-loader"]
			// 区别开发环境和生成环境
			use: process.env.NODE_ENV === "development"
				?	["style-loader", "css-loader", "less-loader"]
				: 	lessExtract.extract({
					fallback: 'style-loader',
					use: [
						{ loader: 'css-loader' }, 
						{ loader: 'less-loader' },
					]
				})
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: 'images/[name].[ext]'
                }
            }]
        }]
    }, // 模块配置
    resolve: {
        extensions: ['.js', '.jsx']
    }, // 配置解析
};
