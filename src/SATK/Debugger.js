/**
 * Debug模块
 */
window.SATK.define('SATK.Debugger', function () {
    "use strict";
    var Debugger = {
        mode : 'release',
        info : function (msg) {
            (Debugger.mode === 'debug') && console.log(msg);
        },
        error : function (msg) {
            (Debugger.mode === 'debug') && console.error(msg);
        }
    };
    return Debugger;
});