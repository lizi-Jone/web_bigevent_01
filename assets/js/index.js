$(function() {
    // 获取用户信息，全局函数 
    getUserInfo();
    // 退出功能
    $('#btnLogout').on('click', function() {
        // 询问框
        layer.confirm('是否确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })
});
// 获取用户信息，全局函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 设置请求头 headers
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 获取用户头像和信息
            renderAvatar(res.data);
        }
    })
}
// 获取用户头像和信息
function renderAvatar(user) {
    // 获取用户昵称或用户名 昵称优先，若无，就用username
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        // 头像图片显示
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 文本头像显示
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}