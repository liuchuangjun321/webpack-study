var path = require('path');
/**
 * 服务器server以及项目的公共配置
 */
module.exports = {
    // 服务器部署路径（CDN 上的绝对路径或相对路径），配合externals使用，可以利用CDN加速react访问
    publicPath: "/cdn/",
    distPath: path.resolve(__dirname, '..', 'dist'),    //  本地打包后的资源根目录
    rootPath: path.resolve(__dirname, '..'), // 项目根目录
    srcPath: path.resolve(__dirname, '..', 'src'),
    libPath: path.resolve(__dirname, '..', 'node_modules'),
};