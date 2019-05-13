const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 根据template生成html文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 对每次打包后的缓存文件进行删除确保每次都是最新的
const ExtractTextWebpackPligin = require('extract-text-webpack-plugin');
const PurifycssWebpack = require('purifycss-webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const glob = require('glob');

// 配置抽离css文件。目的是避免css文件和js文件混在一起。导致bundle.js文件过大，有可能导致加载时延过大。
const lessExtract = new ExtractTextWebpackPligin({
    filename: 'css/index.css',
});

module.exports = {
    entry: './src/index.js',  // 打包文件的入口
    output: {
        filename: 'bundle.[hash:8].js',
        // 注意这个位置必须是绝对路径
        path: path.join(__dirname, 'dist')
    }, // 打包后的出口文件配置
    devtool: 'inline-source-map', // 使用 source map
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // 自动
        port: 8000,
        compress: true, // 自动压缩
        open: true, // 自动打开浏览器
        hot: true
    }, // 开发服务器
    plugins: [
	    lessExtract,
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'webpack测试',
            hash: true,
            minify: {
                removeAttributeQuotes: true, // 去除双引号
                collapseWhitespace: true, // 合并代码到一行
            }
        }),
        new PurifycssWebpack({
            paths: glob.sync(path.resolve('src/*.html'))
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 每次修改代码在开发环境的时候会自动刷新页面
        new OptimizeCSSAssetsPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPligin.extract({
                    fallback: 'style-loader',
                    use: [
                        // { loader: 'style-loader' }, 配置抽离css文件时，注意这个地方要删除
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader'},
                    ]
                })
            },
            {
                test: /\.less$/,
                use: lessExtract.extract({
                  fallback: 'style-loader',
                  use: [
                    { loader: 'css-loader' }, 
                    { loader: 'less-loader' },
                  ]
                })
            }
        ]
    }, // 模块配置
    mode: 'development', // ['development', 'production']模式
    resolve: {
        extensions: ['.js', '.jsx']
    }, // 配置解析
}
