/**
 * 本地存储模块
 */
window.SATK.define('SATK.storage', function (require) {
    "use strict";

    var core = require('SATK.core'),
        Debugger = require('SATK.Debugger'),
        Event = require('SATK.Event');

    var _storage = window.localStorage,
        _sessionStorageMap = {};

    /**
     * @TODO 为了解决localStorage读取性能问题，是否尝试修改成一次成批写入一个key，读取后格式化成一个本地变量来处理
     */
    var storage = {
        /**
         * 获取本地存储的key的值
         * @param  {String} key key
         * @return {String}     取得的值
         */
        get : function (key) {
            try {
                var value = _storage.getItem(key);
                if (value) {
                    Debugger.info('SATK.storage.get: get origin value of ' + key + ':' + value);
                    value = value.split(';expires=');
                    //有过期时间
                    if (value[1] && core.now() > parseInt(value[1], 10)) {
                        _storage.removeItem(key);
                        return null;
                    } else {
                        return value[0];
                    }
                }
                return null;
            } catch (e) {
                Debugger.info('SATK.storage.get:' + e.message);
                return null;
            }
        },
        /**
         * 设置本地存储key的值为value
         * 注意：请不要设置非字符串格式形式的值到本地存储
         * @param  {String} key     设置的key
         * @param  {String} value   设置的value
         * @param  {Number} expires 过期时间毫秒数
         */
        set : function (key, value, opt_option) {
            opt_option = opt_option || {};

            var expires = opt_option.expires;

            try {
                _storage.setItem(key, value + (expires ? ';expires=' + (core.now() + expires) : ''));
                if (!expires) {
                    _sessionStorageMap[key] = 1;
                }
            } catch (e) {
                Debugger.error('SATK.storage.set:' + e.message);
            }
        },
        /**
         * 移除本地存储中key的值
         * @param  {String} key 要移除的key
         */
        remove : function (key) {
            try {
                _storage.removeItem(key);
            } catch (e) {
                Debugger.error('SATK.storage.remove:' + e.message);
            }
        }
    };

    //清除session类型的本地存储，即没有设置过期事件的本地存储
    Event.on(window, 'beforeunload', function () {
        for (var key in _sessionStorageMap) {
            try {
                storage.remove(key);
                delete _sessionStorageMap[key];
            } catch (e) {}
        }
    });

    return storage;
});