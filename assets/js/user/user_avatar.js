$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    var options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 选择文件
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });
    // 修改裁剪区域
    $('#file').on('change', function(e) {
        // 用户选择的文件
        var file = e.target.files[0];
        // 非空判断
        if (file == undefined) {
            return layer.msg('请选择图片！');
        }
        // 把文件生成对应的url路径
        var newImgURL = URL.createObjectURL(file);
        // 绘制裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });
    // 修改头像
    $('#btnUpload').on('click', function() {
        // 获取base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，更换头像成功！');
                window.parent.getUserInfo();
            }
        })
    })
})