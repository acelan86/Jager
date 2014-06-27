window.SATK.define('JagerForApp.Monitor', function (require) {
    "use strict";

    var core = require('SATK.core'),
        array = require('SATK.array'),
        URL = require('SATK.URL');

    return /** @lends sinaadToolkit.monitor */{

        /**
         * 将监控url中的__xxx__变量名替换成正确的值，值从对象data中获取
         * @param  {String} monitorUrl 监控url
         * @param  {Object} data       用于替换的值对象
         * @return {String}            返回替换后的url
         */
        parseTpl : (function () {
            var reg = /\{__([a-zA-Z0-9]+(_*[a-zA-Z0-9])*)__\}/g;

            return function (monitorUrl, data) {
                //增加timestamp参数替换
                data.timestamp = data.timestamp || core.now();
                if (!monitorUrl) {
                    return '';
                }
                return monitorUrl.replace(reg, function (s1, s2) {
                    //插入adbox能支持的模版变量
                    //见adbox监控接口文档，
                    //https://github.com/acelan86/pandora/wiki/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E
                    //adbox的监控需要插入到iframe的name中，使用api_exu=xxx的方式
                    if (s2.indexOf('adbox_') > 0) {
                        s2 = s2.split('_');
                        return '{__mo' + s2[2] + '__}';
                    }
                    return data[s2] || s1;
                });
            };
        })(),
        /**
         * 创建二跳跟踪监测
         * @param  {String} link    落地页
         * @param  {Array:String} monitor 监测地址
         * @return {String}         二跳监测地址
         */
        createTrackingMonitor : function (link, monitor) {
            //如果没有link，就不生成二跳监测
            if (!link) {
                return '';
            }

            var clickTAG = URL.ensureURL(link);

            array.each(monitor, function (url) {
                url = URL.ensureURL(url);
                
                if (url) {
                    clickTAG = url + encodeURIComponent(clickTAG);
                }
            });

            return clickTAG;
        }
    };
});