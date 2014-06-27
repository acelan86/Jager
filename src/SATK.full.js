(function (window, undefined) {
    "use strict";

    if (window.SATK) {
        return;
    }
    var core = window.SATK = {
        version: "1.0.0"
    };

    /**
     * 创建判断某种特定类型的函数
     */
    function is(type) {
        return function(o) {
            return {}.toString.call(o) === "[object " + type + "]";
        };
    }
    var isArray = Array.isArray || is("Array"),
        isFunction = is("Function");


    var cache = core.modules = {};

    function _exec(module) {
        //如果有exprots，认为已经初始化模块，直接返回exports
        if (module.exports !== null) {
            return module.exports;
        }

        function require(id) {
            if (!cache[id]) {
                throw new Error(id + " not found.");
            }
            return _exec(cache[id]);
        }

        var factory = module.factory;
        var exports = isFunction(factory) ? factory(require, module.exports = {}, module) : factory;
        
        if (undefined === exports) {
            exports = module.exports;
        }

        //增加exports, 删除factory, 表明已经初始化过该模块
        module.exports = exports;
        delete module.factory;

        return exports;
    }

    /**
     * 定义模块的方法
     */
    core.define = function (id, factory) {
        if (1 === arguments.length) {
            throw "module must has a id and factory.";
        }
        if (/^\-([\w\.\/\-]*)$/.test(id)) {
            id = RegExp.$1;
        }
        if (cache[id]) {
            throw "module " + id + " has been defined.";
        }
        var module = {
            id: id,
            factory: factory,
            exports: null
        };
        cache[id] = module;
        RegExp.$1 === id && _exec(cache[id]);
    };
    core.use = function(modules, callback) {
        if (!isArray(modules)) {
            modules = [modules];
        }
        var _modules = [];
        for (var i = 0; i < modules.length; i++) {
            _modules[i] = _exec(cache[modules[i]]);
        }
        callback && callback.apply(core, _modules);
    };

})(window);
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
window.SATK.define('SATK.RedirectToNative', function (require) {
    "use strict";

    var Event = require('SATK.Event');

    /**
     * @class RedirectToNative
     * @constructor 
     */
    function RedirectToNative(el) {
        var self = this;
        self.el = el;
        self.init();
    }
        
    RedirectToNative.prototype = {
        init: function() {
            var self = this;
                self.platform = self._UA();

            // pc下 什么都不处理  pc访问下可能href可以链接去其他地址
            if(!self.platform || navigator.standalone) {
                return;
            }

            Event.on(self.el, 'touchend', function (e) {
                e.preventDefault();
                var tar = e.currentTarget;

                if ('ios' === self.platform) {
                    self.installUrl = tar.getAttribute('data-ios-install-url');
                    self.nativeUrl = tar.getAttribute('data-ios-native-url');
                    self.openTime = tar.getAttribute('data-ios-open-time') || 800;
                } else {
                    self.installUrl = tar.getAttribute('data-android-install-url');
                    self.nativeUrl = tar.getAttribute('data-android-native-url');
                    self.openTime = tar.getAttribute('data-android-open-time') || 3000;
                    self.xpackage = tar.getAttribute('data-package') || '';
                }
                //只有android下的chrome要用intent机制唤起native
                if ('ios' !== self.platform && !!navigator.userAgent.match(/Chrome/i)) {
                    self._hackChrome();
                } else {
                    self._gotoNative();
                }
            });
        },
        /**
         * _hackChrome 只有android下的chrome要用intent协议唤起native
         * https://developers.google.com/chrome/mobile/docs/intents intent协议通过iframe.src访问无效，但改变href可行
         * @return  
         */
        _hackChrome: function() {
          var self = this;
          var startTime = Date.now();
          var paramUrlarr = self.nativeUrl.split('://'),
              scheme = paramUrlarr[0],
              schemeUrl = paramUrlarr[1];
              //假设未安装该应用; 如果安装了google应用下载器（google play）的， 会直接根据package name直接到应用商店定位到该应用；幸运的是用intent://不会刷新当前页面。
              //如果未安装google play则不会根据package name自动寻找下载地址
              //所以这里依然用超时就去自动下载的逻辑
          window.location = 'intent://' + schemeUrl + '#Intent;scheme=' + scheme + ';package=' + self.xpackage + ';end';
          setTimeout(function() {
              self._gotoDownload(startTime);
          }, self.openTime);
        },
        /**
         * [_gotoNative 跳转至native，native超时打不开就去下载]
         * @return 
         */
        _gotoNative: function() {
            var self = this;
            var startTime = Date.now(),
                doc = document,
                body = doc.body,
                iframe = doc.createElement('iframe');
                iframe.id = 'J_redirectNativeFrame';
                iframe.style.display = 'none';
                iframe.src = self.nativeUrl;

            //运行在head中
            if(!body) {
                setTimeout(function(){
                    doc.body.appendChild(iframe);
                }, 0);
            } else {
                body.appendChild(iframe);
            }
            
            setTimeout(function() {
                doc.body.removeChild(iframe);
                self._gotoDownload(startTime);
                /**
                 * 测试时间设置小于800ms时，在android下的UC浏览器会打开native app时并下载apk，
                 * 测试android+UC下打开native的时间最好大于800ms;
                 */
            }, self.openTime);
        },
        /**
         * [_gotoInstall 去下载]
         * @param  {[type]} startTime [开始时间]
         * @return 
         */
        _gotoDownload: function (startTime) {
            var self = this;
            var endTime = Date.now();
            if (endTime - startTime < self.openTime + 500) {
                window.location = self.installUrl;
            }
        },
        /**
         * [_UA 检测平台]
         * @return string [ios|android| ]
         */
        _UA: function() {
            var ua = navigator.userAgent;
            // ios
            if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                return 'ios';
            } else if (!!ua.match(/Android/i)) {
                return 'android';
            } else {
                return '';
            }
        }

    };

    return RedirectToNative;
});


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
window.SATK.define('SATK.array', function (require) {
   "use strict";

    var core = require('SATK.core');
    
    var array = {
        /**
         * 移除数组元素
         * @param  {Array} source 要移除元素的数组
         * @param  {Any} match  要移除的元素
         * @return {Array}        移除元素后的数组
         */
        remove : function (source, match) {
            var len = source.length;
                
            while (len--) {
                if (len in source && source[len] === match) {
                    source.splice(len, 1);
                }
            }
            return source;
        },
        /**
         * 遍历数组
         * @param  {Array} source     要遍历的源数组
         * @param  {Function} iterator   遍历方法
         * @param  {Object} thisObject 调用对象
         * @return {Array}            被遍历的源数组
         */
        each : function (source, iterator, thisObject) {

            source = array.ensureArray(source);

            var returnValue,
                item,
                i,
                len = source.length;
            
            if ('function' === typeof iterator) {
                for (i = 0; i < len; i++) {
                    item = source[i];
                    //TODO
                    //此处实现和标准不符合，标准中是这样说的：
                    //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
                    returnValue = iterator.call(thisObject || source, item, i);
            
                    if (returnValue === false) {
                        break;
                    }
                }
            }
            return source;
        },
        /**
         * 将传入元素转换成一个数组，如果是一个数组，直接返回，如果不是，判断是否为null或者undefined,如果不是，返回这个元素组成的数组，否则返回空数组
         * @param  {Any} source 需要转换的对象
         * @return {Array}      转换后的数组
         */
        ensureArray : function (source) {
            return core.isArray(source) ? source : core.isNull(source) ? [] : [source];
        }
    };

    return array;
});
/**
 * 本地存储模块
 */
window.SATK.define('SATK.cookie', function () {
    "use strict";

    var cookie = {
        /**
         * @private
         * @param  {String} key 要验证的cookie的key
         * @return {Boolean}    是否为符合规则的key
         */
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string
         
        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        /**
         * 从cookie中获取key所对应的值
         * @private
         * @param  {String} key 要获取的cookie的key
         * @return {String}     cookie对应该key的值
         */
        _getRaw : function (key) {
            if (cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        /**
         * 将cookie中key的值设置为value, 并带入一些参数
         * @private
         * @param  {String} key 要设置的cookie的key
         * @param  {String} value 要设置的值
         * @param  {Object} options 选项
         */
        _setRaw : function (key, value, options) {
            if (!cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' === typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value +
                (options.path ? "; path=" + options.path : "") +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (options.domain ? "; domain=" + options.domain : "") +
                (options.secure ? "; secure" : '');
        },
        /**
         * 获取cookie中key的值
         * @param  {String} key 要获取的key
         * @return {String}     cookie值
         */
        get : function (key) {
            var value = cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        /**
         * 设置cookie值
         * @param  {String} key     要设置的key
         * @param  {String} value   要设置的value   
         * @param  {object} options 选项
         */
        set : function (key, value, options) {
            cookie._setRaw(key, encodeURIComponent(value), options);
        },
        /**
         * 移除key相关的cookie
         * @param  {String} key     要移除的cookie的key
         * @param  {Object} options 选项
         */
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            cookie._setRaw(key, '', options);
        }
    };

    return cookie;
});
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
window.SATK.define("SATK.detect", function() {
    "use strict";

    return (function() {
        var ua = navigator.userAgent.toLowerCase();

        var detect = {
            iPhone:    /iphone/.test(ua),
            iPad:       /ipad/.test(ua),
            iPod:       /ipod/.test(ua),
            Android:    /android/.test(ua),
            AndroidPad: /android/.test(ua) && !/mobile/.test(ua),
            atwin:      /win/.test(ua),
            opera:      /opera/.test(ua),
            msie:       /msie/.test(ua),
            firefox:    /firefox/.test(ua),
            safari:     /safari/.test(ua) && !/chrome/.test(ua),
            wphone:     /windows phone/.test(ua),
            ps:         /playstation/.test(ua),
            uc:         /ucbrowser|ucweb/.test(ua),
            xiaomi:     /xiaomi/.test(ua)
        };
    
        var webkit = /(webkit)[ \/]([\w.]+)/,
            opera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            ie = /(msie) ([\w.]+)/,
            moz = /(mozilla)(?:.*? rv:([\w.]+))?/;

        var ver = webkit.exec(ua) || opera.exec(ua) || ie.exec(ua) || ua.indexOf("compatible") < 0 && moz.exec(ua) || [];
        
        detect.version = ver[2] || "0";
        
        return detect;
    })();
});
window.SATK.define('SATK.net', function (require) {
    "use strict";

    var core = require('SATK.core');

    /**
     * @private
     * @param  {HTMLScriptElement} scr     script节点
     * @param  {String} url     资源地址
     * @param  {String} charset 字符集
     */
    function _createScriptTag(scr, url, charset) {
        scr.setAttribute('type', 'text/javascript');
        charset && scr.setAttribute('charset', charset);
        scr.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scr);
    }
    /**
     * @private
     * @param  {HTMLScriptElement} scr script节点
     */
    function _removeScriptTag(scr) {
        if (scr && scr.parentNode) {
            scr.parentNode.removeChild(scr);
        }
        scr = null;
    }
    return /** @lends Core.Net */{
        IMG_1_1 : 'http://d00.sina.com.cn/a.gif',
        /**
         * 加载js模块
         * @param  {String} url          资源地址
         * @param  {Function} opt_callback 成功后回调方法
         * @param  {Object} opt_options  选项
         */
        loadScript : function (url, optCallback, optOptions) {
            var scr = document.createElement("SCRIPT"),
                scriptLoaded = 0,
                options = optOptions || {},
                charset = options.charset || 'utf-8',
                callback = optCallback || function () {},
                timeOut = options.timeout || 0,
                timer;
            
            // IE和opera支持onreadystatechange
            // safari、chrome、opera支持onload
            scr.onload = scr.onreadystatechange = function () {
                // 避免opera下的多次调用
                if (scriptLoaded) {
                    return;
                }
                
                var readyState = scr.readyState;
                if ('undefined' === typeof readyState ||
                     readyState === "loaded" ||
                     readyState === "complete") {
                    scriptLoaded = 1;
                    try {
                        callback();
                        clearTimeout(timer);
                    } finally {
                        scr.onload = scr.onreadystatechange = null;
                        _removeScriptTag(scr);
                    }
                }
            };

            if (timeOut) {
                timer = setTimeout(function () {
                    scr.onload = scr.onreadystatechange = null;
                    _removeScriptTag(scr);
                    options.onfailure && options.onfailure();
                }, timeOut);
            }
            
            _createScriptTag(scr, url, charset);
        },

        /**
         * 加载css样式
         */
        loadCss: function(cssText) {
            var n = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
                s = document.createElement("style");
            s.setAttribute("type", "text/css");
            s.innerHTML = cssText;
            n.appendChild(s);
        },

        /**
         * jsonp方式回调
         * @param  {String}   url         资源地址
         * @param  {Function} callback    回调方法
         * @param  {Object}   opt_options 选项
         */
        jsonp : function (url, callback, optOptions) {
            var scr = document.createElement('SCRIPT'),
                prefix = '_sinaads_cbs_',
                callbackName,
                // callbackImpl,
                options = optOptions || {},
                charset = options.charset || 'utf-8',
                queryField = options.queryField || 'callback',
                timeOut = options.timeout || 0,
                timer,
                reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
                matches;

            function getCallBack(onTimeOut) {
                 
                return function () {
                    try {
                        if (onTimeOut) {
                            options.onfailure && options.onfailure();
                        } else {
                            callback.apply(window, arguments);
                            clearTimeout(timer);
                        }
                        window[callbackName] = null;
                        delete window[callbackName];
                    } catch (e) {
                        // ignore the exception
                    } finally {
                        _removeScriptTag(scr);
                    }
                };
            }
     
            if (core.isFunction(callback)) {
                callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                window[callbackName] = getCallBack(0);
            } else if (core.isString(callback)) {
                // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
                // TODO 当调用了callback之后，无法删除动态创建的script标签
                callbackName = callback;
            } else {
                if ((matches = reg.exec(url))) {
                    callbackName = matches[2];
                }
            }
     
            if (timeOut) {
                timer = setTimeout(getCallBack(1), timeOut);
            }
     
            //如果用户在URL中已有callback，用参数传入的callback替换之
            url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
             
            if (url.search(reg) < 0) {
                url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
            }
            _createScriptTag(scr, url, charset);
        },
        /**
         * 日志方法
         * @param  {String} url 发送日志地址
         */
        log : function (url, useRandom) {
            var img = new Image(),
                key = '_sinaads_sio_log_' + core.rnd();

            window[key] = img;
         
            img.onload = img.onerror = img.onabort = function () {
                img.onload = img.onerror = img.onabort = null;
         
                window[key] = null;
                img = null;
            };
     
            img.src = url + (useRandom ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
        }
    };
});
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
window.SATK.define('SATK.string', function () {
    "use strict";

    var string = {

    };

    /**
     * 删除目标字符串两端的空白字符
     * @name sinaadToolkit.string.trim
     * @function
     * @grammar sinaadToolkit.string.trim(source)
     * @param {string} source 目标字符串
     * @remark
     * 不支持删除单侧空白字符
     * @shortcut trim
     * @meta standard
     *             
     * @returns {string} 删除两端空白字符后的字符串
     */

    string.trim = (function () {
        var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        
        return function (source) {
            source = source || "";
            return String(source).replace(trimer, "");
        };
    })();

    return string;
});