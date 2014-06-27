window.SATK.define('JagerForApp.viewer', function (require) {
    "use strict";

    var Monitor = require('JagerForApp.Monitor'),
        array = require('SATK.array'),
        URL = require('SATK.URL'),
        string = require('SATK.string'),
        core = require('SATK.core'),
        net = require('SATK.net'),
        iframe = require('JagerForApp.iframe');


    var viewer = {
        /**
         * 通过src地址获取资源类型
         * @param  {String} src 资源地址
         * @return {String}     类型
         */
        getTypeBySrc : function (src, defaultType) {
            var type = defaultType;
            if (!type) {
                type = src.substring(src.length - 3).toLowerCase();
                switch (type) {
                    case 'swf':
                        type = 'flash';
                        break;
                    case 'tml':
                        type = 'url';
                        break;
                    case '.js' :
                        type = 'js';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type = 'image';
                        break;
                    default:
                        type = 'html';
                        break;
                }
            }

            if (type === 'url' && src.indexOf('adbox.sina.com.cn/ad/') >= 0) {
                type = 'adbox';
            }
            return type;
        },
        /**
         * 创建广告展现html
         * @param  {String} type    广告类型，如图片等
         * @param  {String} src     广告资源地址
         * @param  {Number} width   广告宽
         * @param  {Number} height  广告高
         * @param  {String} link    广告资源落地页地址
         * @param  {Array:String} monitor 广告点击监测的url数组
         * @param  {String} tpl     模版
         * @param  {Object} opt_options 额外参数
         *         @param {Boolean} wmode 是否透明
         * @return {String}         广告展现html
         */
        createHTML : function (type, src, width, height, link, monitor, tpl, opt_options) {
            var html = [],
                _html = '',
                config,
                tmpData = {},
                len = 0,
                i = 0;

            opt_options = opt_options || {};

            src = array.ensureArray(src),
            type = array.ensureArray(type),
            link = array.ensureArray(link),
            monitor = array.ensureArray(monitor);

            width += core.isNumber(width) ? 'px' : '',
            height += core.isNumber(height) ? 'px' : '';


            /**
             * 把所有的属性拉平，方便模板处理
             * src0, src1, src2 ... srcn
             * type0, type1, type2 ... typen
             * link0, link1, link2 ... linkn
             * monitor0, monitor1, monitor2 ... monitorn
             */
            array.each(src, function (_src, i) {
                tmpData['src' + i] = _src;
                tmpData['type' + i] = type[i] || viewer.getTypeBySrc(_src, type[i]);
                tmpData['link' + i] = link[i];
                tmpData['monitor' + i] = '';
                tmpData['monitor1_1_' + i] = Monitor.createTrackingMonitor(net.IMG_1_1, monitor);
                tmpData['monitor1_1_' + i] = tmpData['monitor1_1_' + i] === net.IMG_1_1 ? '' : tmpData['monitor1_1_' + i];
            });
            tmpData.width = width;
            tmpData.height = height;
            tmpData.src = tmpData.src0 || '';
            tmpData.type = tmpData.type0 || '';
            tmpData.link = tmpData.link0 || '';
            tmpData.monitor = tmpData.monitor0 || '';
            tmpData.monitor1_1 = tmpData.monitor1_1_0 || '';


            //如果提供了模版，则使用模版来渲染广告
            //模版中可以含有参数type, src, width, height, monitor, link
            //现在主要用在智投文字链和图文方式
            if (tpl && 'string' === typeof tpl) {
                return string.format(tpl, tmpData);
            }


            len = src.length;
            len = 1; //暂时先支持一个元素

            for (; i < len; i++) {
                //如果没有自定模版
                src = tmpData['src' + i];
                type = tmpData['type' + i];
                link = tmpData['link' + i];
                monitor = monitor.join('|');

                switch (type) {
                    case 'image' :
                        _html = '<img border="0" src="' + URL.ensureURL(src) + '" style="width:' + width + ';height:' + height + ';border:0" alt="' + src + '"/>';
                        //onclick与跳转同时发送会导致丢失移动端的监测
                        _html = link ? '<a href="' + link + '" target="_blank">' + _html + '</a>' : _html;
                        break;
                    case 'text' :
                        _html = link ? '<a href="' + link + '" target="_blank">' + src + '</a>' : src;
                        break;
                    case 'flash' :
                        // var vars = {};
                        // link && (vars.clickTAG = link);
                        // _html = sinaadToolkit.swf.createHTML({
                        //     url : sinaadToolkit.url.ensureURL(src),
                        //     width : width,
                        //     height : height,
                        //     wmode : opt_options.wmode || 'opaque',
                        //     vars : vars
                        // });
                        // if (link) {
                        //     _html = [
                        //         '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                        //             _html,
                        //             '<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="_blank"></a>',
                        //         '</div>'
                        //     ].join('');
                        // }
                        break;
                    case 'adbox' :
                    case 'url' :
                        config = {};
                        iframe.init(config, width, height, false);
                        config.src = URL.ensureURL(src);
                        monitor && (config.name = 'clickTAG=' + encodeURIComponent(monitor));
                        _html = iframe.createHTML(config);
                        break;
                    case 'js' :
                        _html = [
                            '<', 'script charset="utf-8" src="', URL.ensureURL(src), '"></', 'script>'
                            ].join('');
                        break;
                    default :
                        _html = src.replace(/\\x3c/g, '<').replace(/\\x3e/g, '>');
                        break;
                }
                html.push(_html);
            }
            return html.join(' ');
        }
    };
    return viewer;
});