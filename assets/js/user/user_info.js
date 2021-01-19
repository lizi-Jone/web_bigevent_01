$(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称字符在 1~6 位之间！'
            }
        }
    });
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！');
                }
                // 成功后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 重置：form绑定reset事件，btn绑定click事件
    $('#btnReset').on('click', function(e) {
        // 阻止默认重置事件
        e.preventDefault();
        // 重新获取用户基本信息
        initUserInfo();
    });
    // 更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('恭喜您，用户修改信息成功！');
                // 更新成功，渲染父页面的信息，更新用户信息和头像方法
                // window.parent是iframe的父页面的window对象
                window.parent.getUserInfo();
            }
        })
    })
})