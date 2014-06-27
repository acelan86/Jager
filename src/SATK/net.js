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