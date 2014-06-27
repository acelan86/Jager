window.SATK.define('SATK.URL', function (require) {
    "use strict";

    var string = require('SATK.string'),
        Debugger = require('SATK.Debugger');

    var URL = {
        protocol : (function() {
            return (window.location.protocol === "https:" ? "https://" : "http://");
        })(),
        /**
         * 确保传入的字符串是一个url, 同时去除前后空格
         * iframe的src在ie下协议写错会导致刷新当前页面成iframe的src,
         * 判断是否有http或者https开头，如果没有直接认定添加http或者https
         * @todo \n\r 去除
         */
        ensureURL : function (source) {
            source = string.trim(source);
            return source ? (/^(http|https):\/\//).test(source) ? source : (URL.protocol + source) : '';
        },
        /**
         * 创建一个url
         * @param  {String} domain url主域
         * @param  {String} path   path
         * @param  {Boolean} useSSL 使用https?
         * @return {String}        生成的url
         */
        createURL : function (domain, path, useSSL) {
            return [useSSL ? "https" : "http", "://", domain, path].join("");
        },
        /**
         * 获取当前页面所在的主页面url
         * @return {String} 获取当前页面所在的主页面url
         */
        top : (function () {
            var top;
            try {
                top = window.top.location.href;
            } catch (e) {}
            top = top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
            if (!top) {
                Debugger.error('SATK:Cannot get pageurl on which ad locates.');
            }
            return top;
        })()
    };

    return URL;
});