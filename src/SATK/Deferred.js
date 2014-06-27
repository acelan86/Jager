window.SATK.define('SATK.Deferred', function (require) {
    "use strict";

    var Debugger = require('SATK.Debugger'),
        array = require('SATK.array');

    function _pipe(original, deferred, callback, actionType) {
        return function () {
            if (typeof callback === 'function') {
                try {
                    var returnValue = callback.apply(original, arguments);

                    if (Deferred.isPromise(returnValue)) {
                        returnValue.then(
                            function () {
                                deferred.resolve.apply(deferred, arguments);
                            },
                            function () {
                                deferred.reject.apply(deferred, arguments);
                            }
                        );
                    }
                    else {
                        deferred.resolve.call(deferred, returnValue);
                    }
                }
                catch (e) {
                    Debugger.error('SATK.Deferred:Error occurred in _pipe. ' + e.message);
                    deferred.reject(e);
                }
            }
            // `.then()`及`.then(done, null)`时使用
            // 直接使用原`Deferred`保存的参数将`deferred`改为对应状态
            else {
                deferred[actionType].apply(deferred, original._args);
            }
        };
    }
    //判断promise状态决定指定回调方法
    function _flush(deferred) {
        if (deferred._state === 'pending') {
            return;
        }
        var callbacks = deferred._state === 'resolved' ? deferred._resolves.slice() : deferred._rejects.slice();

        setTimeout(function () {
            array.each(callbacks, function (callback) {
                try {
                    callback.apply(deferred, deferred._args);
                } catch (e) {
                    Debugger.error('SATK.Deferred:Error occurred in _flush. ' + e.message);
                }
            });
        }, 0);

        deferred._resolves = [];
        deferred._rejects = [];
    }

    /**
     * @constructor
     * @class Prossmise的一个实现
     * @memberOf sinaadToolkit
     */
    function Deferred() {
        this._state = 'pending'; //当前promise状态
        this._args = null;       //传递参数
        this._resolves = [];     //成功回调集合
        this._rejects = [];      //失败回调集合
    }
    
    Deferred.prototype = /** @lends Deferred.prototype */{
        /**
         * @method
         */
        resolve : function () {
            if (this._state !== "pending") {
                return;
            }

            this._state = 'resolved';
            this._args = [].slice.call(arguments);

            _flush(this);
        },
        reject : function () {
            if (this._state !== 'pending') {
                return;
            }
            this._state = 'rejected';
            this._args = [].slice.call(arguments);

            _flush(this);
        },
        then : function (resolve, reject) {
            var deferred = new Deferred();
            
            this._resolves.push(_pipe(this, deferred, resolve, 'resolve'));
            this._rejects.push(_pipe(this, deferred, reject, 'reject'));

            _flush(this);

            return deferred;
        },
        done : function (callback) {
            return this.then(callback);
        },
        fail : function (callback) {
            return this.then(null, callback);
        }
    };

    Deferred.isPromise = function (value) {
        return value && typeof value.then === 'function';
    };

    return Deferred;

});