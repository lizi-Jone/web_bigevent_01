// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net';
// // 测试环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// // 生产环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// 拦截所有的ajax请求
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    // 拼接对应的服务器地址
    options.url = baseURL + options.url;
})