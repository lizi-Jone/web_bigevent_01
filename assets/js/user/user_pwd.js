$(function() {
    var form = layui.form;
    // 定义密码规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码
        samePwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码和旧密码不能一致！'
            }
        },
        // 确认新密码
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次密码不一致！'
            }
        }
    });
    // 修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功！');
                // 重置form表单
                $('.layui-form')[0].reset();
            }
        })
    })
})