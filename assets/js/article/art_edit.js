$(function() {
    // 设置表单信息
    // 用等号切割，然后使用后面的值
    // alert(location.search.split('=')[1]);
    function initForm() {
        var id = location.search.split('=')[1];
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data);
                form.render();
                console.log(res.data);
                // 富文本编辑器进行赋值
                tinyMCE.activeEditor.setContent(res.data.content);
                // 非空校验
                if (!res.data.cover_img) {
                    return layer.msg('用户未上传封面！');
                }
                // 图片赋值
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }



    // 1.初始化分类
    var form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-cate', res);
                $('[name="cate_id"]').html(str);
                form.render();
                // 所有文章分类渲染完毕后再调用initForm()
                initForm();
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 封面图片上传 更换图片
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    $('#coverFile').on('change', function(e) {
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        if (file === undefined) {
            return;
        }
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 设置状态
    var art_state = '已发布';
    // $('#btnSave1').on('click', function() {
    //     art_state = '已发布';
    // });
    $('#btnSave2').on('click', function() {
        art_state = '存为草稿';
    });

    // 发布文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 创建FormData
        var fd = new FormData(this);
        // 添加状态
        fd.append('state', art_state);
        // 生成二进制文件图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // ajax必须在该函数中发送
                // console.log(...fd);
                publishArticle(fd);
            })
    })

    // 封装修改文章
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改文章成功！');
                setTimeout(function() {
                    window.parent.document.querySelector('#art_list').click();
                }, 1500)
            }
        })
    }
})