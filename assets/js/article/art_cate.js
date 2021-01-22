$(function() {
    initArtCateList();
    // 初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
            }
        })
    }

    // 当你想关闭当前页的某个层时，每一种弹层调用方式，都会返回一个index，需要把获得的index，赋予layer.close即可
    var indexAdd = null;
    // 显示添加区域 显示添加文章分类列表
    $('#btnAddCate').on('click', function() {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    // 提交添加文章分类
    // 弹出层是后添加的，绑定事件只能通过body
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 重新渲染页面的数据
                initArtCateList();
                layer.msg('新增文章分类成功！');
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 修改文章分类
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取Id，发送Ajax获取数据，渲染到页面
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    });

    // 修改———提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 重新渲染页面的数据
                initArtCateList();
                layer.msg('修改文章分类成功！');
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })
    });

    // 删除
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})