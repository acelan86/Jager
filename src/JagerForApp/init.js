window.SATK.define('JagerForApp.init', function (require) {
    "use strict";

    var net = require('SATK.net'),
        //detect = require('SATK.detect'),
        array = require('SATK.array'),
        string = require('SATK.string'),
        Debugger = require('SATK.Debugger'),
        viewer = require('JagerForApp.viewer');

    var call2app = {
        JS_READY : 'sax://ready',
        RENDER_COMPLETE : 'sax://finish',
        RENDER_ERROR : 'sax://error',
        sendMesaage : function (msg) {
           console.log(msg);
        }
    };

    function _adapter(ad) {
        var networkMap = {
                '1' : 'http://d3.sina.com.cn/litong/zhitou/union/tanx.html?pid=',
                '2' : 'http://d3.sina.com.cn/litong/zhitou/union/google.html?pid=',
                '3' : 'http://d3.sina.com.cn/litong/zhitou/union/yihaodian.html?pid=',
                '4' : 'http://d3.sina.com.cn/litong/zhitou/union/baidu.html?pid=',
                '5' : 'http://js.miaozhen.com/mzad_iframe.html?_srv=MZHKY&l='
            },
            size,
            engineType = ad.engineType;

        //旧格式数据，需要适配成新格式
        if (!ad.content && ad.value) {
            Debugger.info('JagerForApp :Old data format, need adapter(pdps)', ad.id);
            size = ad.size.split('*');
            ad.content = [];
            array.each(ad.value, function (value) {
                if (engineType === 'network') {
                    value.content = {
                        src : [networkMap['' + value.manageType] + value.content + '&w=' + size[0] + '&h=' + size[1]],
                        type : ['url']
                    };
                }
                if (engineType === 'dsp' && parseInt(value.manageType, 10) !== 17) {
                    value.content = {
                        src : [value.content],
                        type : ['html']
                    };
                }
                ad.content.push(value.content);
            });
            delete ad.value;
        }

        //对新格式数据进行过滤，过滤掉content.src没有内容的广告
        ad.content = (function (contents) {
            var r = [];
            array.each(contents, function (content, i) {
                //如果src没有内容，则为空广告位
                var nullSrc = true;
                //如果src有内容，判断内容中是否有某个元素非空字符串，有非空即为非空字符串
                array.each(content.src, function (src) {
                    if (string.trim(src)) {
                        nullSrc = false;
                        return false;
                    }
                });
                //如果广告素材不为空，那么这是一个正常可用数据，进入过滤后的列表
                if (!nullSrc) {
                    r.push(content);
                } else {
                    Debugger.info('JagerForApp: The' + i + ' Ad Content src is null, via ' + ad.id);
                }
            });
            return r;
        })(ad.content);

        //对类型进行匹配
        array.each(ad.content, function (content, i) {
            var type, link;

            type = array.ensureArray(content.type);
            link = array.ensureArray(content.link);

            array.each(content.src, function (src, i) {
                type[i] = viewer.getTypeBySrc(src, type[i]);
            });
            // 通栏  950*90 tl
            // 画中画 300*250 hzh
            // 矩形 250*230 jx
            // 短通栏 640*90 dtl
            // 大按钮 300*120 dan
            // 小按钮 240*120 xan
            // 跨栏 1000*90 kl
            // 背投  750*450 bt
            // 文字链 wzl
            ad.type = ({
                'lmt'   : 'stream',
                'kl'    : 'couplet',
                'sc'    : 'videoWindow',
                'hzh'   : 'embed',
                'tl'    : 'embed',
                'jx'    : 'embed',
                'dtl'   : 'embed',
                'an'    : 'embed',
                'dan'   : 'embed',
                'xan'   : 'embed',
                'wzl'   : 'textlink',
                'ztwzl' : 'zhitoutextlink',
                'qp'    : 'fullscreen',
                'fp'    : 'turning',
                'dl'    : 'float',
                'tip'   : 'tip',
                'bt'    : 'bp',
                'sx'    : 'follow',
                'kzdl'  : 'coupletExt',
                'fc1'   : 'pop'
            }[ad.type]) || ad.type || 'embed';

            ad.content[i] = content;
        });

        return ad;
    }

    function _render(el, data) {
        var content = data.content[0],
            size = data.size.split('*'),
            width = parseInt(size[0], 10) + 'px',
            height = parseInt(size[1], 10) + 'px';

        el.innerHTML = [
            '<ins style="display:block;overflow:hidden;margin:0px auto;width:' + width + ';height:' + height + '">',
            viewer.createHTML(content.type, content.src, width, height, content.link, content.monitor),
            '</ins>'
        ].join('');
    }

    return {
        render : function (data) {
            if ('nodata' === data) {
                call2app.sendMesaage(call2app.RENDER_ERROR);
            } else {
                var el = document.getElementById('Container');
                data = array.ensureArray(data.ad)[0];

                if (el && data) {
                    data = _adapter ? _adapter(data) : data;
                    if (data.content instanceof Array && data.content.length > 0) {
                        _render(el, data);
                        call2app.sendMesaage(call2app.RENDER_COMPLETE);
                    } else {
                        call2app.sendMesaage(call2app.RENDER_ERROR);
                    }
                } else {
                    call2app.sendMesaage(call2app.RENDER_ERROR);
                }

                array.each(data.mapUrl, function (url) {
                    url && net.log(url, 1);
                });
            }
        },
        ready : function () {
            call2app.sendMesaage(call2app.JS_READY);
        }
    };
});