window.SATK.define('JagerForApp.init', function(require) {
    "use strict";

    // var net = require('SATK.net'),
    //detect = require('SATK.detect'),
    var array = require('SATK.array'),
        string = require('SATK.string'),
        Debugger = require('SATK.Debugger'),
        Deffer = require('SATK.Deferred'),
        viewer = require('JagerForApp.viewer');

    var call2app = {
        JS_READY: 'sax://ready',
        RENDER_COMPLETE: 'sax://finish',
        RENDER_ERROR: 'sax://error',
        sendMesaage: function(msg) {
            window.location.href = msg;
            // console.log(msg);
        }
    };

    function _adapter(data) {
        //对新格式数据进行过滤，过滤掉content.src没有内容的广告
        data.ad = (function(contents) {
            var r = [];
            array.each(contents, function(content, i) {
                //如果src没有内容，则为空广告位
                var nullSrc = true;
                //如果src有内容，判断内容中是否有某个元素非空字符串，有非空即为非空字符串
                array.each(content.src, function(src) {
                    if (string.trim(src)) {
                        nullSrc = false;
                        return false;
                    }
                });
                //如果广告素材不为空，那么这是一个正常可用数据，进入过滤后的列表
                if (!nullSrc) {
                    r.push(content);
                } else {
                    Debugger.info('JagerForApp: The' + i + ' Ad Content src is null, via ' + data.id);
                }
            });
            return r;
        })(data.ad);
        // 验证数据格式 render不需要再次检测
        array.each(data.ad, function(content) {
            var i,
                key,
                strMap = ['src', 'type', 'link', 'view', 'click'];
            for (i = strMap.length - 1; i >= 0; i--) {
                key = strMap[i];
                content[key] = array.ensureArray(content[key]);
            }
        });

        data.content = data.ad;

        delete data.ad;

        return data;
    }

    /**
     * [preloadSrc 预加载资源，预加载完成才开始渲染]
     * @return {[Deffer]}      [description]
     */
    function preloadSrc(data) {
        var deffer = new Deffer(),
            content = data.content[0];
        if (content.src.length === 1 && content.type[0] === 'image') {
            var img = new Image();
            img.onload = function () {
                img.onload = null;
                img = null;
                deffer.resolve();
            };
            img.onerror = img.onabort = function () {
                img.onerror = img.onabort = null;
                img = null;
                deffer.reject();
            };
            img.src = content.src[0];
        } else {
            deffer.resolve();
        }
        console.log('preload resoure ..', content.src[0]);
        return deffer;
        
    }
    
    function _render(el, data, containerWidth, containerHeight) {
        console.log('begin render data: ', data);
        containerWidth = ~~containerWidth / window.devicePixelRatio;
        containerHeight = ~~containerHeight / window.devicePixelRatio;
        renderImg(el, data, containerWidth, containerHeight);
    }

    /**
     * [renderImg 单一图片格式广告渲染方法]
     * @param  {[type]} el   [Dom element]
     * @param  {[type]} data [description]
     */
    function renderImg(element, data, containerWidth, containerHeight) {
        var content = data.content[0],
            size = content.size,
            width = parseInt(size[0], 10),
            height = parseInt(size[1], 10);

        //移动端 尺寸按照实际容器尺寸获取  不再按比例拉伸
        if (containerWidth !== 0) {
            element.style.display = 'block';
            // height = containerWidth / width * height;
            width = containerWidth;
            if (containerHeight !== 0) {
                height = containerHeight;
                // width = width * containerHeight / height ;
                // height = containerHeight < height ? containerHeight : height;
            }
        }

        element.innerHTML = [
            '<ins style="display:block;overflow:hidden;margin:0px auto;width:' + width + 'px;height:' + height + 'px">',
            viewer.createHTML(content.type, content.src, width, height, content.link, content.click),
            '</ins>'
        ].join('');
    }

    return {
        /**
         * [render description]
         * @param  {[type]} data   [description]
         * @param  {[Number]} width  [容器宽]
         * @param  {[Number]} height [容器高度]
         */
        render: function(data, width, height) {
            console.log('typeof data: ', typeof data);
            if ('nodata' === data) {
                call2app.sendMesaage(call2app.RENDER_ERROR);
            } else {
                var el = document.getElementById('Container');
                data = array.ensureArray(data.adunit)[0];

                if (el && data) {
                    data = _adapter ? _adapter(data) : data;
                    if (data.content instanceof Array && data.content.length > 0) {
                        preloadSrc(data).done(function () {
                            _render(el, data, width, height);
                            call2app.sendMesaage(call2app.RENDER_COMPLETE);
                        }).fail(function () {
                            call2app.sendMesaage(call2app.RENDER_ERROR);
                        });
                    } else {
                        call2app.sendMesaage(call2app.RENDER_ERROR);
                    }
                } else {
                    call2app.sendMesaage(call2app.RENDER_ERROR);
                }

            }
        },
        ready: function() {
            call2app.sendMesaage(call2app.JS_READY);
        }
    };
});