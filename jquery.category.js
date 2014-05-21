(function ($) {
    $.fn.category = function (options) {
        var root = this, localStore = [], defaults = {
            url: "/category/list",
            handel: function (v) { return "<option value=" + v.Id + ">" + v.Name + "</option>"; },
            path: root.attr("val") || 0,
            //拆分字符
            sChar: ',',
            change: function (v) { },
            //数据过滤使用
            filter: function (v) { return v; },
            param: function (id) { return { parentId: id }; },
            //异步开关
            async: true,
            //同步数据提供
            provider: function (id) {
                return [];
            }
        },
        methods = {
            //初始化参数
            init: function () {
                //合并参数
                defaults = $.extend({}, defaults, options);
                $("select", root).remove();
                //添加绑定事件
                root.delegate("select", "change", methods.add);
                //添加到root中
                if (methods.isPath(defaults.path)) {
                    var arrays = defaults.path.split(defaults.sChar);
                    $.each(arrays, function (i, val) {
                        var select = $("<select>").appendTo(root);
                        methods.ajax(val, function (data) {
                            methods.ajaxCall(select, data);
                            select.val(arrays[i + 1] || 0);
                        });
                    });
                } else {
                    methods.add.call(root);
                }

            },
            ajaxCall: function (select, data) {
                //如果数据不符合规范
                if (!methods.valiData(data)) {
                    select.remove();
                    return;
                }
                select.append(methods.getHtml(data)).show();
            },
            //判断地址是否正确 <num>或者<num>,<num>,<num>,<num>
            isPath: function () { return defaults.path && /^(\d+,?)+$/.test(defaults.path) && defaults.path != '0'; },
            //add的this 为当前触发的 select
            add: function () {
                var select;
                if (this != root) {
                    //移除一下所有的选择
                    $(this).nextAll("select").remove();
                    select = $("<select>").insertAfter(this);
                } else {
                    select = $("<select>").appendTo(this);
                }
                select.hide();
                defaults.change(methods.get());
                methods.ajax(this.value || 0, function (data) {
                    methods.ajaxCall(select, data);
                });
            },
            //异步请求数据
            ajax: function (id, callback) {
                if (!/\d+/.test(id)) return;
                if (defaults.async) {
                    //异步获取数据
                    $.ajax(defaults.url, {
                        type: 'GET',
                        dataType: "json",
                        cache: true,
                        data: defaults.param(id),
                        success: function (serverData) {
                            //数据过滤
                            callback(defaults.filter(serverData));
                        }
                    });
                    return;
                }
                callback(defaults.filter(defaults.provider(id)));
            },
            //获取Html
            getHtml: function (data) {
                var html = '<option>请选择..</option>';
                for (var i = 0; i < data.length; i++)
                    html += defaults.handel(data[i]);
                return html;
            },
            //验证数据是否符合格式
            valiData: function (data) {
                return (data && data.length != 0);
            },
            //获取分类地址
            get: function () {
                var ls = [0];
                $("select", root).each(function () {
                    if (this.value && /\d+/.test(this.value)) ls.push(this.value - 0);
                });
                return ls;
            }
        };
        methods.init();
    };
})(jQuery)
