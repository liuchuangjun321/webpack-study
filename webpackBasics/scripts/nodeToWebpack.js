// 引入webpack模块。
const webpack = require('webpack');
// 引入配置信息。
const config = require('../webpack.config');
// 通过webpack函数直接传入config配置信息。
const compiler = webpack(config);
// 通过compiler对象的apply方法应用插件，也可在配置信息中配置插件。
compiler.apply(new webpack.ProgressPlugin());
// 使用compiler对象的run方法运行webpack，开始打包。
compiler.run((err, stats) => {
    if(err) {
        // 回调中接收错误信息。
        console.error('node执行webpack失败了');
    }
    else {
        // 回调中接收打包成功的具体反馈信息。
        console.log('node执行webpack成功了');
    }
});