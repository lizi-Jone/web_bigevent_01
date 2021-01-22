$(function() {
    // 定义时间美化过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
        var dt = new Date(dtStr);
        // 年月日
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
            // 时分秒
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 定义查询参数对象，将来查询文章使用
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };
    initTable();
    // 渲染文章列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 渲染
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 调用分页
                renderPage(res.total);
            }
        })
    }

    // 渲染文章分类
    var form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var str = template('tpl-cate', res);
                $('[name="cate_id"]').html(str);
                // form.render() 就是根据 select 标签生成/渲染 dl放dd 
                // 如果我们赋值之后，发现数据没有同步出来，就可以调用 form.render() 
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件 
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染文章列表
        initTable();
    });
    var laypage = layui.laypage;

    // 定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //存放分页的容器,使用ID名
            count: total, //数据总数
            limit: q.pagesize, //每页几条数据
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版，count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、skip（快捷跳页区域）
            limits: [2, 3, 5, 10], // 每页条数的选择项
            // 分页切换时触发jump函数
            // 触发jump函数方式：1.页码切换的时候触发；2.laypage.render()调用时触发
            jump: function(obj, first) {
                console.log(obj.curr); //最新切换的页码
                console.log(first); //jump方式2时结果为true，切换页码时为undefined
                // 当前页
                q.pagenum = obj.curr;
                // 每页显示的条数
                q.pagesize = obj.limit;
                // 判断，不是第一次初始化分页，才能调用渲染文章列表
                if (!first) {
                    initTable();
                }
            }
        });
        // 删除
        $('tbody').on('click', '.btn-delete', function() {
            var id = $(this).attr('data-id')
            layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layui.layer.msg(res.message);
                        }
                        if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--;
                        initTable();
                        layui.layer.msg('删除文章成功');
                    }
                });
                layer.close(index);
            });
        })
    }
})