/**
 * 核心方法模块
 */
window.SATK.define('SATK.core', function () {
    "use strict";

    var core = {
        /**
         * 获取当前时间戳
         * @return {Number} 当前时间戳
         * @static
         */
        now : function () {
            return +new Date();
        },
        /**
         * 随机数生成，生成一个随机数的36进制表示方法
         * @return {String} 生成一个随机的36进制字符串（包含0-9a-z）
         * @static
         */
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
        },
        /**
         * 获取[min, max]区间内任意整数
         * @param  {Number} min 最小值
         * @param  {Number} max 最大值
         * @return {Number}     
         */
        rand : function (min, max) {
            return Math.floor(min + Math.random() * (max - min + 1));
        },
        /**
         * 把一个字符串生成唯一hash
         * @param  {String} s 要生成hash的字符串
         * @return {String}   36进制字符串
         */
        hash : function (s) {
            var hash = 0,
                i = 0,
                w;

            for (; !isNaN(w = s.charCodeAt(i++));) {
                hash = ((hash << 5) - hash) + w;
                hash = hash & hash;
            }

            return Math.abs(hash).toString(36);
        },
        /**
         * 判断是否是函数
         * @param  {Any}        source      需要判断的对象
         * @return {Boolean}                是否是函数
         * @staitc
         */
        isFunction : function (source) {
            return '[object Function]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是字符串
         * @param  {Any} source 要判断的对象
         * @return {Boolean}        是否字符串
         * @static
         */
        isString : function (source) {
            return '[object String]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是null或者未定义
         * @param  {Any} source  要判断的对象
         * @return {Boolean}      是否为null或未定义
         */
        isNull : function (source) {
            return ('undefined' === typeof source) || (source === null);
        },
        /**
         * 判断是否是数组
         */
        isArray : function (source) {
            return '[object Array]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是数字
         */
        isNumber : function (source) {
            return '[object Number]' === Object.prototype.toString.call(source) && isFinite(source);
        }
    };

    core.uid = core.hash(window.location.host.split('.')[0] + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));

    return core;
});