const webpack = require('webpack');
const path = require("path");
const webpackConfigBase = require('./webpack.base.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require("webpack-merge");
// const ExtractTextWebpackPligin = require('extract-text-webpack-plugin');

const config = require('./config.js');
// const lessExtract = new ExtractTextWebpackPligin({
// 	filename: 'css/index.css',
// });

const webpackConfigProd = {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		filename: "./js/[name].[chunkhash:8].bundle.js",
		publicPath: config.publicPath
	},
	devtool: 'cheap-module-eval-source-map',
	externals: [
		'react',
		'react-dom',
		'redux',
		'react-redux',
		'react-router-dom',
		'antd',
		'moment',
		'core-js',
		'lodash',
		'prop-types',
	].reduce(
		(prev, item) => ({
			...prev,
			[item]: {
				commonjs: item
			}
		}),
		{}
	),
	plugins: [
		// 官方文档推荐使用下面的插件确保 NODE_ENV
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		// 启动 minify
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new CopyWebpackPlugin([ // copy custom static assets
			{
				from: config.srcPath + '/static',
				to: config.outputPath,
				ignore: ['.*']
			}
		]),
	]
}

module.exports = merge(webpackConfigBase, webpackConfigProd);
