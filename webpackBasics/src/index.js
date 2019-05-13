import './css/index.less';

console.log('启用 HMR FOR JS');
if (module.hot) {
    module.hot.accept();
}