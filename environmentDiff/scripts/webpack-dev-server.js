const Webpack = require('webpack');
const webpackDevConfig = require('../webpackConfig/webpack.dev.config');
const WebpackDevServer = require("webpack-dev-server");

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  console.log('此环境为生产环境，如果本地测试请使用npm run start:dev启动一个开发环境');
  return ;
}

const compiler = Webpack(webpackDevConfig);

const devServerOptions = Object.assign({}, webpackDevConfig.devServer, {
  stats: {
    colors: true
  }
});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(8080, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080');
});

