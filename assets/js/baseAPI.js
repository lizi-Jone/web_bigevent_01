// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net';
// // 测试环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// // 生产环境
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// 拦截所有的ajax请求
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    // 统一拼接对应的服务器地址
    options.url = baseURL + options.url;
    // 给有权限的路径添加请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 拦截所有响应，判断身份认证信息
    options.complete = function(res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message === '身份认证失败！') {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html';
        }
    }
})