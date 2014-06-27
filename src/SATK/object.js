window.SATK.define('SATK.object', function () {
    "use strict";

    return {
        /**
         * object的遍历方法
         * @param  {Object} source   要遍历的对象
         * @param  {Function} iterator 遍历方法，第一个参数为遍历的值，第二个位key
         * @return {Object}          key映射的遍历结果
         */
        map : function (source, iterator) {
            var results = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    results[key] = iterator(source[key], key);
                }
            }
            return results;
        }
    };
});