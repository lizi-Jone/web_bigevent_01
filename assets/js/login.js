$(function() {
    // 1.点击按钮，显示隐藏
    // 点击去注册账号，隐藏登陆区域，显示注册区域
    $('#link-reg').on('click', function() {
        $('.loginBox').hide();
        $('.regBox').show();
    });
    // 点击去登陆，显示登陆区域，隐藏注册区域
    $('#link-login').on('click', function() {
        $('.loginBox').show();
        $('.regBox').hide();
    });

    // 2.自定义校验规则
    var form = layui.form;
    form.verify({
        // 密码规则 
        pwd: [
            // 数组中第一个  正则
            /^[\S]{6,12}$/,
            // 第二个 报错信息
            '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码输入是否一致规则
        // 通过形参拿到确认密码框中的内容value
        repwd: function(value) {
            // 获取密码框的内容
            // var pwd = $('.regBox input[name=password]').val().trim();
            var pwd = $('.regBox [name=password]').val().trim();
            // 判断两个内容是否一致 只判断有问题的情况
            if (pwd !== value.trim()) {
                return '两次密码输入不一致';
            }
        }
    });

    // 弹出框
    var layer = layui.layer;
    // 3.监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('.regBox [name="username"]').val(),
                password: $('.regBox [name="password"]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                // 去登录点击事件
                $('#link-login').click();
                // form表单重置
                $('#form-reg')[0].reset();
            }
        })
    })

    // 4.登录
    $('#form-login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');
                }
                layer.msg('登录成功');
                // 本地存储token
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = '/index.html';
            }
        })
    })
})