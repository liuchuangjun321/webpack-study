const path = require("path");
const webpack = require('webpack');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 对每次打包后的缓存文件进行删除确保每次都是最新的
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPligin = require('extract-text-webpack-plugin');
const PurifycssWebpack = require('purifycss-webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 配置抽离css文件。目的是避免css文件和js文件混在一起。导致bundle.js文件过大，有可能导致加载时延过大。
const lessExtract = new ExtractTextWebpackPligin({
  filename: 'css/index.css',
});

module.exports = {
  // mode: "development" || "production",
  entry: {
    pageA: "./src/pageA", // 引用utility1.js  utility2.js
    pageB: "./src/pageB", // 引用utility2.js  utility3.js
    pageC: "./src/pageC",  // 引用utility2.js  utility3.js,
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].bundle.js"
  },
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
    new webpack.HotModuleReplacementPlugin(), // 每次修改代码在开发环境的时候会自动刷新页面
    new OptimizeCSSAssetsPlugin(),
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,  // 匹配node_modules目录下的文件
        //   priority: 5  // 优先级配置项
        // },
        // 打包重复出现的代码，minChunks: 2 && minSize: 0
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
};
