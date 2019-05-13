// 如果是Node脚本调用webpack打包，在打包之前直接使用Node的fs模块删除/dist文件夹中的所有文件
const webpack = require('webpack');
const config = require('../webpack.config');
const fs = require('fs');
const path = require('path');
const compiler = webpack(config);
const dist = path.join(__dirname, '../dist');

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolderRecursive(dist);
// run webpack
// compiler.run((err, stats) => {
//     if(err) {
//         console.error(err);
//     }
//     else {
//         console.log(stats.hash);
//     }
// });