window.SATK.define('SATK.Event', function () {
    "use strict";

    var Event = {
        /**
         * 注册事件
         * @param  {HTMLNodeElement}    dom      事件监听节点
         * @param  {String}             type     事件类型
         * @param  {Function}           callback 回调方法
         */
        on : function (dom, type, callback) {
            dom.addEventListener(type, callback, false);
        },
        un : function (dom, type, callback) {
            dom.removeEventListener(type, callback);
        }
    };
    return Event;
});