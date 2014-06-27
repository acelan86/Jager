try {
    document.domain = "letv.com"
} catch (e) {}(function(e) {
    if (e.LTK)
        return;
    var t = e.LTK = {
        version: "1.0.0"
    };
    var i = t.mods = {};
    var a = t.data = {};
    function s(e) {
        return function(t) {
            return {}.toString.call(t) === "[object " + e + "]"
        }
    }
    var n = Array.isArray || s("Array");
    var o = s("Function");
    var r = s("String");
    var d = s("Object");
    var l = /\\\\/g, c = /^\-([\w\.\/\-]*)$/;
    var h = /\w+\.\//g;
    var p = /\w+\.\w+\.\.\//;
    function f(e, t) {
        if (!/^\./.test(e))
            return e;
        t = (t + e).replace(h, "");
        while (t.match(p)) {
            t = t.replace(p, "")
        }
        return t
    }
    function u(e) {
        var t = a.alias;
        return t && r(t[e]) ? t[e] : e
    }
    function v(e, t) {
        if (!e)
            return "";
        e = u(e);
        e = f(e, t);
        return e
    }
    function g(e) {
        if (e.exports !== null)
            return e.exports;
        for (var t in e.deps) {
            g(i[e.deps[t].id])
        }
        function a(t) {
            t = v(t, e.id);
            if (!i[t])
                throw new Error(t + " not found.");
            return g(i[t])
        }
        a.async = a;
        var s = e.factory;
        var n = o(s) ? s(a, e.exports = {}, e): s;
        if (n === undefined) {
            n = e.exports
        }
        e.exports = n;
        delete e.factory;
        return n
    }
    t.define = function(e, a, s) {
        var n = arguments.length;
        if (n === 1) {
            throw "module must has a id and factory."
        } else if (n === 2) {
            s = a;
            a = []
        }
        if (c.test(e))
            e = RegExp.$1;
        if (i[e]) {
            throw "module " + e + " has been defined."
        }
        var o = {
            id: e,
            deps: a,
            factory: s,
            exports: null
        };
        i[e] = o;
        RegExp.$1 == e && t.exec(e, true)
    };
    t.exec = function(e) {
        return g(i[e])
    };
    t.use = function(i, a) {
        if (!n(i))
            i = [i];
        var s = [];
        for (var o = 0; o < i.length; o++) {
            s[o] = t.exec(i[o])
        }
        if (a) {
            a.apply(e, s)
        }
    };
    t.config = function(e) {
        for (var i in e) {
            var s = e[i];
            var o = a[i];
            if (o && d(o)) {
                for (var r in s) {
                    o[r] = s[r]
                }
            } else {
                if (n(o)) {
                    s = o.concat(s)
                }
                a[i] = s
            }
        }
        return t
    };
    t.require = function(e) {
        return t.exec(e)
    };
    e.define = t.define
})(this);
define("-extend.logger", function(e, t, i) {
    var a = {
        init: function() {
            if (a.sip) {
                this.loadSocket();
                return 
            }
            if (!location.search)
                return;
            var e = location.search.match(/\bsip=((\d+\.){3}\d+)/);
            if (e == null)
                return;
            this.loadSocket()
        },
        loadSocket: function() {
            document.write('<script type="text/javascript" src="http://js.letvcdn.com/js/201405/07/lejs_1851/socket.io.min.js"></script>')
        },
        log: function(e) {}
    };
    a.sip = "";
    a.init();
    window.logger = a
});
define("core.vjs", function(e, t, i) {
    var a, s = [].filter, n = [].slice, o = {}, r = /^\.([\w-]+)$/, d = /^#([\w-]*)$/, l = /^[\w-]+$/;
    var c = e("extend.detect");
    vjs = function(e, t) {
        if (!e)
            return p();
        else if (f(e))
            return e;
        else if (e.nodeType)
            return p([e]);
        else {
            var i;
            if (b(e))
                i = _(e);
            else if (t !== a)
                return vjs(t).find(e);
            else 
                i = h(document, e);
                return p(i, e)
        }
    };
    vjs.isDebug = false;
    var h = function(e, t) {
        var i;
        try {
            return g(e) && d.test(t) ? (i = e.getElementById(RegExp.$1)) ? [i] : [] : e.nodeType !== 1 && e.nodeType !== 9 ? [] : n.call(r.test(t) ? e.getElementsByClassName(RegExp.$1) : l.test(t) ? e.getElementsByTagName(t) : e.querySelectorAll(t))
        } catch (a) {
            return []
        }
    };
    var p = function(e, t) {
        e = e || [];
        e.__proto__ = vjs.fn;
        e.selector = t || "";
        return e
    };
    var f = function(e) {
        return e instanceof p
    };
    vjs.fn = {
        find: function(e) {
            var t, i = this;
            if (typeof e == "object")
                t = vjs(e).filter(function() {
                    var e = this;
                    return [].some.call(i, function(t) {
                        return vjs.contains(t, e)
                    })
                });
            else if (this.length == 1)
                t = vjs(h(this[0], e));
            else 
                t = this.map(function() {
                    return h(this, e)
                });
            return t
        },
        each: function(e) {
            [].every.call(this, function(t, i) {
                return e.call(t, i, t) !== false
            });
            return this
        },
        hasClass: function(e) {
            var t = this[0];
            return new RegExp("(\\s|^)" + e + "(\\s|$)").test(t.className)
        },
        addClass: function(e) {
            var t = (e || "").split(/\s+/);
            return this.each(function() {
                var e = this.className;
                for (var i = 0, a = t.length; i < a; i++) {
                    if (!vjs(this).hasClass(t[i])) {
                        e += " " + t[i]
                    }
                }
                this.className = e
            })
        },
        removeClass: function(e) {
            var t = (e || "").split(/\s+/);
            return this.each(function() {
                var e = this.className;
                for (var i = 0, a = t.length; i < a; i++) {
                    var s = new RegExp("(\\s|^)" + t[i] + "(\\s|$)");
                    e = e.replace(s, " ")
                }
                this.className = vjs.trim(e)
            })
        },
        on: function(e, t, i) {
            return this.each(function(a, s) {
                var n = function(e) {
                    t.call(i, e)
                };
                if (!s["domid"])
                    s["domid"] = String(Math.random()).slice(-4);
                var o = e + "_" + s["domid"];
                t[o] = n;
                s.addEventListener(e, n, false)
            })
        },
        off: function(e, t, i) {
            return this.each(function(i, a) {
                var s = e + "_" + a["domid"], n = t[s] || t;
                a.removeEventListener(e, n, false)
            })
        },
        getStyle: function(e) {
            var t = this[0];
            if (c.msie) {
                switch (e) {
                case"opacity":
                    return (t.filters["DXImageTransform.Microsoft.Alpha"] || t.filters["alpha"] || {}).opacity || 100;
                case"float":
                    e = "styleFloat"
                }
                return t.style[e] || t.currentStyle ? t.currentStyle[e] : 0
            } else {
                if (e == "float") {
                    e = "cssFloat"
                }
                return t.style[e] || (document.defaultView.getComputedStyle(t, "") ? document.defaultView.getComputedStyle(t, "")[e] : null) || 0
            }
        },
        setStyle: function(e, t) {
            return this.each(function() {
                var i = this;
                if (c.msie) {
                    switch (e) {
                    case"opacity":
                        i.style.filter = "alpha(opacity=" + t * 100 + ")";
                        if (!i.currentStyle ||!i.currentStyle.hasLayout) {
                            i.style.zoom = 1
                        }
                        return;
                    case"float":
                        e = "styleFloat"
                    }
                } else {
                    if (e == "float") {
                        e = "cssFloat"
                    }
                }
                i.style[e] = t
            })
        },
        getAttr: function(e) {
            var t = this[0];
            return t.getAttribute(e)
        },
        setAttr: function(e, t) {
            return this.each(function() {
                var i = this;
                i.setAttribute(e, t)
            })
        },
        offset: function() {
            var e = this[0];
            var t = document.body, i = e.getBoundingClientRect();
            return {
                top: i.top + (window.scrollY || t.parentNode.scrollTop || e.scrollTop) - (document.documentElement.clientTop || t.clientTop || 0),
                left: i.left + (window.scrollX || t.parentNode.scrollLeft || e.scrollLeft) - (document.documentElement.clientLeft || t.clientLeft || 0)
            }
        },
        width: function(e) {
            if (typeof e == "undefined") {
                return this[0].offsetWidth
            }
            this[0].style.width = parseFloat(e) + "px"
        },
        height: function(e) {
            if (typeof e == "undefined") {
                return this[0].offsetHeight
            }
            this[0].style.height = parseFloat(e) + "px"
        },
        map: function(e) {
            return vjs(vjs.map(this, function(t, i) {
                return e.call(t, i, t)
            }))
        }
    };
    function u(e) {
        return e == null ? String(e) : o[toString.call(e)] || "object"
    }
    function v(e) {
        return u(e) == "function"
    }
    function g(e) {
        return e != null && (e.nodeType == 9 || e.nodeType == e.DOCUMENT_NODE)
    }
    function b(e) {
        return e instanceof Array
    }
    function m(e) {
        return typeof e.length == "number"
    }
    function _(e) {
        return s.call(e, function(e) {
            return e != null
        })
    }
    function y(e, t) {
        var i = e.className, s = i && i.baseVal !== a;
        if (t === a)
            return s ? i.baseVal : i;
        s ? i.baseVal = t : e.className = t
    }
    function x(e, t, i, a) {
        return v(t) ? t.call(e, i, a) : t
    }
    vjs.contains = function(e, t) {
        return e !== t && e.contains(t)
    };
    vjs.map = function(e, t) {
        var i, a = [], s, n;
        if (m(e))
            for (s = 0; s < e.length; s++) {
                i = t(e[s], s);
                if (i != null)
                    a.push(i)
            } else 
                for (n in e) {
                    i = t(e[n], n);
                    if (i != null)
                        a.push(i)
                }
        return a
    };
    vjs.each = function(e, t) {
        var i, a;
        if (m(e)) {
            for (i = 0; i < e.length; i++)
                if (t.call(this, i, e[i]) === false)
                    return e
        } else {
            for (a in e)
                if (t.call(this, a, e[a]) === false)
                    return e
        }
        return e
    };
    vjs.trim = function(e) {
        return e.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    };
    vjs.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
        o["[object " + t + "]"] = t.toLowerCase()
    });
    vjs.extend = function(e) {
        var t, i;
        e = e || {};
        t = e["init"] || e.init || this.prototype["init"] || this.prototype.init || function() {};
        i = function() {
            t.apply(this, arguments)
        };
        i.prototype = vjs.create(this.prototype);
        i.prototype.constructor = i;
        i.extend = vjs.extend;
        for (var a in e) {
            if (e.hasOwnProperty(a)) {
                i.prototype[a] = e[a]
            }
        }
        return i
    };
    vjs.create = function(e) {
        function t() {}
        t.prototype = e;
        return new t
    };
    vjs.getWinWH = function() {
        var e = window.innerWidth, t = window.innerHeight;
        if (typeof e != "number") {
            if (document.compatMode == "CSS1Compat") {
                e = document.documentElement.clientWidth;
                t = document.documentElement.clientHeight
            } else {
                e = document.body.clientWidth;
                t = document.body.clientHeight
            }
        }
        return {
            width: e,
            height: t
        }
    };
    vjs.safari = c.safari;
    return vjs
});
define("core.event", function(e, t, i) {
    var a = [].slice, s = /\s+/, n = function() {
        return false
    }, o = function() {
        return true
    };
    function r(e, t, i) {
        (e || "").split(s).forEach(function(e) {
            i(e, t)
        })
    }
    function d(e) {
        return new RegExp("(?:^| )" + e.replace(" ", " .* ?") + "(?: |$)")
    }
    function l(e) {
        var t = ("" + e).split(".");
        return {
            e: t[0],
            ns: t.slice(1).sort().join(" ")
        }
    }
    function c(e, t, i, a) {
        var s, n;
        n = l(t);
        n.ns && (s = d(n.ns));
        return e.filter(function(e) {
            return e && (!n.e || e.e === n.e) && (!n.ns || s.test(e.ns)) && (!i || e.cb === i || e.cb._cb === i) && (!a || e.ctx === a)
        })
    }
    function h(e, t) {
        if (!(this instanceof h)) {
            return new h(e, t)
        }
        t && $.extend(this, t);
        this.type = e;
        return this
    }
    h.prototype = {
        isDefaultPrevented: n,
        isPropagationStopped: n,
        preventDefault: function() {
            this.isDefaultPrevented = o
        },
        stopPropagation: function() {
            this.isPropagationStopped = o
        }
    };
    var p = {
        on: function(e, t, i) {
            var a = this, s;
            if (!t) {
                return this
            }
            s = this._events || (this._events = []);
            r(e, t, function(e, t) {
                var n = l(e);
                n.cb = t;
                n.ctx = i;
                n.ctx2 = i || a;
                n.id = s.length;
                s.push(n)
            });
            return this
        },
        one: function(e, t, i) {
            var a = this;
            if (!t) {
                return this
            }
            r(e, t, function(e, t) {
                var s = function() {
                    a.off(e, s);
                    return t.apply(i || a, arguments)
                };
                s._cb = t;
                a.on(e, s, i)
            });
            return this
        },
        off: function(e, t, i) {
            var a = this._events;
            if (!a) {
                return this
            }
            if (!e&&!t&&!i) {
                this._events = [];
                return this
            }
            r(e, t, function(e, t) {
                c(a, e, t, i).forEach(function(e) {
                    delete a[e.id]
                })
            });
            return this
        },
        trigger: function(e) {
            var t =- 1, i, s, n, o, r;
            if (!this._events ||!e) {
                return this
            }
            typeof e === "string" && (e = new h(e));
            i = a.call(arguments, 1);
            e.args = i;
            s = c(this._events, e.type);
            if (s) {
                o = s.length;
                while (++t < o) {
                    if ((n = e.isPropagationStopped()) || false === (r = s[t]).cb.call(r.ctx2, e)) {
                        n || (e.stopPropagation(), e.preventDefault());
                        break
                    }
                }
            }
            return this
        }
    };
    i.exports = p
});
define("extend.detect", function(e, t, i) {
    var a;
    (function() {
        var e = navigator.userAgent.toLowerCase();
        a = {
            iPhone: /iphone/.test(e),
            iPad: /ipad/.test(e),
            iPod: /ipod/.test(e),
            isLetv: /letv/.test(e),
            Android: /android/.test(e),
            AndroidPad: /android/.test(e)&&!/mobile/.test(e),
            atwin: /win/.test(e),
            opera: /opera/.test(e),
            msie: /msie/.test(e),
            firefox: /firefox/.test(e),
            safari: /safari/.test(e)&&!/chrome/.test(e),
            wph: /windows phone/.test(e),
            ps: /playstation/.test(e),
            uc: /ucbrowser|ucweb/.test(e),
            xiaomi: /xiaomi/.test(e)
        };
        var t = /(webkit)[ \/]([\w.]+)/, i = /(opera)(?:.*version)?[ \/]([\w.]+)/, s = /(msie) ([\w.]+)/, n = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var o = t.exec(e) || i.exec(e) || s.exec(e) || e.indexOf("compatible") < 0 && n.exec(e) || [];
        a.version = o[2] || "0"
    })();
    i.exports = a
});
define("extend.lib", function(e, t, i) {
    var a = Function.prototype.bind, s = Array.prototype.slice;
    i.exports = {
        getParamVal: function(e, t) {
            var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i");
            var a = e.match(i);
            if (a != null)
                return unescape(a[2]);
            return ""
        },
        inheritFrom: function(e, t) {
            var i = function() {};
            i.prototype = e.prototype;
            t.prototype = new i;
            t.prototype.constructor = t;
            t.superclass = e.prototype;
            if (e.prototype.constructor == Object.prototype.constructor) {
                e.prototype.constructor = e
            }
        },
        merge: function(e, t, i) {
            if (!t) {
                t = {}
            }
            for (var a in t) {
                if (t.hasOwnProperty(a) && (!i ||!e.hasOwnProperty(a))) {
                    e[a] = t[a]
                }
            }
            return e
        },
        setCookie: function(e, t, i) {
            i = i || {};
            if (t === null) {
                t = "";
                i.expires =- 1
            }
            var a = "";
            if (i.expires && (typeof i.expires == "number" || i.expires.toUTCString)) {
                var s;
                if (typeof i.expires == "number") {
                    s = new Date;
                    s.setTime(s.getTime() + i.expires * 24 * 60 * 60 * 1e3)
                } else {
                    s = i.expires
                }
                a = "; expires=" + s.toUTCString()
            }
            var n = i.path ? "; path=" + i.path: "";
            var o = i.domain ? "; domain=" + i.domain: "";
            var r = i.secure ? "; secure": "";
            document.cookie = [e, "=", encodeURIComponent(t), a, n, o, r].join("")
        },
        getCookie: function(e) {
            var t, i = new RegExp("(^| )" + e + "=([^;]*)(;|$)");
            if (t = document.cookie.match(i))
                return unescape(t[2]);
            else 
                return ""
        },
        getJSON: function(e, t, i, a, s) {
            var n = this.now(), o = "vjs_" + n, r = "$1" + o + "$2", d = 0, l = 0, c = this, h, p = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            if (!/_r=/i.test(e))
                e += "&_r=?";
            e = e.replace(/(\=)\?(&|$)|\?\?/i, r);
            logger.log("URL:" + e);
            a = a || 5e3;
            s = s || 2;
            window[o] = function(e) {
                f();
                vjs.responseTime = c.now() - n;
                vjs.retryCount = d;
                t.call(this, e, {
                    responseTime: c.now() - n,
                    retryCount: d
                });
                window[o] = null
            };
            var f = function() {
                clearTimeout(l);
                if (h && h.parentNode) {
                    p.removeChild(h);
                    h.onload = h.onreadystatechange = null;
                    h = undefined
                }
            };
            var u = function() {
                f();
                if (d >= s) {
                    clearTimeout(l);
                    window[o] = null;
                    i && i.call(this);
                    return 
                }
                e = e.replace(/&_r=[\d|\?]+/i, "&_r=" + d);
                h = document.createElement("script");
                h.setAttribute("type", "text/javascript");
                h.setAttribute("src", e);
                h.onload = h.onreadystatechange = function(e) {
                    clearTimeout(l)
                };
                p.insertBefore(h, p.firstChild);
                l = setTimeout(u, a);
                d++
            };
            u()
        },
        timer: function(e, t) {
            var i = 0, a = false, s;
            return {
                repeatCount: function() {
                    return i
                },
                delay: function() {
                    return e
                },
                running: function() {
                    return a
                },
                start: function() {
                    s && clearInterval(s);
                    i = 0;
                    a = true;
                    s = setInterval(function() {
                        i++;
                        if (t)
                            t()
                    }, e)
                },
                stop: function() {
                    clearInterval(s);
                    a = false
                },
                reset: function() {
                    i = 0;
                    s || this.start()
                }
            }
        },
        bind: function(e, t) {
            if (e.bind === a && a)
                return a.apply(e, s.call(arguments, 1));
            var i = s.call(arguments, 2);
            return function() {
                return e.apply(t, i.concat(s.call(arguments)))
            }
        },
        createElement: function(e, t) {
            var i = document.createElement(e), a;
            for (a in t) {
                if (t.hasOwnProperty(a)) {
                    if (a.indexOf("-")!==-1) {
                        i.setAttribute(a, t[a])
                    } else {
                        i[a] = t[a]
                    }
                }
            }
            return i
        },
        now: Date.now || function() {
            return + new Date
        },
        formatTime: function(e) {
            var t = Math.floor(e / 60);
            t = t < 10 ? "0" + t : t.toString();
            var i = Math.floor(e%60);
            i = i < 10 ? "0" + i : i.toString();
            return t + ":" + i
        }
    }
});
define("extend.md5", function(e, t, i) {
    return function(e) {
        function t(e, t) {
            return e<<t | e>>>32 - t
        }
        function i(e, t) {
            var i, a, s, n, o;
            s = e & 2147483648;
            n = t & 2147483648;
            i = e & 1073741824;
            a = t & 1073741824;
            o = (e & 1073741823) + (t & 1073741823);
            if (i & a) {
                return o^2147483648^s^n
            }
            if (i | a) {
                if (o & 1073741824) {
                    return o^3221225472^s^n
                } else {
                    return o^1073741824^s^n
                }
            } else {
                return o^s^n
            }
        }
        function a(e, t, i) {
            return e & t|~e & i
        }
        function s(e, t, i) {
            return e & i | t&~i
        }
        function n(e, t, i) {
            return e^t^i
        }
        function o(e, t, i) {
            return t^(e|~i)
        }
        function r(e, s, n, o, r, d, l) {
            e = i(e, i(i(a(s, n, o), r), l));
            return i(t(e, d), s)
        }
        function d(e, a, n, o, r, d, l) {
            e = i(e, i(i(s(a, n, o), r), l));
            return i(t(e, d), a)
        }
        function l(e, a, s, o, r, d, l) {
            e = i(e, i(i(n(a, s, o), r), l));
            return i(t(e, d), a)
        }
        function c(e, a, s, n, r, d, l) {
            e = i(e, i(i(o(a, s, n), r), l));
            return i(t(e, d), a)
        }
        function h(e) {
            var t;
            var i = e.length;
            var a = i + 8;
            var s = (a - a%64) / 64;
            var n = (s + 1) * 16;
            var o = Array(n-1);
            var r = 0;
            var d = 0;
            while (d < i) {
                t = (d - d%4) / 4;
                r = d%4 * 8;
                o[t] = o[t] | e.charCodeAt(d)<<r;
                d++
            }
            t = (d - d%4) / 4;
            r = d%4 * 8;
            o[t] = o[t] | 128<<r;
            o[n-2] = i<<3;
            o[n-1] = i>>>29;
            return o
        }
        function p(e) {
            var t = "", i = "", a, s;
            for (s = 0; s <= 3; s++) {
                a = e>>>s * 8 & 255;
                i = "0" + a.toString(16);
                t = t + i.substr(i.length-2, 2)
            }
            return t
        }
        function f(e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var i = 0; i < e.length; i++) {
                var a = e.charCodeAt(i);
                if (a < 128) {
                    t += String.fromCharCode(a)
                } else if (a > 127 && a < 2048) {
                    t += String.fromCharCode(a>>6 | 192);
                    t += String.fromCharCode(a & 63 | 128)
                } else {
                    t += String.fromCharCode(a>>12 | 224);
                    t += String.fromCharCode(a>>6 & 63 | 128);
                    t += String.fromCharCode(a & 63 | 128)
                }
            }
            return t
        }
        var u = Array();
        var v, g, b, m, _, y, x, T, k;
        var w = 7, E = 12, P = 17, S = 22;
        var A = 5, D = 9, C = 14, L = 20;
        var I = 4, j = 11, V = 16, B = 23;
        var O = 6, M = 10, R = 15, N = 21;
        e = f(e);
        u = h(e);
        y = 1732584193;
        x = 4023233417;
        T = 2562383102;
        k = 271733878;
        for (v = 0; v < u.length; v += 16) {
            g = y;
            b = x;
            m = T;
            _ = k;
            y = r(y, x, T, k, u[v + 0], w, 3614090360);
            k = r(k, y, x, T, u[v + 1], E, 3905402710);
            T = r(T, k, y, x, u[v + 2], P, 606105819);
            x = r(x, T, k, y, u[v + 3], S, 3250441966);
            y = r(y, x, T, k, u[v + 4], w, 4118548399);
            k = r(k, y, x, T, u[v + 5], E, 1200080426);
            T = r(T, k, y, x, u[v + 6], P, 2821735955);
            x = r(x, T, k, y, u[v + 7], S, 4249261313);
            y = r(y, x, T, k, u[v + 8], w, 1770035416);
            k = r(k, y, x, T, u[v + 9], E, 2336552879);
            T = r(T, k, y, x, u[v + 10], P, 4294925233);
            x = r(x, T, k, y, u[v + 11], S, 2304563134);
            y = r(y, x, T, k, u[v + 12], w, 1804603682);
            k = r(k, y, x, T, u[v + 13], E, 4254626195);
            T = r(T, k, y, x, u[v + 14], P, 2792965006);
            x = r(x, T, k, y, u[v + 15], S, 1236535329);
            y = d(y, x, T, k, u[v + 1], A, 4129170786);
            k = d(k, y, x, T, u[v + 6], D, 3225465664);
            T = d(T, k, y, x, u[v + 11], C, 643717713);
            x = d(x, T, k, y, u[v + 0], L, 3921069994);
            y = d(y, x, T, k, u[v + 5], A, 3593408605);
            k = d(k, y, x, T, u[v + 10], D, 38016083);
            T = d(T, k, y, x, u[v + 15], C, 3634488961);
            x = d(x, T, k, y, u[v + 4], L, 3889429448);
            y = d(y, x, T, k, u[v + 9], A, 568446438);
            k = d(k, y, x, T, u[v + 14], D, 3275163606);
            T = d(T, k, y, x, u[v + 3], C, 4107603335);
            x = d(x, T, k, y, u[v + 8], L, 1163531501);
            y = d(y, x, T, k, u[v + 13], A, 2850285829);
            k = d(k, y, x, T, u[v + 2], D, 4243563512);
            T = d(T, k, y, x, u[v + 7], C, 1735328473);
            x = d(x, T, k, y, u[v + 12], L, 2368359562);
            y = l(y, x, T, k, u[v + 5], I, 4294588738);
            k = l(k, y, x, T, u[v + 8], j, 2272392833);
            T = l(T, k, y, x, u[v + 11], V, 1839030562);
            x = l(x, T, k, y, u[v + 14], B, 4259657740);
            y = l(y, x, T, k, u[v + 1], I, 2763975236);
            k = l(k, y, x, T, u[v + 4], j, 1272893353);
            T = l(T, k, y, x, u[v + 7], V, 4139469664);
            x = l(x, T, k, y, u[v + 10], B, 3200236656);
            y = l(y, x, T, k, u[v + 13], I, 681279174);
            k = l(k, y, x, T, u[v + 0], j, 3936430074);
            T = l(T, k, y, x, u[v + 3], V, 3572445317);
            x = l(x, T, k, y, u[v + 6], B, 76029189);
            y = l(y, x, T, k, u[v + 9], I, 3654602809);
            k = l(k, y, x, T, u[v + 12], j, 3873151461);
            T = l(T, k, y, x, u[v + 15], V, 530742520);
            x = l(x, T, k, y, u[v + 2], B, 3299628645);
            y = c(y, x, T, k, u[v + 0], O, 4096336452);
            k = c(k, y, x, T, u[v + 7], M, 1126891415);
            T = c(T, k, y, x, u[v + 14], R, 2878612391);
            x = c(x, T, k, y, u[v + 5], N, 4237533241);
            y = c(y, x, T, k, u[v + 12], O, 1700485571);
            k = c(k, y, x, T, u[v + 3], M, 2399980690);
            T = c(T, k, y, x, u[v + 10], R, 4293915773);
            x = c(x, T, k, y, u[v + 1], N, 2240044497);
            y = c(y, x, T, k, u[v + 8], O, 1873313359);
            k = c(k, y, x, T, u[v + 15], M, 4264355552);
            T = c(T, k, y, x, u[v + 6], R, 2734768916);
            x = c(x, T, k, y, u[v + 13], N, 1309151649);
            y = c(y, x, T, k, u[v + 4], O, 4149444226);
            k = c(k, y, x, T, u[v + 11], M, 3174756917);
            T = c(T, k, y, x, u[v + 2], R, 718787259);
            x = c(x, T, k, y, u[v + 9], N, 3951481745);
            y = i(y, g);
            x = i(x, b);
            T = i(T, m);
            k = i(k, _)
        }
        var U = p(y) + p(x) + p(T) + p(k);
        return U.toLowerCase()
    }
});
define("extend.fullscreen", function(e, t, i) {
    var a = function(e) {
        var i = ["webkit", "moz"];
        var a, s, n, o;
        for (var r = 0, d = i.length; r < d; r++) {
            var l = i[r] + "RequestFullScreen", c = i[r] + "CancelFullScreen";
            if (typeof e[l] == "function") {
                a = l;
                n = e
            }
            if (typeof document[c] == "function") {
                s = c;
                o = document
            }
        }
        if (!a && typeof e["webkitEnterFullScreen"] == "function") {
            a = "webkitEnterFullScreen";
            n = e
        }
        if (!s && typeof e["webkitExitFullScreen"] == "function") {
            s = "webkitExitFullScreen";
            o = e
        }
        t.requestFn = a;
        t.requestEl = n;
        t.cancelFn = s;
        t.cancelEl = o
    };
    t.checkFullScreenFn = a
});
define("extend.touchable", function(e, t, i) {
    var a = e("extend.lib"), s = e("core.event");
    var n = function(e, t) {
        this.node = e;
        this.inDoubleTap = false;
        this.isOneFingerGesture = false;
        this.doubleTapTimer = null;
        this.longTapTimer = null;
        t = t || {};
        this.startTouch = {
            x: 0,
            y: 0
        };
        this.currentTouch = {
            x: 0,
            y: 0
        };
        this.previousTouch = {
            x: 0,
            y: 0
        };
        this.currentDelta = {
            x: 0,
            y: 0
        };
        this.currentStartDelta = {
            x: 0,
            y: 0
        };
        this.eventNode = t.isTargetNode ? this.node : document;
        this.touchStartFn = a.bind(this.touchStart, this);
        this.touchMoveFn = a.bind(this.touchMove, this);
        this.touchEndFn = a.bind(this.touchEnd, this);
        if (vjs.isDebug) {
            this.node.addEventListener("mousedown", this.touchStartFn, false)
        } else {
            this.node.addEventListener("touchstart", this.touchStartFn, false)
        }
    };
    n.prototype = {
        touchStart: function(e) {
            var t = this;
            this.reset();
            if (e.touches) {
                if (!e.touches.length || this.isCurrentlyTouching) {
                    return false
                }
                this.isCurrentlyTouching = true;
                this.isOneFingerGesture = e.touches.length == 1;
                if (e.touches.length == 1) {
                    this.startTouch.x = this.currentTouch.x = e.touches[0].clientX;
                    this.startTouch.y = this.currentTouch.y = e.touches[0].clientY
                } else if (e.touches.length > 1) {
                    var i = [];
                    for (var a = 0, s = e.touches.length; a < s; a++) {
                        i.push(e.touches[a])
                    }
                    i.sort(o);
                    var s = i.length-1;
                    this.startTouch.x = this.currentTouch.x = i[s].clientX;
                    this.startTouch.y = this.currentTouch.y = i[s].clientY
                }
                this.eventNode.addEventListener("touchmove", this.touchMoveFn, false);
                this.eventNode.addEventListener("touchend", this.touchEndFn, false)
            } else {
                this.startTouch.x = this.currentTouch.x = e.pageX;
                this.startTouch.y = this.currentTouch.y = e.pageY;
                this.eventNode.addEventListener("mousemove", this.touchMoveFn, false);
                this.eventNode.addEventListener("mouseup", this.touchEndFn, false)
            }
            this.target = e.target;
            this.currentTarget = e.currentTarget;
            this.hitTarget = document.elementFromPoint ? document.elementFromPoint(this.startTouch.x, this.startTouch.y) : null;
            if (!this.inDoubleTap) {
                this.inDoubleTap = true;
                this.doubleTapTimer = setTimeout(function() {
                    t.inDoubleTap = false
                }, 500)
            } else {
                this.trigger("doubleTouch", this);
                clearTimeout(t.doubleTapTimer);
                this.inDoubleTap = false
            }
            this.longTapTimer = setTimeout(function() {
                t.trigger("longTouch", t)
            }, 1e3);
            this.trigger("touchstart", this, e)
        },
        touchMove: function(e) {
            this.previousTouch.x = this.currentTouch.x;
            this.previousTouch.y = this.currentTouch.y;
            if (e.touches) {
                if (!e.touches.length ||!this.isOneFingerGesture)
                    return;
                if (e.touches.length > 1) {
                    this.isOneFingerGesture = false;
                    return 
                }
                this.currentTouch.x = e.touches[0].clientX;
                this.currentTouch.y = e.touches[0].clientY
            } else {
                this.currentTouch.x = e.pageX;
                this.currentTouch.y = e.pageY
            }
            this.currentDelta.x = this.currentTouch.x - this.previousTouch.x;
            this.currentDelta.y = this.currentTouch.y - this.previousTouch.y;
            this.currentStartDelta.x = this.currentTouch.x - this.startTouch.x;
            this.currentStartDelta.y = this.currentTouch.y - this.startTouch.y;
            this.target = e.target;
            this.currentTarget = e.currentTarget;
            this.trigger("touchmove", this, e);
            if (this.longTapTimer)
                clearTimeout(this.longTapTimer)
        },
        touchEnd: function(e) {
            if (e.touches) {
                if (e.targetTouches.length)
                    return;
                this.eventNode.removeEventListener("touchmove", this.touchMoveFn, false);
                this.eventNode.removeEventListener("touchend", this.touchEndFn, false)
            } else {
                this.eventNode.removeEventListener("mousemove", this.touchMoveFn, false);
                this.eventNode.removeEventListener("mouseup", this.touchEndFn, false)
            }
            this.isCurrentlyTouching = false;
            if (this.longTapTimer)
                clearTimeout(this.longTapTimer);
            this.trigger("touchend", this, e)
        },
        reset: function() {
            this.startTouch = {
                x: 0,
                y: 0
            };
            this.currentTouch = {
                x: 0,
                y: 0
            };
            this.previousTouch = {
                x: 0,
                y: 0
            };
            this.currentDelta = {
                x: 0,
                y: 0
            };
            this.currentStartDelta = {
                x: 0,
                y: 0
            }
        }
    };
    a.merge(n.prototype, s);
    function o(e, t) {
        return e.clientY - t.clientY
    }
    i.exports = n
});
define("extend.storage", function(e, t, i) {
    var a, s = Object.toJSON || window.JSON && (JSON.encode || JSON.stringify), n = window.JSON && (JSON.decode || JSON.parse) || function(e) {
        return String(e).evalJSON()
    };
    try {
        if ("localStorage"in window)
            a = window.localStorage;
        else if ("globalStorage"in window)
            a = window.globalStorage[window.location.hostname]
    } catch (o) {}
    var r = function(e, t) {
        try {
            a.removeItem(e);
            var i = s(t);
            a.setItem(e, i)
        } catch (n) {
            a[e] = s(t)
        }
    };
    var d = function(e, t) {
        if (e in a) {
            try {
                return n(a.getItem(e))
            } catch (i) {
                return n(a[e])
            }
        }
        return typeof t == "undefined" ? null : t
    };
    i.exports = {
        set: r,
        get: d
    }
});
define("module.h5player", function(e, t, i) {
    var a = e("core.vjs"), s = e("./h5model"), n = e("extend.lib"), o = e("core.event"), r = e("view.tpl"), d = e("./user"), l = e("./controller"), c = e("proxy.pingback").instances, h = e("proxy.history").instances;
    var p = {};
    function f(e) {
        p[e.cont] = this;
        this.options = e;
        this.init(e)
    }
    f.prototype = {
        init: function(e) {
            this.model = new s.H5Model(e);
            this.loadCss();
            this.controller = new l(this.model);
            var t = this.model.option;
            if (t.flashvar && t.flashvar.callbackJs) {
                var i = t.flashvar.callbackJs;
                this.IPlayer = new Function("status", "data", i + "(status,data)")
            }
            this.pingback = c[t.cont];
            this.history = h[t.cont];
            this.pingback.sendEnv();
            this.evt = this.model.events;
            this.evt.on("setVideoEnable TO_PlayNext Player_Callback", this.listNotification, this);
            this.controller.playMovie()
        },
        listNotification: function(e) {
            switch (e.type) {
            case"setVideoEnable":
                this.enabled = e.args[0];
                if (this.enabled)
                    this.enable();
                else 
                    this.disable();
                break;
            case"TO_PlayNext":
                this.playNext();
                break;
            case"Player_Callback":
                var t = e.args[0], i = e.args.slice(1);
                if (i && i.length == 1)
                    i = i[0];
                this.callback(t, i);
                break
            }
        },
        enable: function() {
            this.evt.on("error playing ended pause durationchange", this.onVideoEvent, this);
            this.evt.on("play canplay durationchange", this.onCanplay, this)
        },
        disable: function() {
            this.evt.off("error playing ended pause durationchange", this.onVideoEvent, this);
            this.evt.off("play canplay durationchange", this.onCanplay, this)
        },
        callback: function(e, t) {
            if (!t)
                t = {};
            if (this.IPlayer) {
                try {
                    this.IPlayer(e, t)
                } catch (i) {}
            }
            if (this.controller.ad) {
                try {
                    this.controller.ad.changeStatus(e, t)
                } catch (i) {}
            }
        },
        onVideoEvent: function(e) {
            switch (e.type) {
            case"error":
                this.callback("PLAYER_VIDEO_PAUSE");
                break;
            case"playing":
                this.pingback.startRecord();
                this.callback("PLAYER_VIDEO_RESUME");
                break;
            case"ended":
                this.history.stopRecord();
                this.history.flush(-1);
                this.pingback.stopRecord();
                this.pingback.flush();
                if (this.model.option.isTrylook) {
                    return 
                }
                this.pingback.sendPlayAction("end", "err=0&pt=-&ut=-&ry=0&vt=" + this.model.vinfo.vtype);
                this.playNext();
                break;
            case"onPause":
                this.pingback.stopRecord();
                this.callback("PLAYER_VIDEO_PAUSE");
                break
            }
        },
        onCanplay: function() {
            if (!this.sended) {
                this.sended = true;
                this.pingback.onVideoPlayStart();
                this.callback("PLAYER_VIDEO_PLAY")
            }
            this.evt.off("play canplay durationchange", this.onCanplay, this)
        },
        playNext: function() {
            this.callback("PLAYER_VIDEO_COMPLETE");
            if (typeof window.nextVideoSrc != "undefined" && window.nextVideoSrc.length > 1) {
                window.location.href = window.nextVideoSrc
            } else {
                var e = this.model.vinfo;
                if (e.nextvid > 0 && e.nextvid != e.vid && this.model.option.pname != "MPlayer")
                    window.location.href = "http://www.letv.com/ptv/vplay/" + e.nextvid + ".html"
            }
        },
        playMovie: function(t) {
            logger.log("playMovie:" + t);
            if (!t) {
                this.evt.trigger("changeFullScreen", false);
                return 
            }
            e("./stat").uuid = false;
            this.evt.trigger("TO_Pause");
            this.disable();
            this.sended = false;
            t.up = 1;
            n.merge(this.model.vinfo, t);
            this.controller.playMovie()
        },
        pause: function() {
            this.evt.trigger("TO_Pause")
        },
        play: function() {
            this.evt.trigger("TO_Play")
        },
        resize: function() {
            this.evt.trigger("TO_Resize")
        },
        getCurrTime: function() {
            return this.controller.getCurrentTime()
        },
        changeDefi: function(e) {
            this.model.option.defaultDefi = e;
            this.evt.trigger("TO_RateChanged", e, true)
        },
        loadCss: function() {
            var e = document.head || document.getElementsByTagName("head")[0] || document.documentElement, t = document.createElement("style");
            t.setAttribute("type", "text/css");
            t.innerHTML = r.getCss(this.model.tplType);
            e.appendChild(t)
        }
    };
    window.h5player = {
        playMovie: function(e) {
            a.each.call(f, p, function(t, i) {
                i.playMovie(e)
            })
        },
        pause: function() {
            a.each.call(f, p, function(e, t) {
                t.pause()
            })
        },
        play: function() {
            a.each.call(f, p, function(e, t) {
                t.play()
            })
        },
        resize: function() {
            a.each.call(f, p, function(e, t) {
                t.resize()
            })
        },
        getCurrTime: function() {
            for (var e in p) {
                return p[e].getCurrTime()
            }
        },
        changeDefi: function(e) {
            a.each.call(f, p, function(t, i) {
                i.changeDefi(e)
            })
        }
    };
    i.exports = f
});
define("module.h5model", function(e, t, i) {
    var a = e("extend.lib"), s = e("extend.detect"), n = e("core.event"), o = {}, r;
    function d(e) {
        a.merge(e, h);
        a.merge(e, e.extInfo);
        var t = e.flashvar = c(e.flashvar);
        var i = {};
        if (typeof __INFO__ != "undefined" && __INFO__ && __INFO__.video) {
            a.merge(i, __INFO__.video)
        }
        if (typeof e.isMember == "undefined")
            e.isMember = i.trylook == 10 ? 1 : 0;
        e.pid = i.pid;
        i.vid = i.vid || t.id || t.vid || "";
        i.mmsid = i.mmsid || t.mmsid || "";
        i.cid = i.cid || t.cid || "";
        i.ark = i.ark || t.ark || "";
        if (t.callbackJs) {
            this.IPlayer = new Function("status", "data", t.callbackJs + "(status,data)")
        }
        if (t.autoplay) {
            e.isAutoPlay = Boolean(t.autoplay !== "0")
        }
        if (t.rate) {
            var d = {
                350: 1,
                800: 2,
                1300: 3
            };
            if (d[t.rate])
                e.defaultDefi = d[t.rate]
        }
        if (t.streamid) {
            e.isLive = true;
            e.pname = e.pname || "live";
            i.cid = i.cid || "test";
            i.streamid = t.streamid
        }
        if (t.picStartUrl) {
            i.poster = t.picStartUrl
        }
        if (i.defi)
            e.defaultDefi = i.defi;
        else if (e.pname == "LePai")
            e.defaultDefi = "2";
        else if (s.isLetv)
            e.defaultDefi = "3";
        if (s.iPhone) {
            e.tplType = "IPhone"
        } else if (e.pname == "MPlayer") {
            if (!e.isLive) {
                e.tplType = "minBase"
            } else {
                e.tplType = "minLive"
            }
        } else {
            if (!e.isLive) {
                var l = vjs.getWinWH();
                e.tplType = Math.min(l.width, l.height) > 320 ? "base" : "minBase"
            } else {
                e.tplType = "live"
            }
        }
        switch (e.tplType) {
        case"live":
            e.children = {
                controlBar: "view.liveControlBar",
                playingPannel: "view.livePlayingPannel",
                popTip: "view.popTip",
                tip: "view.tip"
            };
            break;
        case"minLive":
            e.children = {
                controlBar: "view.minLiveControlBar",
                playingPannel: "view.livePlayingPannel",
                popTip: "view.popTip"
            };
            break;
        case"minBase":
            e.children = {
                controlBar: "view.minControlBar",
                playingPannel: "view.minPlayingPannel",
                popTip: "view.popTip"
            };
            break;
        case"IPhone":
            e.children = {
                playingPannel: "view.iphonePlayingPannel",
                popTip: "view.popTip"
            };
            break;
        case"base":
            e.children = {
                controlBar: "view.controlBar",
                playingPannel: "view.playingPannel",
                popTip: "view.popTip",
                tip: "view.tip"
            };
            break
        }
        var p = a.merge({}, n);
        var f = {
            option: e,
            vinfo: i,
            events: p
        };
        r = e.cont;
        o[r] = f;
        return f
    }
    var l = function(e) {
        if (typeof e === "undefined") {
            if (o && o[r])
                return o[r]
        } else if (o && o[e]) {
            return o[e]
        }
        return null
    };
    var c = function(e) {
        var t = {}, i, a = e.split("&");
        a.forEach(function(e) {
            i = e.split("=");
            if (i != null)
                t[i[0]] = unescape(i[1])
        });
        return t
    };
    var h = {
        version: "2.0.18",
        defaultDefi: "2"
    };
    i.exports = {
        H5Model: d,
        getModel: l,
        cont: r
    }
});
define("module.stat", function(e, t, i) {
    var a = e("extend.lib");
    i.exports = {
        getUUID: function() {
            if (!this.uuid) {
                this.uuid = "1" + String((new Date).getTime()).slice(4) + String(Math.random()).slice(-6)
            }
            return this.uuid
        },
        getLC: function() {
            if (!this.lc) {
                if (typeof Stats != "undefined" && typeof Stats.getLC == "function") {
                    this.lc = Stats.getLC()
                } else {
                    var e = a.getCookie("tj_lc");
                    if (!e) {
                        var e = "", t = 32;
                        while (t--) {
                            e += Math.floor(Math.random() * 16).toString(16)
                        }
                        var i = new Date;
                        i.setFullYear(i.getFullYear() + 20);
                        a.setCookie("tj_lc", e, {
                            expires: i,
                            domain: ".letv.com",
                            path: "/"
                        })
                    }
                    this.lc = e
                }
            }
            return this.lc
        },
        getWeid: function() {
            if (typeof Stats != "undefined" && typeof Stats.WEID != "undefined") {
                return Stats.WEID
            } else {
                return "5" + (new Date).getTime() + String(Math.random()).slice(-10)
            }
        }
    }
});
define("module.user", function(e, t, i) {
    var a = e("extend.lib");
    var s = {
        getUserInfo: function(e, t, i, s) {
            var n = a.getCookie("ssouid"), o = a.getCookie("m");
            if (!n ||!o) {
                s();
                return 
            }
            var r = "http://yuanxian.letv.com/letv/";
            if (!t.isLive) {
                if (!e.pid) {
                    s();
                    return 
                }
                r += "getService.ldo?callback=?&from=player&end=5&pid=" + e.pid + "&ssouid=" + n + "&uname=" + o
            } else {
                r += "vip.ldo?callback=?&type=vipInfo&userId=" + n
            }
            a.getJSON(r, function(e) {
                var t;
                if (!e.values) {
                    t = e
                } else {
                    if (e.code === 1 && typeof e.values.vipInfo !== "undefined") {
                        t = e.values.vipInfo;
                        var a = t.vipType;
                        t.vip=!a || a == 3 ? 0 : a
                    }
                }
                i(t)
            }, function() {
                s()
            }, 2e3, 1)
        }
    };
    i.exports = s
});
define("module.controller", function(e, t, i) {
    var a = e("core.vjs"), s = e("core.event"), n = e("extend.lib"), o = e("extend.detect"), r = e("./coreVideo"), d = e("view.component"), l = e("module.user"), c = e("proxy.pingback").pingback, h = e("proxy.history").history;
    function p(e) {
        this.model = e;
        this.init();
        this.initEvt()
    }
    p.prototype = {
        init: function() {
            this.evt = this.model.events;
            this.pingback = new c(this.model);
            this.history = new h(this.model);
            this.comp = new d(this.model);
            this.core = new r(this.model);
            this.comp.__proto__.core = this.core;
            this.history.__proto__.core = this.core
        },
        initEvt: function() {
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("TO_RateChanged", this.onRateChanged, this);
            this.evt.on("TO_UseTicket", this.onUseTicket, this);
            this.evt.on("tryLookEnd", this.onTryLookEnd, this)
        },
        playVideo: function() {
            this.evt.trigger("TO_Stop");
            this.evt.trigger("setVideoEnable", true);
            this.evt.trigger("TO_RateChanged", this.defi, false);
            this.history.startRecord();
            this.pingback.startRecord()
        },
        playMovie: function() {
            this.sended = false;
            this.evt.trigger("setVideoEnable", false);
            this.evt.trigger("setVideoVisiable", true);
            l.getUserInfo(this.model.vinfo, this.model.option, n.bind(this.userSucc, this), n.bind(this.userFail, this))
        },
        userSucc: function(e) {
            this.userInfo = e;
            this.checkUserAuth()
        },
        userFail: function() {
            this.userInfo = undefined;
            this.checkUserAuth()
        },
        checkUserAuth: function() {
            var e = this.model.vinfo;
            if (e.authtype == 1) {
                this.evt.trigger("showMessage", "authBan");
                return 
            }
            this.changeTrylook(false);
            if (e.trylook == 10) {
                if (typeof this.userInfo == "undefined" || this.userInfo.status !== 1) {
                    this.changeTrylook(true);
                    this.evt.trigger("showTip", "trylook");
                    this.evt.trigger("Player_Callback", "TRYLOOK_TIP", this.userInfo)
                }
            }
            if (!this.model.option.isLive) {
                this.core.playTV(e.vid)
            } else {
                this.core.playLive(e.streamid)
            }
        },
        onMovieSucc: function(t) {
            var i = this.movieVO = t.args[0], a = this.model.vinfo;
            var s = this.model.option;
            var o, r = n.getCookie("defi"), d = s.defaultDefi;
            if (d && i[d])
                o = d;
            else if (r && i[r])
                o = r;
            else if (i["1"])
                o = "1";
            else if (i["2"])
                o = "2";
            else if (i["3"])
                o = "3";
            this.defi = o;
            a.vtype = i[o].vtype;
            a.isvip = this.userInfo && this.userInfo.vip ? this.userInfo.vip : 0;
            if (!this.sended) {
                this.sended = true;
                this.pingback.sendPlayAction("init", "err=0&pt=-&ut=-&ry=0&vt=" + a.vtype)
            }
            try {
                var l = e("module.ad");
                if (typeof l === "function"&&!this.hasPlayedAD&&!s.isTrylook) {
                    this.hasPlayedAD = true;
                    this.isPlayedAd = true;
                    this.ad = new l(this, this.model)
                } else {
                    this.playVideo();
                }
            } catch (t) {
                this.playVideo()
            }
        },
        onRateChanged: function(e) {
            var t = e.args[0], i = this.movieVO[t];
            if (!i)
                return;
            this.model.vinfo.vtype = i.vtype
        },
        reload: function(e) {
            if (e)
                n.merge(this.model.option, e);
            l.getUserInfo(this.model.vinfo, this.model.option, n.bind(this.userSucc, this), n.bind(this.userFail, this))
        },
        onUseTicket: function() {
            if (this.isClickTicket)
                return;
            this.isClickTicket = true;
            n.getJSON(this.userInfo.ticketurl + "&callback=?", n.bind(function(e) {
                this.isClickTicket = false;
                if (e.status == 1) {
                    if (typeof mainPlayer != "undefined") {
                        if (a(".js_video-info").length > 0) {
                            a(".js_play_con").removeClass("n-vip");
                            a(".js_video-info").setStyle("display", "none");
                            mainPlayer.reload({
                                width: 970
                            })
                        } else {
                            mainPlayer.reload()
                        }
                    } else {
                        this.reload()
                    }
                }
            }, this))
        },
        getCurrentTime: function() {
            if (!this.model.option.isLive) {
                return this.core.getCurrentTime()
            } else if (this.liveBar) {
                return this.liveBar.currentTime * 1e3
            } else {
                this.liveBar = this.comp.getChildren("view.widget.liveProgressBar");
                return this.liveBar.currentTime * 1e3
            }
        },
        changeTrylook: function(e) {
            this.model.option.isTrylook = e;
            this.comp.setTrylook(e);
            this.core.setTrylook(e)
        },
        onTryLookEnd: function() {
            if (typeof this.userInfo == "undefined") {
                this.evt.trigger("showMessage", "loginMembre")
            } else if (this.userInfo["ticketsize"] > 0) {
                this.evt.trigger("showMessage", "useTicket", this.userInfo)
            } else {
                this.evt.trigger("showMessage", "openMembre")
            }
            this.evt.trigger("Player_Callback", "TRYLOOK_End", this.userInfo)
        }
    };
    i.exports = p
});
define("module.coreVideo", function(e, t, i) {
    var a = e("extend.lib"), s = e("video.baseVideo"), n = e("proxy.pingback"), o = e("proxy.history");
    function r(e) {
        this.model = e;
        this.evt = this.model.events;
        this.pingback = n.instances[e.option.cont];
        this.history = o.instances[e.option.cont];
        this.streamEvent = "gslbScheduler waiting seeked RealSeeked setVideoVisiable showMessage";
        this.listEvnts = "TO_RateChanged TO_Refresh TO_Play TO_Pause TO_Seek TO_Stop";
        this.initVideo();
        this.evt.on("setVideoEnable setDuration changeFullScreen", this.changeVideoStatus, this);
        this.baseVideo.on("Fault", this.onFault, this)
    }
    r.prototype = {
        initVideo: function() {
            var e = this.model;
            var t = {
                vid: e.vinfo.vid,
                pid: e.vinfo.pid,
                pname: e.option.pname,
                isMember: e.option.isMember,
                events: e.events
            };
            if (e.option.isLive)
                t.isLive = true;
            this.baseVideo = new s(t);
            var i = this.model.dom;
            i.videoEl = i.parentEl.find("video");
            this.baseVideo.initialize(i.videoEl)
        },
        enable: function() {
            this.evt.on(this.streamEvent, this.onStreamEvent, this);
            this.evt.on(this.listEvnts, this.listNotification, this)
        },
        disable: function() {
            this.evt.off(this.streamEvent, this.onStreamEvent, this);
            this.evt.off(this.listEvnts, this.listNotification, this)
        },
        changeVideoStatus: function(e) {
            switch (e.type) {
            case"setVideoEnable":
                this.enabled = e.args[0];
                if (this.enabled)
                    this.enable();
                else 
                    this.disable();
                break;
            case"changeFullScreen":
                this.baseVideo.changeFull(e.args[0]);
                break;
            case"setDuration":
                this.model.vinfo.gdur = e.args[0];
                break
            }
        },
        listNotification: function(e) {
            switch (e.type) {
            case"TO_Play":
                this.baseVideo.play();
                break;
            case"TO_Pause":
                this.baseVideo.pause();
                break;
            case"TO_Stop":
                this.history.flush(this.getCurrentTime());
                this.baseVideo.stop();
                break;
            case"TO_Seek":
                this.baseVideo.seek(e.args[0]);
                break;
            case"TO_Refresh":
                this.baseVideo.seek(1);
                this.baseVideo.play();
                break;
            case"TO_RateChanged":
                this.isRateChange = e.args[1];
                if (this.isRateChange) {
                    var t = this.getCurrentTime();
                    if (!isNaN(t) && t > 0) {
                        this.seekTime = t;
                        this.history.flush(t)
                    }
                } else if (!this.model.option.isTrylook) {
                    var i = this.model.vinfo.gdur, a = this.getHistory();
                    if (isNaN(i) || a < i-15) {
                        this.seekTime = a
                    }
                }
                this.evt.on("loadeddata loadedmetadata", this.onStartLoad, this);
                this.baseVideo.changeDefi(e.args[0], this.isRateChange);
                this.evt.trigger("onVideoRateChanged", e.args[0]);
                break
            }
        },
        playTV: function(e) {
            this.baseVideo.playMovie(e)
        },
        playLive: function(e) {
            this.baseVideo.playLive(e)
        },
        onFault: function() {
            var e = this.baseVideo.getErrorStatus();
            this.pingback.sendError(e);
            this.evt.trigger("showMessage", e)
        },
        onStartLoad: function() {
            if (!this.model.option.isLive) {
                this.baseVideo.seek(this.seekTime || 0)
            }
            this.evt.off("loadeddata loadedmetadata", this.onStartLoad, this);
            this.pingback.sendPlayAction("cload", "err=0&pt=-&ut=-&ry=0&vt=" + this.model.vinfo.vtype)
        },
        onStreamEvent: function(e) {
            switch (e.type) {
            case"realSeeked":
                this.seekTime =- 1;
                break;
            case"gslbScheduler":
                var t = e.args[0];
                this.pingback.sendPlayAction("gslb", "err=0&pt=-&ut=" + t.responseTime + "&ry=" + t.retryCount + "&vt=" + this.model.vinfo.vtype, {
                    isRateChange: this.isRateChange
                });
                break;
            case"waiting":
                this.pingback.sendPlayAction("block", "err=0&pt=" + this.getCurrentTime() + "&ut=-&ry=0&vt=" + this.model.vinfo.vtype);
                break;
            case"seeked":
                var i = this.getCurrentTime();
                if (!isNaN(i) && i > 0 && i !== this.lastTime) {
                    this.lastTime = i;
                    this.history.flush(i)
                }
                break;
            case"showMessage":
                if (e.args.length > 0) {
                    this.baseVideo.setVisiable(false)
                }
                break;
            case"setVideoVisiable":
                this.baseVideo.setVisiable(e.args[0]);
                break
            }
        },
        getHistory: function() {
            var e = this.history.getRecords(), t = this.model.vinfo.vid;
            if (e && e.length > 0 && t > 0) {
                for (var i = 0; i < e.length; i++) {
                    if (e[i].vid == t) {
                        return e[i].htime
                    }
                }
            }
            if (e && e.htime) {
                return e.htime
            }
            return -1
        },
        getCurrentTime: function() {
            return this.baseVideo.getCurrentTime()
        },
        setCurrentTime: function(e) {
            if (!isNaN(e) && e > 0) {
                this.baseVideo.setCurrentTime(e)
            }
        },
        getBuffered: function() {
            var e = this.baseVideo.getBuffered(), t = e.length;
            var i = 0, a = [];
            while (i < t) {
                a.push({
                    start: e.start(i),
                    end: e.end(i)
                });
                i++
            }
            return a
        },
        setTrylook: function(e) {
            if (typeof this.baseVideo === "undefined")
                return;
            this.baseVideo.option.isTrylook = e
        }
    };
    i.exports = r
});


/**
 * ad相关
 */
define("module.ad", function(e, t, i) {
    var a = e("extend.lib"),
        s = e("module.stat"),
        n = e("proxy.pingback").instances,
        o = e("module.adPlayer"),
        r = e("module.user"),
        d = e("extend.detect"),
        l = e("video.statusEnum").error,
        c;

    var h = function(e, t) {
        c = this;
        this.ctr = e;
        this.model = t;
        this.evt = t.events;
        this.video_ = t.dom.videoEl;
        this.video = this.video_[0];
        this.pingback = n[t.option.cont];

        //
        this.events = [
            "error",
            "play",
            "playing",
            "ended",
            "pause",
            "touchstart",
            "timeupdate"
        ];

        //
        this.evt.on("TO_Pause TO_Play", this.handlerNotification, this);


        var i = t.vinfo,
            o = t.option;

        var d = {
            pname: o.pname,
            cont: o.cont,
            ch: "letv",
            uname: r.uname,
            uid: r.ssouid,
            isvip: i.isvip,
            up: i.up == 1 ? 1: 0,
            ver: o.version,
            uuid: s.getUUID(),
            lc: s.getLC(),
            islive: o.isLive ? true: false,
            p1: "0",
            p2: o.pname == "MPlayer" ? "04": "06",
            p3: ""
        };

        if (o.isLive) {
            d.streamid = i.streamid;
        }

        //广告信息
        this.adInfo = a.merge(d, i);

        this.bigPlay = t.dom.parentEl.find(".hv_ico_pasued");
        this.poster = t.dom.parentEl.find(".hv_play_poster");


        this.timerCount = 0;
        this.isAdInit = false;
        this.isADStarted = false;


        this.onADLoaded();
    };
    h.prototype = {
        installListener: function() {
            this.enabled = true;
            vjs.each.call(this, this.events, function(e, t) {
                this.video_.on(t, this.onVideoEvent, this)
            });
            this.bigPlay.on("click", this.toPlay, this);
            if (window.letv_login_cb && window["Spirit"].Event) {
                window["Spirit"].Event.addEvent("loginSuccess", function() {
                    if (!c.isAdCallLogin)
                        return;
                    var e = window["Spirit"]["UserValidate"].getUserInfo();
                    c.callAD("loginCb", {
                        level: e.userlevel
                    });
                    c.isAdCallLogin = false
                });
                window.letv_login_cb.on("close", function() {
                    if (!c.isAdCallLogin)
                        return;
                    c.callAD("loginCb", {
                        level: null
                    });
                    c.isAdCallLogin = false
                })
            }
        },
        removeListener: function() {
            this.enabled = false;
            vjs.each.call(this, this.events, function(e, t) {
                this.video_.off(t, this.onVideoEvent, this)
            });
            this.bigPlay.off("click", this.toPlay, this)
        },

        onADLoaded: function() {
            if (typeof o != "undefined" && typeof o.initAD == "function") {
                this.iAd = o.sendEvent;
                this.installListener();
                this.isAdInit = false;
                o.initAD(this.adInfo, this.callback)
            }
        },
        playAD: function(e) {
            this.curIdx = e;
            if (this.urls && this.urls.length > e && this.urls[e]) {
                this.curAD = this.urls[e];
                this.video.src = this.curAD.url;
                this.video.load();
                this.video.play()
            } else {
                this.playVideo()
            }
        },
        playVideo: function() {
            if (this.delayPauseID)
                clearTimeout(this.delayPauseID);
            this.removeListener();
            this.video.removeAttribute("src");
            this.ctr.playVideo()
        },
        onVideoEvent: function(e) {
            switch (e.type) {
            case"play":
            case"playing":
                if (this.isAdInit)
                    this.callAD("AD_PLAY");
                if (this.delayPauseID)
                    clearTimeout(this.delayPauseID);
                if (!d.iPhone) {
                    this.bigPlay[0].style.display = "none";
                    this.poster[0].style.display = "none"
                }
                this.isADStarted = true;
                break;
            case"pause":
                if (this.playID)
                    clearTimeout(this.playID);
                if (this.delayPauseID)
                    clearTimeout(this.delayPauseID);
                this.delayPauseID = setTimeout(function() {
                    c.callAD("AD_PAUSE")
                }, 500);
                break;
            case"ended":
                this.callAD("AD_ENDED");
                this.playAD(++this.curIdx);
                break;
            case"touchstart":
                this.callAD("AD_CLICK");
                break;
            case"timeupdate":
                if (++this.timerCount < 2)
                    return;
                this.evt.off("timeupdate", this.onVideoEvent, this);
                break;
            case"error":
                this.callAD("AD_ERROR", {
                    error: this.video.error
                });
                this.pingback.sendError(l["ADURLNotSupport"]);
                this.playAD(++this.curIdx);
                break
            }
        },

        //
        handlerNotification: function(e) {
            switch (e.type) {
                case"TO_Play":
                    c.video.play();
                    break;
                case"TO_Pause":
                    c.video.pause();
                    break
            }
        },
        toPlay: function(e) {
            e && e.stopPropagation();
            if (this.playID)
                clearTimeout(this.playID);
            var t = 0, i = a.bind(function() {
                if (++t < 3)
                    return;
                clearTimeout(this.playID);
                this.evt.off("timeupdate", this.ontimeupdate, this)
            }, this);
            this.evt.on("timeupdate", this.ontimeupdate, this);
            var s = a.bind(function() {
                this.video.play();
                if (++t > 3)
                    return;
                if (this.playID)
                    clearTimeout(this.playID);
                this.playID = setTimeout(s, 2e3)
            }, this);
            s()
        },
        callAD: function(e, t) {
            try {
                if (!t)
                    t = {};
                a.merge(t, {
                    curAD: this.curAD,
                    curIndex: this.curIdx
                });
                this.iAd(e, t);
                if (typeof this.ctr.callback == "function")
                    this.ctr.callback(e)
            } catch (i) {}
        }
    };
    a.merge(h.prototype, {
        callback: function(e, t) {
            if (c.enabled == false)
                return;
            try {
                switch (e) {
                case"login":
                    if (window.Spirit && Spirit.userLogin && Spirit.userLogin.openLetvLogin) {
                        Spirit.userLogin.openLetvLogin()
                    }
                    c.isAdCallLogin = true;
                    break;
                case"playAD":
                    if (c.isAdInit)
                        return;
                    c.isAdInit = true;
                    c.urls = t;
                    c.playAD(0);
                    break;
                case"stopAD":
                    c.playVideo();
                    break;
                case"resumeAD":
                    c.video.play();
                    break;
                case"pauseAD":
                    c.video.pause();
                    break;
                case"getCurrTime":
                    return c.video.currentTime || 0;
                case"getVideoRect":
                    return {
                        w: c.video_.getStyle("width"),
                        h: c.video_.getStyle("height")
                    }
                }
            } catch (i) {
                this.pingback.sendError(l["ADCallbackErr"]);
                c.playVideo()
            }
        }
    });
    i.exports = h
});
define("module.adPlayer", function(require, exports, module) {
    var lib = require("extend.lib"), br = require("extend.detect"), $js = require("core.vjs");
    var adTools = {
        param: function(e) {
            var t = new Array;
            if (typeof e == "object") {
                for (var i in e) {
                    if (e.hasOwnProperty(i)) {
                        if (e[i] === "-") {
                            continue
                        }
                        t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]))
                    }
                }
            }
            return t.join("&")
        },
        sendLogs: function(e, t) {
            if (adTools.getQuery("arkdebug")) {
                try {
                    var i = this.el("#arkDebugButton"), a = H5AD.putinVars.uuid, s = "http://ark.letv.com/apsdbg/?type=1&sid=" + a + "&time=" + t + "&msg=";
                    if (!adTools.existEl(i)) {
                        i = lib.createElement("div", {
                            id: "arkDebugButton",
                            className: "vdo_send_log"
                        });
                        i.innerText = "请查看" + a + "的日志";
                        H5AD.staticVars.countdownElem.appendChild(i)
                    }(new Image).src = s + encodeURIComponent("`" + e + "`")
                } catch (n) {}
            }
        },
        wsLog: function(e) {
            if (adTools.getQuery("arkdebug") == "2") {
                try {
                    if (!this.s) {
                        var t = H5AD.config, i = new WS(t.WS_URL);
                        this.s = i
                    }
                    this.s.addLog(e)
                } catch (a) {
                    console.log(a)
                }
            }
        },
        debug: function(e, t, i) {
            i = i || " ";
            if (H5AD.config.DEBUG == true || adTools.getQuery("arkdebug")) {
                if (typeof e == "object") {
                    if (t) {
                        console.log("%c" + t, "color:#f0d");
                        this.wsLog(t)
                    }
                    this.wsLog(e);
                    console.dir(e)
                } else {
                    if (e == undefined) {
                        console.log("数据空" + i);
                        return 
                    }
                    this.wsLog(e);
                    console.log(e + i)
                }
            }
        },
        json: function(data) {
            if (typeof data === "string") {
                if (JSON && JSON.parse) {
                    return JSON.parse(data)
                }
                return eval("(" + data + ")")
            }
            return JSON.stringify(data)
        },
        resoSid: function(e) {
            var t, i = "", a;
            if (typeof e === "string") {
                t = e.split(",")[0];
                a = t.split("|");
                if (a.length == 3) {
                    i = a[1]
                }
            }
            t = a = null;
            return i
        },
        getQuery: function(e) {
            var t = location.search;
            if (t.length > 0 && t.indexOf("?")!=-1) {
                var i = new RegExp(e + "=([^&]*)", "i"), a = t.match(i);
                return a && a.length > 0 ? unescape(a[1]) : null
            }
            return null
        },
        easyClone: function(e, t) {
            for (var i in t) {
                if (t.hasOwnProperty(i) && typeof t[i] !== "object") {
                    e[i] = t[i]
                }
            }
        },
        arkMapper: function(e) {
            if (typeof e == "string") {
                e = parseInt(e);
                if (isNaN(e)) {
                    return 132
                }
            }
            return H5AD.config.ARK_Mapper[e] || (this.isMStation ? 132 : 147)
        },
        removeElem: function(e) {
            if (e) {
                if (e.remove) {
                    return e.remove()
                } else {
                    return e.parentNode && e.parentNode.removeChild && e.parentNode.removeChild(e)
                }
            }
        },
        el: function(e, t) {
            return t ? $js(e).find(t)[0] : $js(e)[0]
        },
        existEl: function(e) {
            if (e) {
                if (e instanceof Array) {
                    return e.length > 0
                } else {
                    return true
                }
            }
            return false
        },
        getAslbUrl: function(e, t) {
            var i = this, a, s;
            t.result = t.result || [];
            if (e instanceof Array) {
                s = e.shift();
                if (!s) {
                    return t(t.result)
                } else {
                    if (s.url.indexOf(H5AD.config.ASLB_DOMAIN) >= 0) {
                        a = s.url + "&format=1&jsonp=?"
                    } else {
                        t.result.push(s);
                        adTools.getAslbUrl(e, t)
                    }
                }
                if (a === undefined) {
                    return 
                }
                lib.getJSON(a, function(i) {
                    if (/mp4|m3u8/.test(i.location) == false) {
                        s.ryCount = $js.retryCount;
                        s.costTime = $js.responseTime;
                        s.err = 474;
                        H5AD.sendEvent(H5AD.config.SEND_EVENT_TYPE.OnASLB, {
                            curAD: s,
                            curIndex: s.curIdx
                        });
                        H5AD.collectError("474,format error," + adTools.json(s), 3);
                        adTools.getAslbUrl(e, t)
                    } else {
                        s.rUrl = s.url;
                        s.url = i.location;
                        s.ryCount = $js.retryCount;
                        s.costTime = $js.responseTime;
                        t.result.push(s);
                        H5AD.sendEvent(H5AD.config.SEND_EVENT_TYPE.OnASLB, {
                            curAD: s,
                            curIndex: s.curIdx
                        });
                        adTools.getAslbUrl(e, t)
                    }
                }, function(i) {
                    s.ryCount = $js.retryCount;
                    s.costTime = $js.responseTime;
                    s.err = 473;
                    t.result.push(s);
                    H5AD.sendEvent(H5AD.config.SEND_EVENT_TYPE.OnASLB, {
                        curAD: s,
                        curIndex: s.curIdx
                    });
                    H5AD.collectError("473,aslb error," + adTools.json(s), 3);
                    adTools.getAslbUrl(e, t)
                })
            } else {
                if (a.indexOf(H5AD.config.ASLB_DOMAIN) < 0) {
                    return t([])
                }
                a = e + "&format=1&jsonp=?";
                lib.getJSON(a, function(e) {
                    return t([e.location])
                }, function(e) {
                    return t([])
                })
            }
        },
        loadCss: function(e) {
            var t = document.head || document.getElementsByTagName("head")[0] || document.documentElement, i = document.createElement("style");
            i.setAttribute("type", "text/css");
            i.innerHTML = e;
            t.appendChild(i)
        },
        getDeviceSize: function() {
            var e = screen;
            return {
                x: e.width > e.height ? e.width: e.height,
                y: e.width > e.height ? e.height: e.width
            }
        }(),
        canBeClicked: function() {
            if (br.iPhone || br.iPod || br.msie) {
                return false
            }
            return true
        }(), isUC: br.uc, isMStation: false
    };
    var H5AD = {
        dynamicVars: {
            retry: 0,
            adidQueue: [],
            isFirst: true,
            hasPlayed: false
        },
        staticVars: {
            arkId: 132,
            countdownElem: null
        },
        putinVars: {},
        config: {
            AD_STYLE: {
                pre_roll: "2",
                standard: "3",
                pause: "6"
            },
            SEND_EVENT_TYPE: {
                OnStart: "AD_PLAY",
                OnComplate: "AD_ENDED",
                OnClick: "AD_CLICK",
                OnAcComplate: "AC_COMPLATE",
                OnError: "AD_ERROR",
                OnPause: "AD_PAUSE",
                OnASLB: "AD_ASLB",
                OnLoginAc: "loginCb"
            },
            CALL_PLAYER_TYPE: {
                playAD: "playAD",
                stopAD: "stopAD",
                pauseAD: "pauseAD",
                resumeAD: "resumeAD",
                getRealTime: "getCurrTime",
                getPlayerSize: "getVideoRect",
                doLogin: "login"
            },
            PROCESS_EVENT_TICKS: [{
                k: "firstQuartile",
                v: .25
            }, {
                k: "midpoint",
                v: .5
            }, {
                k: "thirdQuartile",
                v: .75
            }
            ],
            crc_table: [61888, 62024, 21822, 44648, 51027, 25193, 39449, 32749, 45072, 19780, 27911, 40640, 22412, 47959, 2033, 15647, 26948, 7977, 333, 52810, 2229, 28457, 56115, 3222, 7819, 8261, 37040, 26479, 46017, 37654, 52255, 36436, 49642, 26018, 41611, 57969, 22529, 40087, 25454, 12785, 50531, 1739, 4421, 44187, 14573, 60124, 48843, 50551, 63571, 18928, 9702, 31935, 37924, 53689, 43138, 29106, 22299, 17913, 22765, 17733, 13233, 54102, 63095, 54790, 45315, 4283, 52320, 21487, 24719, 23499, 25688, 43296, 18522, 46226, 54051, 23750, 63855, 40050, 23830, 13909, 53473, 35269, 6541, 59749, 45495, 7225, 26512, 17657, 28777, 4159, 17208, 50565, 48334, 33575, 10897, 26141, 42425, 51911, 4632, 28267, 27030, 57778, 15356, 31158, 14774, 53522, 27342, 33231, 29241, 52365, 12102, 5400, 40637, 7989, 51774, 31639, 1064, 46043, 38691, 42315, 25171, 2606, 94, 25879, 50273, 48389, 61059, 63334, 38144, 34805, 17489, 9758, 21488, 31104, 40127, 47832, 19575, 8379, 62899, 64770, 6327, 15962, 35087, 34e3, 41978, 50244, 40758, 57390, 20080, 51537, 61759, 31722, 57084, 25726, 3693, 42772, 41971, 46086, 30626, 46885, 37383, 847, 38119, 23229, 59572, 58742, 40006, 20034, 62943, 57283, 50816, 54485, 36496, 28963, 5481, 23375, 51432, 3135, 18675, 20557, 968, 55963, 47914, 45119, 25284, 1646, 34994, 1493, 10573, 32670, 64131, 45013, 56896, 57534, 26361, 47505, 26941, 31536, 886, 43364, 32112, 18014, 13600, 60378, 12717, 60596, 9862, 56041, 44055, 39986, 37168, 28168, 55209, 30733, 5480, 6034, 17485, 56710, 63417, 33557, 9848, 39651, 64250, 14639, 63835, 38963, 7906, 39909, 7971, 10158, 40564, 25844, 3305, 50258, 28353, 42316, 44088, 44477, 1500, 42481, 45659, 44289, 10989, 54239, 19915, 42407, 19391, 1463, 50295, 60742, 8528, 50215, 445, 89, 39965, 42071],
            ARK_Mapper: {
                4: "140",
                5: "142",
                6: "141",
                20: "134",
                21: "133",
                22: "135",
                23: "144",
                24: "146",
                25: "143",
                26: "137",
                27: "139",
                28: "138",
                29: "136",
                88: "148",
                166: "148",
                90: "145",
                91: "147",
                100: "147",
                104: "147",
                335: "335",
                329: "329",
                292: "292",
                132: "132",
                131: "131",
                130: "130",
                129: "129",
                128: "128",
                127: "127",
                126: "126",
                125: "125",
                124: "124",
                123: "123",
                122: "122",
                121: "121",
                120: "120",
                118: "118"
            },
            H5_ADPLAYER_VER: "aps_h5_2.0.9",
            COUNTDOWN_IMG_URL: "http://i2.letvimg.com/img/201310/21/numbers.png",
            ARK_DOMAIN: "ark.letv.com",
            ASLB_DOMAIN: "g3.letv",
            ARK_SHOW_URL: "http://ark.letv.com/s?res=jsonp",
            ARK_PREVIEW_URL: "http://ark.letv.com/p?res=jsonp",
            DC_AD_URL: "http://dc.letv.com/va/?",
            SKIP_AD_CLICK: "http://dc.letv.com/s/?k=sumtmp;H5PADQad",
            SKIP_AD_SUCC: "http://dc.letv.com/s/?k=sumtmp;H5PADQadfc",
            REQ_ARK_TIMEOUT: 5e3,
            DOWNLOAD_URL_TIMEOUT: 1e4,
            WS_URL: "ws://10.58.88.69:8080",
            CSS_TEMPLATE: [".aps_countdown_cont{position:absolute;border-radius:10px 0;top:10px;right:10px;display:block;padding:5px 10px;background:rgba(49,37,37,0.8);z-index:12} .precdImg{float:left;width:12px;height:20px;overflow:hidden;}", ".vdo_post_time,.vdo_post_detail{position:absolute;height:40px;border:1px solid #262626;text-align:center;line-height:40px;font-size:16px;z-index:13;}.vdo_post_time{right:40px;top:20px;color:#ccc;}.vdo_post_rlt{position:relative;width:100%;height:40px}.vdo_time_bg,.vdo_detail_bg{position:absolute;width:100%;height:40px;left:0;top:0;background-color:#000;opacity:0.7}.vdo_time_info,.vdo_detail_info{padding:0 10px;position:relative}.vdo_detail_info{padding:0 20px}.vdo_time_info span{color:#09adfe;padding:9px 5px 0 0;float:left}.vdo_time_info a{color:#cccccc;margin-left:3px;}.vdo_post_detail{left:40px;bottom:20px}.vdo_post_detail a,.vdo_post_detail a:hover{color:#ccc;display:block;width:100%;height:40px}.vdo_post_detail i{background:url(http://i3.letvimg.com/img/201404/15/1052/rightLink.png) no-repeat left top;width:14px;height:24px;float:right;margin:8px 0 0 10px}.hv_box_mb .vdo_post_time{right:10px;top:10px;}.hv_box_mb .vdo_post_detail{left:10px;bottom:10px}.hv_box_mb .vdo_post_time,.hv_box_mb .vdo_post_detail{height:30px;line-height:30px;font-size:13px}.hv_box_mb .vdo_post_rlt,.hv_box_mb .vdo_time_bg,.hv_box_mb .vdo_detail_bg,.hv_box_mb .vdo_post_detail a,.hv_box_mb .vdo_post_detail a:hover{height:30px}.hv_box_mb .vdo_detail_info{padding:0 10px}.hv_box_mb .vdo_post_detail i{width:7px;height:12px;background-size:100%;margin:8px 0 0 5px}.hv_box_mb .vdo_time_info span{color:#09adfe;padding:4px 0px 0 0;float:left}", ".aps_mask_cont{position: absolute;width: 100%;height: 100%;top: 0px;left: 0px;z-index: 12;}.aps_pop_poster{width:100%;height:100%;position:absolute;top:0;left:0;z-index:150;}", ".vdo_send_log{position:absolute;top:80px;height:100px;right:10px;font-size:30px;z-index:30}", ".hv_pop_poster{position:absolute;top:50%;left:50%;margin:-112px 0 0 -182px; width:365px;height:225px;overflow:hidden;background-color:#f1f1f1;}.hv_pop_poster p{text-align:center;margin-bottom:12px}.hv_pop_poster p.hv_p1{padding-top:48px}.hv_pop_poster a{display:inline-block;height:40px;width:224px;line-height:40px;background-color:#f7f7f7;font-size:15px;color:#7e7e7e;border:1px solid #d1d1d1}.hv_pop_poster a.blu{background-color:#00a0e9;color:#ffffff;border:1px solid #00a0e9}.hv_pop_poster a.close{width:20px;height:20px;display:block;position:absolute;top:10px;right:10px;border:none;background:none}.hv_pop_poster a.close i{display:block;width:18px;height:2px;position:absolute;top:6px;left:0;background:#737373;transform:rotate(-45deg);-ms-transform:rotate(-45deg);   -moz-transform:rotate(-45deg);  -webkit-transform:rotate(-45deg);-o-transform:rotate(-45deg)}.hv_pop_poster a.close i.i_1{transform:rotate(45deg);-ms-transform:rotate(45deg);  -moz-transform:rotate(45deg);   -webkit-transform:rotate(45deg);-o-transform:rotate(45deg)}.hv_pop_poster .hv_org{color:#fd6c01}"].join(""),
            DEBUG: false,
            ArkDebug: false
        },
        adQueue: [],
        loadCss: function() {
            adTools.loadCss(this.config.CSS_TEMPLATE)
        },
        prepareImages: function(e, t) {
            var i = new Image;
            i.src = e;
            if (typeof t != "undefined") {
                if (i.complete) {
                    t(i.width, i.height)
                } else {
                    i.onload = function() {
                        t(i.width, i.height);
                        i.onload = null
                    }
                }
            }
        },
        initAD: function(e, t) {
            this.loadCss();
            this.prepareImages(this.config.COUNTDOWN_IMG_URL);
            adTools.debug(e, "传过来的值：");
            var i = this.config,
                a = i.SEND_EVENT_TYPE,
                s = i.CALL_PLAYER_TYPE,
                n;
            if (e && t) {
                this.callback2Player = t;
                this.putinVars = e
            } else {
                e = this.putinVars;
                t = this.callback2Player
            }
            this.startTime = lib.now();
            if (e.isvip) {
                this.callback2Player.call(this, s.stopAD);
                this.sendEvent(a.OnAcComplate, {
                    atype: "2",
                    curAD: {},
                    curIndex: -1,
                    ia: e.isvip
                });
                if (e.pname != "MPlayer") {
                    this.sendEvent(a.OnAcComplate, {
                        atype: "3",
                        curAD: {},
                        curIndex: -1,
                        ia: e.isvip
                    })
                }
                this.tips("tips", "您正享受乐视会员去广告服务");
                return 
            }
            if (e.pname == "MPlayer") {
                adTools.isMStation = true;
                this.adStyle = e.style || i.AD_STYLE.pre_roll
            } else {
                this.adStyle = e.style || [i.AD_STYLE.pre_roll, i.AD_STYLE.standard]
            }
            try {
                this.staticVars.countdownElem = adTools.el("#" + this.putinVars.cont, "div")
            } catch (o) {
                H5AD.callback2Player.call(this, s.stopAD, []);
                this.sendEvent(a.OnAcComplate, {
                    error: {
                        code: 22
                    }
                });
                return 
            }
            if (this.putinVars.ark) {
                n = this.putinVars.ark
            } else if ("__ADINFO__"in window && __ADINFO__.arkId) {
                n = __ADINFO__.arkId
            } else if (this.putinVars.streamid) {
                n = "!"
            } else {
                H5AD.callback2Player.call(this, s.stopAD, []);
                this.sendEvent(a.OnAcComplate, {
                    error: {
                        code: 21
                    }
                });
                return 
            }
            this.staticVars.arkId = adTools.arkMapper(n);
            this.arkTimer = setTimeout(function() {
                adTools.debug("请求ark超时,播放正片");
                H5AD.callback2Player.call(H5AD, i.CALL_PLAYER_TYPE.stopAD, [])
            }, i.REQ_ARK_TIMEOUT);
            this.getArkData(this.adStyle, this.staticVars.arkId, this.putinVars.vid, this.putinVars.streamid)
        },
        getArkData: function(e, t, i, a) {
            var s = this, n = s.config, o = n.SEND_EVENT_TYPE, r = s.dynamicVars, d;
            if (e instanceof Array) {
                e = e.join(",")
            }
            var l = {
                ark: t,
                n: r.isFirst ? 1: 0,
                ct: e,
                vid: i || 0
            };
            if (typeof a != "undefined") {
                a = adTools.resoSid(a);
                d = adTools.isMStation === true ? "335" : "148";
                adTools.easyClone(l, {
                    sid: a,
                    vid: "19999999",
                    b: "2",
                    ark: d
                });
                s.staticVars.arkId = d
            }
            var c = [this.config.ARK_SHOW_URL, adTools.param(l), "j=?"].join("&");
            var h = {
                r: adTools.getQuery("r"),
                o: adTools.getQuery("o"),
                d: adTools.getQuery("d"),
                w: adTools.getQuery("w"),
                x: adTools.getQuery("x"),
                y: adTools.getQuery("y"),
                z: adTools.getQuery("z")
            };
            r.isFirst = false;
            if (h.w && h.x && h.y && h.z) {
                c = [this.config.ARK_PREVIEW_URL, adTools.param(l), adTools.param(h), "j=?"].join("&")
            }
            h = null;
            adTools.debug("请求ARK地址:" + c);
            lib.getJSON(c, function(i) {
                try {
                    s._resolveData.call(s, i, e, c, t)
                } catch (a) {
                    s.callback2Player(n.CALL_PLAYER_TYPE.playAD, []);
                    s.sendEvent(o.OnAcComplate, {
                        error: {
                            code: 453
                        }
                    });
                    adTools.debug(a, "解析异常：")
                }
                clearTimeout(s.arkTimer)
            }, function(e) {
                s.sendEvent(o.OnAcComplate, {
                    error: {
                        code: 451
                    }
                });
                s.callback2Player(n.CALL_PLAYER_TYPE.stopAD, []);
                clearTimeout(s.arkTimer)
            }, n.REQ_ARK_TIMEOUT)
        },
        tips: function(e, t, i) {
            switch (e) {
            case"tips":
                adTools.debug(t);
                break
            }
        },
        _resolveData: function(e, t, i, a) {
            var s = this, n = s.config, o, r, d = "-";
            if (e && e.vast) {
                r = e.vast;
                o = r.Ad.length;
                adTools.easyClone(s.staticVars, r);
                s.dynamicVars["preAdCount"] = 0;
                s.dynamicVars["staAdCount"] = 0;
                adTools.debug("返回广告数：" + o);
                s.adQueue = [];
                s.dynamicVars["dur_total"] = 0;
                s.dynamicVars["dur"] = [];
                for (var l = 0; l < o; l++) {
                    var c = r.Ad[l], h = c.InLine, p = c["cuepoint_type"], f = h.Creatives.Creative[0], u = {};
                    if (o === 1 && this.adStyle instanceof Array) {
                        if (p == n.AD_STYLE.pre_roll) {
                            this.adStyle.pop()
                        } else if (p == n.AD_STYLE.standard) {
                            this.adStyle.shift()
                        }
                    }
                    adTools.easyClone(u, c);
                    var v = new AdMaterial(f.Linear.AdParameters, f.Linear.VideoClicks.ClickThrough, f.Linear.VideoClicks.ClickTracking, f.Linear.TrackingEvents.Tracking, h.Impression, u["order_item_id"], u["order_id"], f.Linear["Duration"], p, f.Linear["adzone_id"], l);
                    s.adQueue.push(v);
                    u.duration = v.duration;
                    if (p == n.AD_STYLE.pre_roll) {
                        s.dynamicVars["dur"].push(u.duration);
                        s.dynamicVars["dur_total"] += u.duration;
                        s.dynamicVars["preAdCount"]++;
                        s.dynamicVars["adidQueue"].push(u["order_item_id"])
                    } else if (p == n.AD_STYLE.standard) {
                        s.dynamicVars["staAdCount"]++;
                        s.dynamicVars["stadur"] = u["duration"];
                        d = u["order_item_id"]
                    }
                }
                adTools.getAslbUrl(s.adQueue, function(e) {
                    adTools.debug(e, "返回ASLB—Data:");
                    s.callback2Player.call(s, n.CALL_PLAYER_TYPE.playAD, e);
                    s.downMaterialTimer = lib.now()
                });
                s.sendEvent(n.SEND_EVENT_TYPE.OnAcComplate, {
                    atype: "2",
                    ct: s.dynamicVars["preAdCount"]
                });
                if (adTools.isMStation === false) {
                    s.sendEvent(n.SEND_EVENT_TYPE.OnAcComplate, {
                        atype: "3",
                        ct: s.dynamicVars["staAdCount"],
                        dur: s.dynamicVars["stadur"] || "0",
                        oiid: d
                    })
                }
            } else {
                s.callback2Player.call(s, n.CALL_PLAYER_TYPE.playAD, []);
                s.sendEvent(n.EVENT_TYPE.OnAcComplate, {
                    error: {
                        code: 453
                    }
                })
            }
        },
        retry: function(e) {
            return;
            adTools.debug("发起重试" + e);
            e = e || this.dynamicVars.curIdx;
            if (this.dynamicVars.retry > 2 || e > this.adQueue.length-1) {
                this.sendEvent(this.config.EVENT_TYPE.OnError, {});
                return 
            }
            ++this.dynamicVars.retry;
            var t = this.adQueue.splice(e);
            this.callback2Player.call(this, this.config.CALL_PLAYER_TYPE.playAD, t)
        },
        _getUniqueId: function() {
            var e = Math;
            return "ad_" + Array.prototype.join.call(arguments, "_") + String(e.ceil(e.random() * 1e4))
        },
        sendEvent: function(e, t) {
            var i = H5AD, a = i.config, s = a.SEND_EVENT_TYPE, n = t.curAD;
            switch (e) {
            case s.OnAcComplate:
                {
                    i._sendUserLog(0, t);
                    adTools.debug("AC结束");
                    break
                }
            case s.OnStart:
                {
                    if (i.dynamicVars.hasPlayed === false) {
                        i._sendUserLog(1, t);
                        i._sendArkTracking(1, t);
                        n.sendEvent("start", i._sendArkTracking)
                    }
                    i.dynamicVars.hasPlayed = true;
                    if (n.adType == a.AD_STYLE.pre_roll) {
                        n.seeDetail();
                        n.closeBigPlay();
                        n.renderRealCd(i.dynamicVars["dur_total"], t, i.dynamicVars["dur"]);
                        i.playAdTimer = i.playAdTimer || [];
                        clearTimeout(i.playAdTimer[t.curIndex]);
                        i.playAdTimer[t.curIndex] = setTimeout(function() {
                            adTools.debug(t.curIndex + " 广告播放超时");
                            lib.merge(t, {
                                error: {
                                    code: 461
                                }
                            });
                            i._sendUserLog(1, t);
                            i.callback2Player.call(i, a.CALL_PLAYER_TYPE.stopAD);
                            n.closeCountDown()
                        }, n.duration * 1e3 + a.DOWNLOAD_URL_TIMEOUT)
                    } else if (n.adType == a.AD_STYLE.standard) {
                        n.seeDetail();
                        n.closeBigPlay();
                        i.playAdTimer = i.playAdTimer || [];
                        clearTimeout(i.playAdTimer[t.curIndex]);
                        i.playAdTimer[t.curIndex] = setTimeout(function() {
                            adTools.debug(t.curIndex + " 广告播放超时");
                            lib.merge(t, {
                                error: {
                                    code: 461
                                }
                            });
                            i._sendUserLog(1, t);
                            i.callback2Player.call(i, a.CALL_PLAYER_TYPE.stopAD);
                            n.closeSeeDetail()
                        }, n.duration * 1e3 + a.DOWNLOAD_URL_TIMEOUT)
                    }
                    adTools.debug(t.curIndex + " 开始播放广告");
                    break
                }
            case s.OnComplate:
                {
                    if (n.adType == a.AD_STYLE.pre_roll) {
                        n.closeSeeDetail();
                        n.closeBigPlay(t);
                        if (t.curIndex + 1 == i.dynamicVars["preAdCount"]) {
                            n.closeCountDown()
                        } else {
                            n.pauseCountDown()
                        }
                    } else if (n.adType == a.AD_STYLE.standard) {
                        n.closeCountDown()
                    }
                    clearTimeout(i.playAdTimer[t.curIndex]);
                    i._sendUserLog(3, t);
                    n.sendEvent("complete", i._sendArkTracking);
                    adTools.debug(t.curIndex + "段广告播放完成");
                    i.dynamicVars.hasPlayed = false;
                    break
                }
            case s.OnClick:
                {
                    break
                }
            case s.OnPause:
                {
                    clearTimeout(H5AD.playAdTimer[t.curIndex]);
                    n.pauseCountDown();
                    n.renderBigPlay(t);
                    adTools.debug(t.curIndex + " 暂停");
                    break
                }
            case s.OnError:
                {
                    i._sendUserLog(1, t);
                    if (n.adType == a.AD_STYLE.pre_roll) {
                        clearTimeout(i.playAdTimer[t.curIndex]);
                        var o = i.dynamicVars["dur_total"];
                        for (var r = 0; r < t.curIndex; r++) {
                            o -= i.dynamicVars["dur"][r]
                        }
                        n.closeCountDown()
                    }
                    adTools.debug(t.error, t.curIndex + " 播放器遇到错误，回调");
                    i.dynamicVars.hasPlayed = false;
                    break
                }
            case s.OnASLB:
                {
                    i._sendUserLog(5, t);
                    break
                }
            case s.OnLoginAc:
                {
                    n.loginAc(t.level);
                    break
                }
            default:
                break
            }
        },
        _sendUserLog: function(e, t) {
            t = t || {};
            var i = H5AD, a = i.config, s = i.putinVars, n = i.dynamicVars, o = Math;
            if (!n.dur) {
                lib.merge(n, {
                    dur: ["-"],
                    dur_total: "-",
                    adCount: 0
                })
            }
            _adItem = t.curAD || {};
            var r = {
                act: "event",
                atype: t.atype || _adItem.adType,
                id: "-",
                ia: 0,
                err: 0,
                lc: s.lc || "-",
                ver: "2.0",
                aps: a.H5_ADPLAYER_VER,
                ch: s.ch,
                cid: s.cid || "-",
                ct: t.ct || 0,
                dur: t.dur || n.dur.join("_") || "0",
                dur_total: t.dur || n.dur_total || "0",
                mmsid: s.mmsid || "-",
                pid: s.pid || "-",
                r: o.ceil(o.random() * lib.now()),
                cur_url: encodeURIComponent(location.href),
                ry: n["retry"] || 0,
                ref: encodeURIComponent(document.referrer) || "-",
                sys: 1,
                uname: s.uname || "-",
                uid: s.uid || "-",
                py: s.up,
                uuid: s.uuid,
                pv: s.ver,
                vid: s.vid || "-",
                vlen: s.gdur || "-",
                p1: s.p1,
                p2: s.p2,
                ontime: "-",
                p3: s.p3 == s.p3 ? "-": s.p3,
                ty: s.islive ? 1: 0
            };
            switch (e) {
            case 0:
                {
                    r.act = "ac";
                    r.ry = $js.retryCount;
                    if (s.isvip) {
                        r.ia = t.isvip || "1";
                        r.ry = "0"
                    }
                    if (t.error) {
                        r.err = t.error.code
                    }
                    r.ut = $js.responseTime;
                    if (r.atype == "3") {
                        r.atype = "13"
                    }
                    r.oiid = t.oiid || i.dynamicVars["adidQueue"].join("_") || "-";
                    i._sendData(i.config.DC_AD_URL + adTools.param(r));
                    break
                }
            case 1:
                {
                    r.ut = lib.now() - i.downMaterialTimer;
                    i.lastCostTime = r.ut;
                    if (t.error) {
                        switch (t.error.code) {
                        case 1:
                            r.err = 460;
                            break;
                        case 2:
                            r.err = 461;
                            break;
                        case 3:
                            r.err = 463;
                            break;
                        case 4:
                            r.err = 469;
                            break;
                        default:
                            r.err = t.error.code || 0;
                            break
                        }
                        r.loc = encodeURIComponent(_adItem.url)
                    }
                    r.dur = _adItem.duration;
                    r.ftype = "video";
                    r.id = e;
                    r.ry = 1;
                    r.atype = _adItem.adType;
                    r.ord = parseInt(t.curIndex) + 1;
                    if (r.atype == a.AD_STYLE.standard) {
                        r.dur_total = r.dur;
                        r.ord = 1;
                        r.ct = i.dynamicVars["staAdCount"]
                    } else {
                        r.ct = i.dynamicVars["preAdCount"]
                    }
                    if (r.atype == "3") {
                        r.atype = "13"
                    }
                    r.oiid = _adItem.oid || i.dynamicVars["adidQueue"][t.curIndex];
                    i._sendData(i.config.DC_AD_URL + adTools.param(r));
                    break
                }
            case 2:
            case 3:
                {
                    r.dur = _adItem.duration;
                    r.ut = lib.now() - i.downMaterialTimer - i.lastCostTime;
                    r.ftype = "video";
                    r.id = e;
                    r.atype = _adItem.adType;
                    r.ord = parseInt(t.curIndex) + 1;
                    if (r.atype == a.AD_STYLE.standard) {
                        r.dur_total = r.dur;
                        r.ord = 1;
                        r.ct = i.dynamicVars["staAdCount"]
                    } else {
                        r.ct = i.dynamicVars["preAdCount"]
                    }
                    if (r.atype == "3") {
                        r.atype = "13"
                    }
                    r.oiid = _adItem.oid || i.dynamicVars["adidQueue"][t.curIndex];
                    i._sendData(i.config.DC_AD_URL + adTools.param(r));
                    if (e == 3) {
                        i.downMaterialTimer = lib.now()
                    }
                    break
                }
            case 5:
                {
                    adTools.debug("ASLB结束");
                    if (_adItem.err) {
                        r.loc = encodeURIComponent(_adItem.url);
                        r.err = _adItem.err
                    }
                    r.act = "aslb";
                    r.ut = _adItem.costTime;
                    r.ry = _adItem.ryCount;
                    r.atype = _adItem.adType;
                    r.ord = parseInt(t.curIndex) + 1;
                    if (r.atype == a.AD_STYLE.standard) {
                        r.ord = 1
                    }
                    r.oiid = _adItem.oid || i.dynamicVars["adidQueue"][t.curIndex];
                    delete r.ct;
                    delete r.dur;
                    delete r.dur_total;
                    delete r.ia;
                    if (r.atype == "3") {
                        r.atype = "13"
                    }
                    i._sendData(i.config.DC_AD_URL + adTools.param(r));
                    break
                }
            default:
                break
            }
        },
        _getCtUrl: function(e, t) {
            t = t || 2;
            return this._getAttachParam(e.clickUrl, e.aduid, t, 1, e)
        },
        _getAdStyle: function(e) {
            if (!this.adStyle) {
                return null
            }
            if (this.adStyle instanceof Array && this.adStyle.length-1 >= e) {
                return this.adStyle[e]
            }
            return this.adStyle
        },
        _sendArkTracking: function(e, t) {
            var i = this, a = [], s, n = t ? t.curAD: {};
            switch (e) {
            case 1:
                a = n.impression;
                for (s = 0; s < a.length; s++) {
                    var o = "";
                    if (typeof a[s] == "object") {
                        if (a[s].cdata && a[s].cdata.length > 0) {
                            o = a[s].cdata
                        }
                    } else {
                        o = a[s]
                    }
                    i._sendData(i._getAttachParam, o, n.aduid, e, 1, n)
                }
                break;
            case 2:
                a = n.tracking;
                for (s = 0; s < a.length; s++) {
                    var o = "";
                    if (typeof a[s] == "object") {
                        if (a[s].cdata && a[s].cdata.length > 0) {
                            o = a[s].cdata
                        }
                    } else {
                        o = a[s]
                    }
                    i._sendData(i._getAttachParam, o, n.aduid, 3, 1, n)
                }
                break;
            case 4:
                a = t;
                var n = arguments[2];
                if (a && a.length > 0) {
                    for (s = 0; s < a.length; s++) {
                        i._sendData(i._getAttachParam, a[s], n.aduid, e, 1, n)
                    }
                }
                break
            }
        },
        _getAttachParam: function(e, t, i, a, s) {
            var n = H5AD, o = n.config;
            if (!e || e === "javascript:void(0)")
                return "javascript:void(0)";
            if (e.indexOf(o.ARK_DOMAIN)>-1) {
                var r = (new Date).getTime(), d = n.staticVars, l = n.putinVars;
                var c = {
                    rt: i,
                    oid: s.oid,
                    im: a === undefined ? 1: a,
                    t: d["stime"] + Math.ceil((r - n.startTime) / 1e3),
                    data: [t, d["area_id"], d.arkId || 0, l.uuid, s.orderid, l.vid, l.pid, l.cid].join(",")
                };
                c.s = n._getSecurityKey(c);
                if (i == 2) {
                    if (e.indexOf("[randnum]")>-1) {
                        e = e.replace("[randnum]", (new Date).getTime())
                    }
                    if (e.indexOf("[M_IESID]")>-1) {
                        e = e.replace("[M_IESID]", "LETV_" + t)
                    }
                    if (e.indexOf("[M_ADIP]")>-1) {
                        e = e.replace("[M_ADIP]", n.staticVars["ip"])
                    }
                    if (e.indexOf("[A_ADIP]")>-1) {
                        e = e.replace("[A_ADIP]", n.staticVars["ip"])
                    }
                    var h = e.split("&u=");
                    e = [h[0], adTools.param(c), "u=" + h[1]].join("&")
                } else {
                    e += "&" + adTools.param(c)
                }
            } else {
                if (e.indexOf("[randnum]")>-1) {
                    e = e.replace("[randnum]", (new Date).getTime())
                }
                if (e.indexOf("[M_IESID]")>-1) {
                    e = e.replace("[M_IESID]", "LETV_" + t)
                }
                if (e.indexOf("[M_ADIP]")>-1) {
                    e = e.replace("[M_ADIP]", n.staticVars["ip"])
                }
                if (e.indexOf("http://v.admaster.com.cn")>-1) {
                    e = e + ",f" + n.staticVars["ip"]
                }
            }
            return e
        },
        _getSecurityKey: function(e) {
            var t = this.config.crc_table;
            var i = 0, a = 0, s = 0, n = "", o = "";
            for (var r in e) {
                o += e[r]
            }
            n = o.length;
            for (i = 0; i < n; i++) {
                var d = o.charCodeAt(i);
                var l = a & 15 | (d & 15)<<4;
                s = t[l];
                a = a>>4^s;
                s = t[a & 15 | d & 240];
                a = a>>4^s
            }
            return a.toString(16)
        },
        _sendData: function(e) {
            var t = e;
            if (typeof arguments[0] == "function") {
                t = arguments[0].apply(this, [].slice.call(arguments, 1))
            }
            if (!t || t == "") {
                return 
            }
            var i = lib.createElement("img", {
                src: t
            });
            adTools.debug("发起url : " + t);
            $js(i).on("load", function() {
                i = null
            })
        },
        collectError: function(e, t) {
            t = t || 2;
            if (Math.floor(Math.random() * 100)%t != 0) {
                return 
            }
            if (e && typeof e == "object") {
                (new Image).src = "http://ark.letv.com/aspdbg/?msg=" + encodeURI(e.stack);
                return 
            }(new Image).src = "http://ark.letv.com/aspdbg/?msg=" + encodeURI(e)
        }
    };

    /**
     * 广告素材对象 key step
     */
    function AdMaterial(
        e/* AdParameters */,
        t/* ClickThrough */,
        i/* ClickTracking */,
        a/* TrackingEvents.Tracking */,
        s/* Impression */,
        n/* order_item_id */,
        o/* order_id */,
        r/* Duration */,
        d/* adType */,
        l/* adzone_id */,
        c/* index */
    ) {
        this.duration = parseInt(r) || 0;
        this.impression = s;
        this.clickUrl = t;
        this.tracking = i;
        this.event = a;
        this.oid = n;
        this.orderid = o;
        this.curIdx = c;
        this.resolveAdParam(e);
        this.adType = d + "";
        this.aduid = l;
        this.initEvent()
    }
    AdMaterial.prototype = {
        resolveAdParam: function(e) {
            var t = adTools.json(e);
            if (t.hdurl && t.hdurl.length > 0 && adTools.getDeviceSize.x > 960 && adTools.getDeviceSize.y > 640) {
                this.url = t.hdurl
            } else {
                this.url = t.url
            }
            if (t.sg === "1" || t.sg === undefined || adTools.isMStation === false) {
                this.renderCd = true
            }
            if (t.duration) {
                this.duration = parseInt(t.duration)
            }
        },
        initEvent: function() {
            var e = H5AD.config.PROCESS_EVENT_TICKS, t, i, a;
            this.progressTicks = [];
            if (this.event && this.event.length > 0) {
                for (i = 0; i < this.event.length; i++) {
                    t = this.event[i];
                    if (t.offset != undefined) {
                        this.progressTicks.push(t.offset)
                    } else {
                        for (a = 0; a < e.length; a++) {
                            if (t.event == e[a].k) {
                                this.event[i].event = "progress";
                                this.event[i].offset = this.duration * e[a].v || 0;
                                this.progressTicks.push(this.event[i].offset)
                            }
                        }
                    }
                }
            }
            AdMaterial.curAd = this
        },
        sendEvent: function(e, t, i) {
            try {
                var a = this.getTrackArr(e, i);
                t.call(H5AD, 4, a, this)
            } catch (s) {
                adTools.debug("进度监测出错" + s.stack)
            }
        },
        getTrackArr: function(e, t) {
            var i, a = [];
            if (this.event && this.event.length > 0) {
                for (var i = 0; i < this.event.length; i++) {
                    if (this.event[i]["event"] == e) {
                        if (t != undefined) {
                            if (t == this.event[i]["offset"]) {
                                a.push(this.event[i].cdata);
                                this.event[i]["event"] = "hadSent"
                            }
                        } else {
                            a.push(this.event[i].cdata);
                            this.event[i]["event"] = "hadSent"
                        }
                    }
                }
            }
            return a
        },
        renderRealCd: function(e, t, i) {
            var a = this, s, n, o = 0, r = 0, d = Math, l = H5AD, c = adTools.el("#div_cdown"), h, p = e, f;
            if (a.progressTicks.length > 0) {
                clearInterval(a.processTimer);
                a.processTimer = setInterval(function() {
                    f = l.callback2Player(l.config.CALL_PLAYER_TYPE.getRealTime) || 0;
                    for (var e = 0; e < a.progressTicks.length; e++) {
                        if (d.abs(a.progressTicks[e] - f) <= .5) {
                            adTools.debug("进度监测：offset:" + a.progressTicks[e] + ",curTime:" + f + "," + e);
                            a.sendEvent("progress", l._sendArkTracking, a.progressTicks[e]);
                            a.progressTicks.splice(e, 1);
                            if (a.progressTicks.length == 0) {
                                clearInterval(a.processTimer)
                            }
                            break
                        }
                    }
                }, 1e3)
            } else {
                clearInterval(a.processTimer)
            }
            if (!adTools.canBeClicked) {
                return 
            }
            if (a.renderCd != true) {
                return 
            }
            for (s = a.curIdx; s >= 0; s--) {
                p -= i[s]
            }
            var u = function(e, t, i) {
                var n = e;
                for (s = 0; s < a.curIdx; s++) {
                    n -= i[s]
                }
                o = l.callback2Player(l.config.CALL_PLAYER_TYPE.getRealTime) || 0;
                n -= d.ceil(o);
                return n
            };
            n = u.apply(this, arguments);
            var v = function(e) {
                var t = e.toString(), i = "", a, s;
                for (a = 0; a < t.length; a++) {
                    i += '<em id="cd_' + String(a) + '" class="precdImg" style="' + (t.length < 2 ? "float:right;" : "") + "background-image:url(" + H5AD.config.COUNTDOWN_IMG_URL + ");background-position:0 " +- parseInt(t.charAt(a)) * 20 + 'px;background-repeat: no-repeat;"></em>'
                }
                return i
            };
            if (adTools.existEl(c)) {
                h = adTools.el("#div_cdown")
            } else {
                h = lib.createElement("div", {
                    className: "vdo_post_time",
                    id: "vdo_post_time"
                });
                var g = '<a href="javascript:;" id="vdo_skip_pre">跳过广告</a>';
                if (adTools.isMStation) {
                    g = ""
                }
                h.innerHTML = ['<div class="vdo_post_rlt">', '<div class="vdo_time_bg"></div>', '<div class="vdo_time_info"><span id="div_cdown"></span>' + g + "</div>", "</div>"].join("");
                l.staticVars.countdownElem.appendChild(h);
                $js("#vdo_skip_pre").on("click", function() {
                    a.skipAd()
                });
                $js("#div_cdown")[0].innerHTML = v(n)
            }
            clearInterval(a.countdownTimer);
            a.countdownTimer = setInterval(function() {
                var n = u(e, t, i);
                if (n < 0) {
                    a.closeCountDown();
                    return 
                }
                if (n < p) {
                    a.pauseCountDown();
                    return 
                }
                var o = n.toString();
                var r = e.toString().length - o.length;
                s = 0;
                if (r > 0) {
                    for (s = 0; s < r; s++) {
                        adTools.el("#cd_" + String(s)).style.backgroundPosition = "0 -200px"
                    }
                }
                for (j = o.length-1; j >= 0; j--) {
                    var d = parseInt(o.charAt(j)) * 20;
                    adTools.el("#cd_" + String(j + s)).style.backgroundPosition = "0 " +- d + "px"
                }
            }, 500)
        },
        renderBigPlay: function(e) {
            if (!adTools.canBeClicked) {
                return 
            }
            var t = this;
            var i = H5AD.staticVars.countdownElem;
            var a = lib.createElement("div", {
                id: "btn_a_resume",
                className: "hv_ico_pasued"
            });
            a.style.display = "block";
            i.appendChild(a);
            $js(a).on("click", function(i) {
                i.stopPropagation();
                i.cancelBubble = true;
                t.closeBigPlay(e)
            })
        },
        seeDetail: function() {
            if (!adTools.canBeClicked) {
                return 
            }
            var e = this, t = adTools.el("#a_see_detail"), i = adTools.el("#a_see_more"), a = H5AD.staticVars.countdownElem, s = adTools.el(".hv_ico_pasued"), n = H5AD._getCtUrl(e, 2);
            if (adTools.existEl(i)) {
                adTools.el("#a_see_detail").setAttribute("href", n);
                adTools.el("#a_see_more").setAttribute("href", n)
            } else {
                t = lib.createElement("a", {
                    target: "_blank",
                    href: n,
                    id: "a_see_detail",
                    className: "aps_mask_cont"
                });
                i = lib.createElement("div", {
                    className: "vdo_post_detail"
                });
                i.innerHTML = ['<div class="vdo_post_rlt">', ' <div class="vdo_detail_bg"></div>', '<div class="vdo_detail_info"><a id="a_see_more" href="' + n + '" target="_blank">了解详情<i></i></a></div>', "</div>"].join("");
                if (adTools.existEl(s)) {
                    if (!adTools.isUC) {
                        a.insertBefore(t, s)
                    }
                    a.insertBefore(i, s)
                } else {
                    if (!adTools.isUC) {
                        a.appendChild(t)
                    }
                    a.appendChild(i)
                }
                var o = function(t) {
                    t.stopPropagation();
                    t.cancelBubble = true;
                    if (H5AD.dynamicVars.hasPlayed === false) {
                        return 
                    }
                    n = H5AD._getCtUrl(e, 2);
                    adTools.el("#a_see_detail").setAttribute("href", n);
                    adTools.el("#a_see_more").setAttribute("href", n);
                    H5AD.callback2Player(H5AD.config.CALL_PLAYER_TYPE.pauseAD);
                    H5AD._sendUserLog(2, {
                        curAD: e,
                        curIndex: 0
                    });
                    H5AD._sendArkTracking(2, {
                        curAD: e,
                        curIndex: 0
                    })
                };
                $js(t).on("click", o);
                $js(i).on("click", o)
            }
        },
        closeSeeDetail: function() {
            if (!adTools.canBeClicked) {
                return 
            }
            var e = adTools.el("#a_see_detail"), t = adTools.el(".vdo_post_detail");
            if (adTools.existEl(e)) {
                adTools.removeElem(e)
            }
            if (adTools.existEl(t)) {
                adTools.removeElem(t)
            }
        },
        closeBigPlay: function(e) {
            if (!adTools.canBeClicked) {
                return 
            }
            var t = H5AD;
            var i = adTools.el("#btn_a_resume");
            if (adTools.existEl(i)) {
                adTools.removeElem(i);
                t.callback2Player(t.config.CALL_PLAYER_TYPE.resumeAD)
            }
        },
        closeCountDown: function() {
            if (!adTools.canBeClicked) {
                return 
            }
            var e = adTools.el("#vdo_post_time");
            if (adTools.existEl(e)) {
                this.pauseCountDown();
                adTools.removeElem(e)
            }
            this.closeBigPlay();
            this.closeSeeDetail()
        },
        pauseCountDown: function() {
            if (!adTools.canBeClicked) {
                return 
            }
            clearInterval(this.countdownTimer);
            clearInterval(this.processTimer)
        },
        skipAd: function() {
            var e = H5AD, t = e.config, i = t.CALL_PLAYER_TYPE, a = e.callback2Player, s = e.staticVars.countdownElem, n;
            n = adTools.el(".aps_pop_poster");
            a.call(e, i.pauseAD);
            if (!adTools.existEl(n)) {
                n = lib.createElement("div", {
                    className: "aps_pop_poster",
                    id: "aps_login"
                });
                n.innerHTML = ['<div class="hv_pop_poster">', '<p class="hv_p1">如果您已是会员，请登录</p>', '<p><a href="javascript:;" id="aps_login_button">登录</a></p>', '<p>看大片无广告，<span class="hv_org">7天</span>会员免费体验</p>', '<p><a href="http://yuanxian.letv.com/zt2014/7days/index.shtml?ref=H5PADQad" target="_blank" class="blu">立即领取</a></p>', '<a href="javascript:;" id="aps_login_close" class="close"><i></i><i class="i_1"></i></a></div>'].join("");
                s.appendChild(n);
                e._sendData(t.SKIP_AD_CLICK);
                $js("#aps_login_button").on("click", function(e) {
                    a(i.doLogin)
                });
                $js("#aps_login_close").on("click", function(t) {
                    a.call(e, i.resumeAD);
                    adTools.removeElem(adTools.el("#aps_login"))
                })
            }
            adTools.debug("点击跳过广告")
        },
        loginAc: function(e) {
            var t = H5AD, i = t.config, a = i.CALL_PLAYER_TYPE, s = t.callback2Player;
            if (e) {
                s(a.stopAD);
                this.closeCountDown();
                t._sendData(i.SKIP_AD_SUCC)
            } else {
                s(a.resumeAD)
            }
            adTools.debug("登录完成，返回level：" + e);
            adTools.removeElem($js(".aps_pop_poster")[0])
        }
    };
    function WS(e) {
        var t = this, i;
        t.support = "WebSocket"in window;
        t.ready = false;
        t.target = e;
        t.mq = [];
        t.open()
    }
    WS.prototype = {
        open: function() {
            var e = this;
            if (e.support) {
                ws = new WebSocket(e.target);
                ws.onopen = function(t) {
                    e.onopen.apply(e, arguments)
                };
                ws.onmessage = function(t) {
                    e.onmessage.apply(e, arguments)
                };
                ws.onerror = function(t) {
                    e.onerror.apply(e, arguments)
                };
                ws.onclose = function() {
                    e.onclose.apply(e, arguments)
                };
                e.socket = ws
            } else {
                alert("your br not support ws")
            }
            e.soldier()
        },
        addLog: function(e) {
            this.mq.push({
                time: + new Date,
                data: e
            })
        },
        send: function(e, t) {
            this.socket.send("[" + t + "]," + e)
        },
        sendHttp: function(e, t) {
            adTools.sendLogs(e, t)
        },
        close: function() {
            if (this.support) {
                this.socket.close()
            }
        },
        onopen: function(e) {
            this.ready = true;
            console.log("onopen:");
            console.log(arguments)
        },
        onmessage: function(e) {
            var t = "", i = AdMaterial.curAd, a = H5AD.callback2Player, s = H5AD.config.CALL_PLAYER_TYPE;
            if (e.data) {
                t = e.data.split(":")[1].replace("\r", "").replace("\n", "");
                switch (t) {
                case"connect":
                case"connected":
                    break;
                case"closecd":
                    i.closeCountDown();
                    break;
                case"closedetail":
                    i.closeSeeDetail();
                    break;
                case"requestad":
                    H5AD.initAD();
                    break;
                case"refresh":
                    location.reload();
                    break;
                case"stopad":
                    i.closeCountDown();
                    a(s.stopAD);
                    break;
                case"resumead":
                    a(s.resumeAD);
                    break;
                case"pausead":
                    a(s.pauseAD);
                    break;
                default:
                    this.send("error command!");
                    break
                }
            }
        },
        onerror: function() {
            alert("ws:error:");
            this.ready = false
        },
        onclose: function() {
            alert("ws:close:");
            this.ready = false
        },
        soldier: function() {
            var e = this, t = 0, i = 16, a;
            e.mqTimer = setInterval(function() {
                var s = 0, n, o;
                if (e.support && e.ready && e.socket) {
                    a = e.send
                } else {
                    a = e.sendHttp
                }
                while (n = e.mq.shift()) {
                    o = n.data;
                    if (typeof o !== "string") {
                        o = adTools.json(o)
                    }
                    a.call(e, o, n.time)
                }
                if (++t > i && e.mq.length == 0) {
                    adTools.debug("ws: soldier time out!");
                    clearInterval(e.mqTimer)
                }
            }, 2e3)
        }
    };
    module.exports = H5AD
});
define("proxy.pingback", function(e, t, i) {
    var a = e("extend.lib"), s = e("extend.detect"), n = e("module.stat"), o = {};
    var r = function(e) {
        this.model = e;
        this.option = e.option;
        this.vinfo = e.vinfo;
        o[e.option.cont] = this;
        this.config = {
            EnvUrl: "http://dc.letv.com/env/?",
            ActionUrl: "http://dc.letv.com/pl/?",
            CNTVUrl: "http://dc.letv.com/w/?",
            PlayCountUrl: "http://stat.letv.com/vplay/VideoViewSubmit.php?",
            ErrorUrl: "http://stat.letv.com/flverr?",
            ComScore: "http://b.scorecardresearch.com/b?",
            browser: [["qq", "(tencenttraveler)\\s([0-9].[0-9])"], ["ff", "(firefox)\\/([0-9])"], ["ff", "(minefield)\\/([0-9])"], ["ff", "(shiretoko)\\/([0-9])"], ["opera", "(opera)\\/([0-9])"], ["ie", "(msie)\\s([0-9].[0-9])"], ["chrome", "(chrome)\\/([0-9])"], ["qq", "(QQBrowser)\\/([0-9])"], ["UC", "(UCBrowser)\\/([0-9])"], ["safa", "(safari)\\/([0-9])"]],
            system: [["winxp", "(windows nt 5.1)"], ["win vista", "(windows nt 6.0)"], ["windows 7", "(windows nt 6.1)"], ["windows me", "(windows me)"], ["macintosh", "(macintosh)"], ["WPhone", "(Windows Phone)"], ["Android", "(Android)"], ["ipad", "(iPad)"], ["iPhone", "(iPhone)"], ["Symbian", "(SymbianOS)"], ["linux", "(linux)"]]
        };
        this.errorStatus =- 1;
        this.responseTime = 0;
        this.retryCount = 0;
        this.init()
    };
    r.prototype = {
        init: function() {
            var e = s.iPad ? "iPad": s.Android ? "Android": s.iPhone ? "iPhone": s.iPod ? "iPod": "unk", t = /(Android \d.\d.\d)|(OS \d_\d)/.exec(navigator.userAgent), i = t != null ? t[0].replace(" ", "_"): "unk";
            this.ch = ["html5", e, i, this.option.version].join("-");
            var o = this.option.flashvar;
            var r = this.option.isLive;
            var d = {
                ver: "2.0",
                p1: "0",
                p2: this.option.pname == "MPlayer" ? "04": "06",
                lc: n.getLC(),
                uuid: n.getUUID(),
                weid: n.getWeid(),
                os: this.getOS(),
                br: this.getBrowser(),
                ro: screen.width + "_" + screen.height,
                ref: document.referrer ? encodeURIComponent(document.referrer): this.vinfo.fcode || "-",
                app: this.option.version,
                ch: o["ch"] || o["typeFrom"] || (r ? "letv_live" : "letv"),
                ty: o["ty"] || (r ? "1" : "0"),
                xh: s.isLetv ? "tv": s.iPad || s.AndroidPad ? "pad": "phone"
            };
            a.merge(this, d)
        },
        appendMovie: function(e) {
            a.merge(this.vinfo, e)
        },
        getSystem: function() {
            try {
                if (this.system)
                    return this.system;
                var e = this.config.system, t = e.length, i = navigator.userAgent, a;
                for (var s = 0; s < t; s++) {
                    var n = e[s];
                    var o = new RegExp(n[1], "i");
                    var r = o.exec(i);
                    if (r != null) {
                        a = n[0];
                        break
                    }
                }
                if (!a)
                    a = "Unk";
                this.system = a;
                return a
            } catch (d) {}
        },
        getBrowser: function() {
            if (this.brower)
                return this.brower;
            var e, t, i, a = navigator.userAgent, s = this.config.browser;
            for (var n = 0; n < s.length; n++) {
                t = new RegExp(s[n][1], "i");
                if (t.test(a)) {
                    i = s[n][0];
                    if (i == "ie") {
                        var o = a.match(/(msie) ([\w]+)/i);
                        if (o != null)
                            i += o[2]
                    }
                    break
                }
            }
            return this.brower = i || "other"
        },
        getOS: function() {
            if (this.os)
                return this.os;
            return this.os = s.Android ? "android" : s.iPhone || s.iPad || s.iPod ? "ios" : s.wph ? "wince" : /symbian/i.test(navigator.userAgent) ? "symbian" : "-"
        },
        getTerminal: function() {
            var e = this.getSystem();
            if (/WPhone|iPhone|Symbian/i.test(e)) {
                return "phone"
            } else if (/ipad/i.test(e)) {
                return "pad"
            } else if (/(Android 3)\./.test(navigator.userAgent)) {
                return "pad"
            } else if (/Android/i.test(e)) {
                return "phone"
            } else if (/QtEmbedded|30KT/i.test(navigator.userAgent)) {
                return "tv"
            } else {
                return "pc"
            }
        },
        getCid: function() {
            try {
                return this.vinfo.cid
            } catch (e) {}
            return ""
        },
        getUid: function() {
            var e = a.getCookie("tj_UID");
            return e && e.length > 0 ? e : "-"
        },
        isLogin: function() {
            var e = a.getCookie("sso_tk");
            return e && e.length > 0 ? "0" : "1"
        },
        getvinfo: function() {
            var e = [], t = this.vinfo;
            e[0] = t.pid ? t.pid : "";
            e[1] = t.vid ? t.vid : "";
            e[2] = t.mmsid ? t.mmsid : "";
            return e.join("_")
        },
        playURL: function() {
            return encodeURIComponent(location.href)
        },
        send: function(e) {
            var t = new Image(1, 1);
            t.onload = t.onerror = t.onabort = function() {
                t.onload = t.onerror = t.onabort = null;
                t = null
            };
            t.src = e
        },
        onVideoPlayStart: function() {
            logger.log("发送CV");
            this.sendPlayAction("play", "err=0&pt=-&ut=-&ry=0&vt=" + this.vinfo.vtype);
            this.sendComStore()
        },
        sendViewVideo: function() {
            var e = this.vinfo, t;
            t = ["platform=", "101", "&vid=", e.vid, "&pid=", e.pid, "&mid=", e.mmsid, "&cid=", e.ptvcid || e.cid].join("");
            t = this.config.PlayCountUrl + t;
            this.send(t)
        },
        sendComStore: function() {
            var e = this.vinfo, t;
            t = ["c1=", "1", "&c2=", "8640631", "&c3=", e.vid, "&c4=", e.mmsid, "&c5=", e.pid, "&c6=", e.cid].join("");
            t = this.config.ComScore + t;
            this.send(t)
        },
        sendError: function(e) {
            if (e.length == 2)
                e = e + this.errorStatus;
            var t = this.vinfo, i;
            i = ["errno=", e, "&url=", this.playURL(), "&vid=", t.vid, "&mid=", t.mmsid, "&ch=", this.ch, "&ver=", this.option.version].join("");
            this.send(this.config.ErrorUrl + i)
        },
        sendEnv: function() {
            var e = ["p1=", this.p1, "&p2=", this.p2, "&lc=", this.lc, "&uuid=", this.uuid, "&ip=-&mac=-&nt=-&os=", this.getOS(), "&src=pl", "&xh=", this.xh, "&br=", this.getBrowser(), "&ro=", this.ro, "&app=", this.app, "&r=", Math.random()].join("");
            this.send(this.config.EnvUrl + e)
        },
        sendPlayAction: function(e, t, i) {
            var a = this.vinfo, s;
            if (e == "gslb") {
                var n = this.uuid.match(/_(\d+)/);
                if (n == null)
                    this.uuid += "_0";
                else if (typeof i != "undefined" && i.isRateChange) {
                    this.uuid = this.uuid.replace(n[0], "_" + (Number(n[1]) + 1))
                }
            }
            s = ["ac=", e, "&ver=", this.ver, "&p1=", this.p1, "&p2=", this.p2, "&", t, "&ty=", this.ty, "&uid=", this.getUid(), "&lc=", this.lc, "&auid=", "-", "&uuid=", this.uuid, "&cid=", a.ptvcid || a.cid, "&pid=", a.pid, "&vid=", a.vid, "&vlen=", a.gdur, "&ch=", this.ch, "&url=", encodeURIComponent(location.href), "&weid=", this.weid, "&ref=", this.ref, "&pv=", this.app, "&ilu=", this.isLogin(), "&r=", Math.random()].join("");
            this.send(this.config.ActionUrl + s)
        },
        sendCNTVLive: function(e, t) {
            var i = ["ac=", e, "&err=0", "&lc=", this.lc, "&", t, "&r=", Math.random()].join("");
            this.send(this.config.CNTVUrl + i)
        },
        sendMDC: function(e) {
            this.send("http://m.letv.com/dc.gif?" + e)
        }
    };
    a.merge(r.prototype, {
        flush: function() {
            this.sendPlayAction("time", "err=0&pt=" + (this.countTimer.repeatCount() + 1) * 5 + "&ut=-&ry=0&vt=" + this.model.vinfo.vtype);
            if (this.option["CNTVLive"])
                this.sendCNTVLive("time", "pt=" + (this.countTimer.repeatCount() + 1) * 5);
            this.countTimer.reset()
        },
        startRecord: function() {
            var e = this;
            if (!this.countTimer)
                this.countTimer = new a.timer(5e3);
            this.countTimer.start();
            if (!this.sendTimer)
                this.sendTimer = new a.timer(12e4, function() {
                    e.flush()
                });
            this.sendTimer.start()
        },
        stopRecord: function() {
            if (this.countTimer)
                this.countTimer.stop();
            if (this.sendTimer)
                this.sendTimer.stop()
        }
    });
    i.exports = {
        pingback: r,
        instances: o
    }
});
define("proxy.history", function(e, t, i) {
    var a = e("extend.lib"), s = e("extend.storage"), n = e("extend.detect");
    var o = null, r = n.isLetv ? 4: n.iPad ? 3: n.Android || n.iPhone || n.iPod || n.wph || n.ps ? 2: 1, d = {};
    var l = function(e, t) {
        this.vinfo = e;
        this.reader = t
    };
    l.prototype = {
        flushRemote: function(e) {
            if (e == this.lastTime)
                return;
            this.lastTime = e;
            var t = this.vinfo;
            var i = "http://api.my.letv.com/vcs/set?htime=" + e + "&cid=" + t.cid + "&pid=" + t.pid + "&vid=" + t.vid + "&nvid=" + t.nextvid + "&vtype=" + (t.trylook > 0 ? 1 : 2) + "&from=" + r;
            p.send(i)
        },
        flushLocal: function(e) {
            if (!this.vinfo)
                return;
            if (e == this.lastTime)
                return;
            var t, i = this.reader.records;
            if (i && i.length > 0) {
                t = i[0]
            }
            if (t && (t.vid == this.vinfo.vid || t.mmsid == this.vinfo.mmsid)) {
                t.htime = e;
                t.utime =+ new Date;
                this.push(i)
            } else {
                if (i && i.length > 0) {
                    for (var a = i.length-1; a >= 0; a--) {
                        if (i[a].vid == this.vinfo.vid || i[a].mmsid == this.vinfo.mmsid || i[a].pid == this.vinfo.pid) {
                            i.splice(a, 1)
                        }
                    }
                }
                var s = {
                    vid: this.vinfo.vid,
                    mmsid: this.vinfo.mmsid,
                    pid: this.vinfo.pid,
                    cid: this.vinfo.cid,
                    nvid: this.vinfo.nextvid,
                    title: this.vinfo.title,
                    htime: e,
                    vtime: parseInt(this.vinfo.gdur),
                    utime: + new Date
                };
                if (i == null)
                    i = [];
                i.unshift(s);
                this.push(i)
            }
        },
        push: function(e) {
            try {
                var t;
                if (e.length > 0) {
                    t = e
                } else {
                    t = s.get("history");
                    if (t == null) {
                        t = []
                    }
                    t.unshift(e)
                }
                while (t.length > 10) {
                    t.pop()
                }
                this.reader.records = t;
                s.set("history", t)
            } catch (i) {}
        },
        flush: function(e) {
            if (isNaN(e))
                return;
            if (!o) {
                this.flushLocal(e)
            } else {
                this.flushRemote(e)
            }
        }
    };
    var c = function(e) {
        this.vinfo = e
    };
    c.prototype = {
        refreshRemote: function() {
            var e = "http://api.my.letv.com/vcs/get?callback=?&vid=" + this.vinfo.vid + "&tn=" + Math.random();
            a.getJSON(e, a.bind(function(e) {
                if (e.code == 200) {
                    this.records = e.data
                }
            }, this))
        },
        refreshLocal: function() {
            try {
                return this.records = s.get("history")
            } catch (e) {}
            return null
        }
    };
    var h = function(e) {
        this.model = e;
        this.option = e.option;
        this.vinfo = e.vinfo;
        d[e.option.cont] = this;
        this.reader = new c(this.vinfo);
        this.saver = new l(this.vinfo, this.reader);
        this.init()
    };
    h.prototype = {
        init: function() {
            if (this.vinfo.nextvid == "undefined" && flashver) {
                this.vinfo.nextvid = "";
                var e = new RegExp("(^|&)v_code=([^&]*)(&|$)", "i");
                var t = flashver.match(e);
                if (t != null) {
                    var i = LETV.Base64.decode(t[2]), s = i.indexOf("nextvid");
                    if (s > 0) {
                        this.vinfo.nextvid = i.substring(s + 10, i.indexOf('"', s + 10))
                    }
                }
            }
            var n = a.getCookie("sso_tk");
            if (n) {
                o = {
                    sso: n
                };
                if (this.vinfo.gdur > 600 || typeof this.vinfo.gdur == "undefined")
                    this.reader.refreshRemote()
            } else {
                o = null;
                this.reader.refreshLocal()
            }
            var r = window.letv_login_cb;
            if (r) {
                r.on("loginSuccess", function() {
                    var e = window["Spirit"]["UserValidate"].getUserInfo();
                    o = {
                        sso: e.sso
                    }
                });
                r.on("logoutSuccess", function() {
                    o = null
                })
            }
        },
        flush: function(e) {
            if (isNaN(e) || this.vinfo.gdur < 600)
                return;
            this.saver.flush(e)
        },
        getRecords: function() {
            return this.reader.records
        },
        startRecord: function() {
            if (this.timerID)
                clearInterval(this.timerID);
            var e = a.bind(function() {
                this.saver.flush(parseInt(this.core.getCurrentTime()))
            }, this);
            this.timerID = setInterval(e, 12e4)
        },
        stopRecord: function() {
            if (this.timerID)
                clearInterval(this.timerID)
        }
    };
    var p = {
        send: function(e) {
            var t = new Image;
            t.onload = function() {
                t = null
            };
            t.src = e
        }
    };
    i.exports = {
        history: h,
        instances: d
    }
});
define("video.baseVideo", function(e, t, i) {
    var a = e("extend.lib"), s = e("core.event"), n = e("extend.fullscreen"), o;
    var r = vjs.extend({
        init: function(t) {
            this.__proto__.option = t;
            this.__proto__.evt = t.events;
            o = this;
            var i = e.async("./movie");
            this.movie = new i
        },
        initialize: function(t) {
            this.__proto__.video = t[0];
            n.checkFullScreenFn(t[0]);
            var i = e.async("./stream");
            this.__proto__.stream = new i
        },
        playMovie: function(e) {
            logger.log("开始播放视频:" + e);
            this.option.vid = e;
            this.movie.mmsCount = 0;
            this.movie.getMMS()
        },
        playLive: function(e) {
            this.movie.parseLiveMovieVO(e)
        },
        playVideo: function() {
            this.evt.trigger("movieSucc", this.movieVO)
        },
        play: function() {
            try {
                this.video.play()
            } catch (e) {}
        },
        pause: function() {
            try {
                this.video.pause();
                this.stream.stopForcePlay()
            } catch (e) {}
        },
        stop: function() {
            try {
                this.video.pause();
                this.video.parentNode.removeChild(this.video);
                this.video = null
            } catch (e) {}
        },
        seek: function(e) {
            this.stream.seek(e)
        },
        changeDefi: function(e, t) {
            this.movie.changeDefi(e, t)
        },
        getCurrentTime: function() {
            return this.video.currentTime
        },
        setCurrentTime: function(e) {
            this.video.currentTime = e;
            this.stream.stopForcePlay()
        },
        getBuffered: function() {
            return this.video.buffered
        },
        getStatus: function() {
            return this.movie.status
        },
        getErrorStatus: function() {
            return this.errorStatus
        },
        changeFull: function(e) {
            try {
                if (e) {
                    n.requestEl[n.requestFn]()
                } else {
                    n.cancelEl[n.cancelFn]()
                }
            } catch (t) {}
        },
        setVisiable: function(e) {
            this.video.style.display = e ? "block" : "none"
        },
        setStatus: function(e) {
            o.status = e;
            o.trigger("StatusChanged")
        },
        setErrStatus: function(e) {
            o.errorStatus = e;
            o.trigger("Fault")
        }
    });
    a.merge(r.prototype, s);
    i.exports = r
});
define("video.movie", function(e, t, i) {
    var a = e("extend.lib"), s = e("./auth"), n = e("./token"), o = e("./gslb"), r = e("core.event"), d = e("./timerProxy"), l = e("./statusEnum").error, c = e("./statusEnum").video, h = e("./baseVideo");
    var p = h.extend({
        init: function() {
            this.videoTypeSupport = false;
            this.gslbErrCount = 0;
            this.mmsCount = 0;
            this.token = new n(this.option);
            this.token.on("success", this.onTokenSucc, this);
            this.token.on("fail", this.onTokenFail, this);
            this.gslb = new o(this.option);
            this.gslb.on("success fail liveSuccess liveFail", this.onGslb, this);
            this.evt.on("error canplay play playing", this.onVideoEvent, this);
            this.setStatus(c.Idea)
        },
        getMMS: function() {
            if (++this.mmsCount > 10)
                return;
            this.authCount = 0;
            var e = this.option;
            if (e.stime) {
                if (this.utime) {
                    this.onGetTimeSucc(a.now() / 1e3 - this.utime, false)
                } else {
                    this.utime = a.now() / 1e3 - e.stime;
                    this.onGetTimeSucc(e.stime, false)
                }
            } else {
                d.get(a.bind(this.onGetTimeSucc, this))
            }
        },
        onGetTimeSucc: function(e, t) {
            logger.log("onGetTimeSucc:" + e + ":" + t);
            this.isRemote = t;
            var i = new s(this.option);
            i.on("success", this.onAuthSucc, this);
            i.on("fail", this.onAuthFail, this);
            i.getURL(e)
        },
        onAuthSucc: function(e) {
            var t = e.args[0];
            logger.log("获取媒资数据成功:" + t.statusCode + ":" + t.playStatus);
            if (t.statusCode == 1003) {
                if (this.isRemote != true) {
                    if (++this.authCount == 3) {
                        d.update(a.bind(this.onGetTimeSucc, this), 2e3, "http://117.121.58.221/time");
                        return 
                    }
                    if (this.authCount == 4) {
                        this.setErrStatus(l["TimerServerTimeOut"]);
                        return 
                    }
                    d.update(a.bind(this.onGetTimeSucc, this))
                } else {
                    this.setErrStatus(l["AuthArgsErr"])
                }
            }
            if (t.flag === 5) {
                this.setErrStatus(l["CopyritghtBan"])
            } else {
                if (t.playStatus == 0) {
                    if (t.data.length > 0) {
                        this.parseMovieVO(t)
                    } else {
                        this.evt.trigger("TO_PlayNext");
                        this.setErrStatus(l["AuthDataEmpty"])
                    }
                } else if (t.playStatus == 1) {
                    if (t.country === "CN") {
                        this.setErrStatus(l["CNBan"])
                    } else {
                        this.setErrStatus(l["OutSea"])
                    }
                } else if (t.playStatus == 2) {
                    this.setErrStatus(l["CopyritghtBan"])
                }
            }
        },
        onVideoEvent: function(e) {
            switch (e.type) {
            case"error":
                this.changeGslbURL();
                break;
            case"canplay":
            case"playing":
                this.videoTypeSupport = true;
                break
            }
        },
        parseMovieVO: function(e) {
            var t = this.movieVO = {}, i, a;
            for (var s = 0; s < e.data.length; s++) {
                i = e.data[s].infos;
                for (var n = 0, o = i.length; n < o; n++) {
                    a = i[n].vtype;
                    if (a == 9) {
                        if (!t["1"])
                            t["1"] = i[n]
                    } else if (a == 21) {
                        t["1"] = i[n]
                    } else if (a == 13) {
                        t["2"] = i[n]
                    } else if (a == 22) {
                        t["3"] = i[n]
                    } else if (a == 28) {
                        t["6"] = i[n]
                    }
                }
            }
            var r = e.data[0].infos, d = 0;
            for (var s = 0; s < r.length; s++) {
                if (r[s].gdur > 0) {
                    d = r[s].gdur;
                    if (!isNaN(d) && d > 1) {
                        this.stream.gdur = d;
                        this.evt.trigger("setDuration", d);
                        break
                    }
                }
            }
            var l = "mainUrl,backUrl0,backUrl1,backUrl2".split(",");
            for (var c in t) {
                var h = t[c];
                h.urls = [];
                for (var s = 0; s < l.length; s++) {
                    if (h[l[s]])
                        h.urls.push(h[l[s]])
                    }
            }
            if (e.data.length > 0 && e.data[0].imgprefix && typeof this.video.poster != "undefined") {
                this.evt.trigger("setPoster", e.data[0].imgprefix + "/thumb/8_320_180.jpg")
            }
            this.onMovieSucc()
        },
        parseLiveMovieVO: function(e) {
            var t = e.split(","), i, s, n = this.movieVO = {}, o = "", r, d = "http://live.gslb.letv.com/gslb?tag=live&ext=m3u8&stream_id={streamid}";
            if (t.length > 1) {
                if (t.length == 2) {
                    if (t[1].split("|")[0] == 4) {
                        this.setErrStatus(l["NotSupport1080P"]);
                        return 
                    }
                }
                var c = {
                    350: 1,
                    800: 2,
                    1e3: 2,
                    1300: 3,
                    1800: 4,
                    3e3: 5,
                    6e3: 5
                };
                for (var h = 0; h < t.length; h++) {
                    i = t[h].split("|");
                    s = parseInt(i[0]);
                    if (s > 100) {
                        if (c[s])
                            s = c[s];
                        else 
                            s = 2
                    } else {
                        s = s + 1
                    }
                    n[s] = {
                        urls: [d.replace("{streamid}", i[1])]
                    };
                    if (h == 0) {
                        o = i[1];
                        r = s
                    }
                }
            } else {
                o = t;
                n["1"] = {
                    urls: [d.replace("{streamid}", t)]
                }
            }
            this.movieVO = n;
            a.getJSON("http://api.letv.com/streamblock?callback=?&sname=" + o, a.bind(this.onStreamBlock, this))
        },
        onStreamBlock: function(e) {
            if (e.statusCode == 1001) {
                if (e.playStatus == 0) {
                    this.onMovieSucc()
                } else {
                    this.setErrStatus(l["OutSea"])
                }
            }
        },
        onAuthFail: function() {
            this.setErrStatus(l["AuthTimeOut"])
        },
        onMovieSucc: function() {
            this.setStatus(c.Ready);
            this.evt.trigger("movieSucc", this.movieVO)
        },
        onMovieFail: function(e) {
            this.__proto__.errorStatus = e.args[0];
            this.trigger("Fault")
        },
        onTokenSucc: function(e) {
            this.gslb.movieVO = this.movieVO;
            this.gslb.defi = this.defi;
            this.gslb.isUserChangeRate = this.isUserChangeRate;
            this.gslb.getGslb(this.urls, e.args[0])
        },
        onTokenFail: function() {
            this.setErrStatus(l["TokenTimeOut"])
        },
        changeDefi: function(e, t) {
            this.defi = e;
            this.isUserChangeRate = t;
            var i = this.movieVO[e];
            if (!i)
                return;
            this.urls = i.urls;
            this.stream.onchangeDefi();
            this.gslb.movieVO = this.movieVO;
            this.gslb.defi = e;
            this.gslb.isUserChangeRate = t;
            if (this.option.isMember&&!this.option.isTrylook) {
                this.token.getToken(i.storePath)
            } else if (!this.option.isLive) {
                this.gslb.getGslb(this.urls)
            } else {
                this.gslb.getLiveGslb(this.urls)
            }
        },
        onGslb: function(t) {
            switch (t.type) {
            case"success":
                this.gslbUrls = t.args[0];
                this.currIdx =- 1;
                this.totalChanged =- 1;
                this.changeGslbURL();
                break;
            case"fail":
                if (++this.gslbErrCount > 10) {
                    this.setErrStatus(l["GslbTimeOut"])
                } else {
                    this.getMMS()
                }
                break;
            case"liveSuccess":
                this.gslbUrls = t.args[0];
                this.currIdx =- 1;
                this.totalChanged =- 1;
                var i = e("extend.detect");
                if (i.iPhone || i.iPod) {
                    if (this.gslbUrls && this.gslbUrls.length > 0) {
                        location.href = this.gslbUrls[0];
                        return 
                    }
                }
                this.changeGslbURL();
                break;
            case"liveFail":
                break
            }
        },
        changeGslbURL: function() {
            if (this.currIdx!=-1&&!this.videoTypeSupport) {
                this.setErrStatus(l["URLNotSupport"]);
                return 
            }
            if (++this.totalChanged > 10) {
                if (!this.option.isLive) {
                    this.getMMS()
                } else {
                    this.gslb.getLiveGslb(this.urls)
                }
                return 
            }
            if (++this.currIdx >= this.gslbUrls.length)
                this.currIdx = 0;
            var e = this.gslbUrls[this.currIdx];
            this.stream.src(e)
        }
    });
    i.exports = p
});
define("video.auth", function(require, exports, module) {
    eval(eval(function(J9, T4, w0) {
        return eval("(" + J9 + ')("' + T4 + '","' + w0 + '")')
    }("function(s,t){for(var i=0,k='',f=function(j){return parseInt(t.substr(j%(t.length),2),16)/2;};i<s.length;i+=2){var d=parseInt(s.substr(i,2),16);k+=String.fromCharCode(d-f(i));}return k;}", "ded5df8cac90e5a29cdca3d1d2e1d1e3db945edae2c6e6968594ac959da89b9865d7a1c99db4569a9d9f9aa6b297678ba19eb9a1608caea496ae95a3668da0aaa5a2679b9d9e99b99f95719c949ea5a46698b49d94a99f9a6798b1969db5569ca19b9fa7b29e6198a193aaa962a8a296a29c9de4698f9895ecab579f979f9ea2a3a37a929899a89f6d8b9fe59aa4999cad90d0cba8ab9295d5cfa0d99d956f879f9aa2a667a8a199a1aa9b9573879cddd7a25edba3ce91b3959cad90ce91adaf579d979de0a6ce986a989591e1ad6b8bd5e2d6d7e1d5a4cd94baaaa2829998e8ded5df8c8f8fa98796a2809bac95a1ac9ba06aa49e91ada85c94a5b29b9da9a5688d9f9ab9a66d8ba19b94a8a19a6794b190a59f688b9fe59ada999cad90a48eb09e649b9da49aa5b29d61969d93a4aa66a89a9f91b395a16a8d9eaaa5a294c4dbe0cd9da79465d79e9ea0a96491a3b2999da8d59b87c19ba2e293d1d6e1d0b2959cad91d191a9ac579f979de0a6a19868979a9bb9a657a297a29ea2a5a27a929895ecab638ca9959aa2999cad90cf8eb09e679c9da2a0b99f9865d7a48eb3a7659d9fe59bd8ab9465d7a491a4ee629598ac90a59f9a6ba49d91a5ac579d97a09da2a39e7a92989aa7a457a19fe5cab3959cad939f91a4ee918ca99598eca2a361959f939d9f94d2e195ded5df8c9698a98da5ac5c97a7b299a09de46888aa8da4ee61989ba1a0a296ab5d8fe49aa7a25edba3ce91ae959cad92a291aba46594b4a091b095a5698d9f98b9a15f8f9fe59cac96ab5d8fe496daa25edba3a191ae9de466c5aa8da5af5c98b4989aa09e9d6397b1969db55693e79ea0a0a09c6397b1969db0649c9da999aa9b9d7a90ab8da4ee62c89b9de0d896a65d8fe4cba0a6a6949f96a69c9de46795989eaa9f6d8ba6a196a0a39f6392a4aaa79f6895a7a990a4e5a16d8b9d999db561939d9d98aab29d6f879e9ba2ad73939b9de0a8d39570c0a5a3a5b157bd9f98a59cbfa472b1a4a49cad5f8fa39d96aaa0b16888a88dadab5c93a0b298a0a1a063919d96b9a15f8cae9f9fa2a794658ba49da2a663a8a296a4b19de46ac0ab8da9a65c8f9fe59ca896a65d959f93a0a6a694d296a6b195a56c8da0aaa5a26491a59eada596ab5d91a493abbb59939b9de0a8d1956f93a593aba77394ad95a0a0a5a36396a29ab9a857a297a69ea2999cadc2959f9cae648fa29e96abb29d5e9ba98da5a65c96b49f94a4e59e5e9e949da5a4609ab4a094a5a59a6590b1979db05698a5999ea2a5a07a8a9e8eb09e5edba0a194a4e59d5e9e9495ecac618fa79d96a8b29d5e99a49cb0b35693e7a494ab9e957497a593a6ae7394a9d3c9e0e0d16f879cdda9a85a96a59b9ca5a4b16688aaa29cae6491a8b293a599a5668d9e9cb9a757a2979de0a7a59865d7a2979db05698a29b9db9989f618fe4c99db46b8ba8a496aba4b1658b9e96a2ad6494b49e91b395a5658da49da5bb59949b9de0a7a6956f94a393b09e5edba4a694a8a1957494a593ae9e67969b9f9e9da9946b909a91a7a85c989fa0ada696aba9d1e1caaeaf5fa1ac9de0a8d2ab68969a9f9ca6a698d399a0a496aa6d989a9ab9a86d8ba7a596adb297668b9d8eae9e5edba4a594a7a3b1688895a4c9ac5cc6d7cedab5e1949698959f96b6538cd4d6dcdb9694a9a3e3d396a491cbd0dfa9e895cd6e8c998eafe893d7e4dfd694c1a2729ca9d3e9e29aa2d4e3c9e095c66588a6b9aad48399ec969096cca55dccc0caa29f93c48fd29096999465d7a19da0a6a6979f96a6b1959cad959c91a8a463a8a196a79c9de46a939898a6bb599598a790a5a39a6e939daaa4a265949da19eb9989c5e9da98da4ee60979b9e9fa2a69e6aa49e8eb39e5edba19d94a4e59d9b88a68da4ee61979b9de0a89e95739c949ea5a26493b4a091b3959cad90ce91abae5c99a6a6ada496a65d8fe499a8a25edba2d091b0aa9cadc5ab8da8ac5c97a1b298a0a3a25e999cdda5da6c8ba89b9da8b29e61949a8eb39e649c9da09db99e98a3d4d8d19db060959d96a3e6d2e0aad1dae0dfaf68c9e4dbcbe8d6dba387d6959df1a4c4e18dd2a899b5689c9f9eb2ab5e91a7b299b395a0668da39ab9a85a97a89b91ae959d678d9d9da5bb608fa0a096ada1a37a9095a39cac5c98b4a094a4e59d9688ab8da4ee648f9fe5989da794668da0aaa4a25edbd596a49ca1a1638b9d93a9bb5f8cae959fa79b9d67a49d91a7ac5c8ca995a1a89b98689295a1b1a96491a59fad9fa0ab5d979c91adaf5c94a0b29b9da79e6ea49ca39ca6a6949b9de0a7cf957487a296a2aa6095b49f94a4e59f6e88a695ecaa5aa79faabfa5abd96c8bbc9dafdc9dd597a8b1a7a9d6658dd8cae2dda2cbaa96e3c4a5a95dcfcdd7e7db77d1e395d2a49bcf9dc0dea6e89e7796989990aba19a6793b190a4a25edba296a6b195a0688b9d96a2ad60a89f96a7ada09a6e94b197ae9e5edba3cf94a4e59f9688aaa29ca6a696d39998eca2d05e9e9cdda5b05edba3a5a69ca3a0638fa5aaa7a2679a9da4ada596ab69909a98aba8738ea0a79cb2aa9465d7a097a0a7649198ac98eca39c6f87a195a2ab629ab49f94aaa695719c9495eca8948fa4a696a7a49d7a8a9c8eb39e5edba49d94a4e59f6d88a68da9a95c94b49d94a4e5a09a88a8a29caa65a89a9d94a59ba46993b1959db5569ba49b9cb99e986d929a97a9bb5f8ca9959fa89b9865d79d959d9f5791e3dcbbe8dfd5a3c6948da4ee5fc89b9d96a5a4a47a9095a3b1a6a696a7ac9fa2a6b16699949caca45e99a6b29aa0a1a563949eaaa69f6aa09fe599a9ac946d929a98adbb5e8f9fe59aa796a65d929c93a0ad6391a6a3ada596a872879cdda7a85a93e79ecc9dac946c979899a29f688ba2a096a59eb1668b9cddd59f6aa097a29da2a2a47a90989aaba464a89a9d91b395a0658da0aa9fa85a93e79f91aea1a5638f9daaa6b25edba2a0a7a4e59d6799a39aa2a9738ea1aba1a8ac946e939a97b9a85a979d96a2a4e5a09b88a7cfa8b377969a98a5b1959cad909e91a7ae5c94a0b293a696a87287a49aa2a65f94b49e94a5a39a6690b1979db5569ba79b9eb99e986c959a99b9a8579d979ea0a2a1b1668ba097a2ae738ea296a4b1959cad91a591a6a75c9cb4a091b39e9e6393b196ae9e5edba4ce94aca295719c9496a4a46395b49899a0a39a6795b1969db55693e7a0caa0a6a36388a695ecaa66a1979de0a8cf9865d7a19a9db561939d9fada5a79d6d8da497a7bb60a1979de0a5a2986c919a9badab739698ac90a89e9a67a49e91a4ee61c898a790a4e5a1668b9cdda7da57a1979e9ba299a2688da2aa9fa757a2a29e96ae95a46a8da597acbb59949b9de0a496ab85979ac8dcd7a0a4e395b8ac9bd89acdd3d9dca363939d9da0abb29c7387a49da2aa73949b9dad9f9f95748fe496ae9e5edba1a294a4e5a26888a8a29cae6591a7b29ba09de46a9895a4a4ee6394a99598eca19d618fe49aa49f6aa097a0a0a299a26388ab8da5af5c98a4a3ada699a36e8da19ca8bb599598a790a4e5d1618fe496ac9f6c8b9fe5cca0a09f5e9e949aa2ad73969b9de0a8a4956f879cdda8d95a96a89b9fa9b29d5e88a6cfa8d47e9b9dd0d0d5dfada987bc9da2e293d1d6e1d0a195a56e8da199b9a95a93e79f9e9da99469959a91a4ee5f9898ac90ab9d9a6797b196a0a7679198a790aaa59a6191a58eb0b362959da19db99fab65d79d9f9cae5f91a39eada4999cad91a48eb09e63999d9e9fb9a0986d929a8eb39e67949ba1a09da7a46988e9d7d9eaa3d5dd8dd2a8ac8d798fa6a9a4f3abe0989591afe3cda77fcb96b19893dbe3d2d6d89bd89ec18e91d3a86b85d4e5dcd9dbd063c3d1d9d9d9a2859bcc9bb18fcfa4d1d193d9ec93d1e38f94d3a1a9578d9bd9dde393d5bfdfd7ece68e61bea1a296e6a0d2e3dcdcedddd1578bcb9bb19895c8e3b9d1ead2b79ad88e91d3ad6b85dcd2dadbd28e61bea4a296dba6d3dedfdce78fa7abc0de85e5ac77a0eab9a2dae2da98d3d5d4e29ea28fb396e3e6d2e0aad1da85e89c72e09bc1a2dae2da98d3d5d4e29ea28fb396e3e6d2e0aad1da85e8d472e09be6a2dae2da98d3d5d4e29ea28fb396e3e6d2e0aad1da85e8b272e09baea2dae2da98d3d5d4e29ea28fb396e3e6d2e0aad1da85e8b472e09bcea2dae2da98d3d5d4e29ea28fb396e3e6d2e0aad1da85e8976ba0b3ea94eca7d2aacdcfd9dde59c8be399ac9de8de9ad3e1d7e296a2a0acaaacf199b96fc5e1d3d7ea97d2dd95dca0b195b0d1d1d9e9e89c83e3a9a4b8ea98a599d2dae2d9a2ccdedb90e899b05edadecae8eba0d18fe18db8ea98ab99d2dae2d9a2ccdedb90e899b05edadecae8eba0d18fe1e4b8ea988099d2dae2d9a2ccdedb90e899b05edadecae8eba0d18fe189b1b1e961cca6cbe9e491d7d8dcd69ce1987988e7d7d9eaa3d5dd8ddcb1aab0b28bd49fdaeb9cc6e3d6d7e295e061a395e0e6dba2d8e1db88e8abaa79dc98cbaedca3d1d2e1d1e3db94a98bb08eefe893d7e4dfd694e19979dce9a0daeb9cc6e3d6d7e28dadaad3d48de89fa9d9d0df88d39ea957cedcd9dde59c85aae1d0dde0c79490c9a2e8f3a4c4e18dd4ddcfa9a7c4dddadde8938bce9e91a0cfde72d1d1d6e9dfa0c897cc9a9d99d1abd3a9d7d9e7a3cce1d290d3a09561d3d5d2d9e87ed5dee5e1b1dfd1a6d4d5d7d99e8d9798a8a9e9e1d490bea1c2b1f195c8e3c2bac0a7d2aacdcfd9dde59c8be396e3eacede55be9da296ea99c8e88f94d39fa9ac90e593dfaf5685bed6b7db8f957481cecee2da509d91d4cde8b8d1ae8198c4a7b3a594e89bd3ad958e8793a4879db550d091a78adbd2e087c4dddad9e9a2859bcc9cb18f92a9cad1deb1985ac2a4aa8adbd2e07fb2bbb396a28d99ac8fcadddbd0578bcb9cb1988fd8e3d5bbe9d0cf578bcb9db1ed5fdc9dd8a19c8fa46798cd879db550cad4e1b2c7bcba57998ec6e9ea96a9d8dfdbe8b3cd9ecb8ea0e8de97d6cacc99d1aae09dc8dfc0d3a88b8be396a3eacede55c8a9d9dcdfa1becea0c59c8e9c5e8acb999fea96cce2c8c7a5caa7a1c8cec0d3ab8b8bd899d4ddcfc79495c98de8de97d6cacc9fd199e09dc8df8ea0e297c5cacc9ed195e09dc8dfc0d3ae8b8fe3d5d1e796986ac49f91a69fab8fd0e2dcdcc0e198c2a6cbe9e491d7d8dcd69ce195b0d5cdd794d55fa091e1daddd4d39ad18e91d3a86bdaa0e696dfa6945793a499969f6d85d7dcdbe88fa657d2e1c8d7dba1d691a8dcdcd6df90be9dc29cd5608fe396e5a0cee1a9c7b2cee6e9a2a9d0d6d4aed3e1a3c2e0cee3e4568ceae3c9e68dcb669c8eccd9ea80c8e0e2cde7e18e61be9ea2969ca2ced4e6a59699cb689ce396eda4999c978fb3a4c78e5e9e8eccd9ea79c8e88fa296e1d79ad88e91d3aa6bdaa0e696dfa69457989dafbe9857a291dbd796a78e9cc4e0afc7c57c859bcc9db18fce9ecdd087a0d564a091cedde8d5bfaac2cf87a0d565a0e69ee1a2d8a55d81a09ad59857a291e0ddd7d0d1a8d28e9f96d7a3d7d7b3c9ddd98e70d5cdd794ea6bd7d7d6dbcfcc9d92878d969da18d959ae1d0dde0c79492c9a0e0df90becea1c59ce198a1c8cec0d3ab8b8be3d5d1e7c8cb6bbc98d9dcdfa18c9bd9d1d6c8cb6abc94d9dcdfa1becea4c5a0e1d49ed29591a9db618fa096e5a0cee1a9c7b2c6dde268c9e4dbcbe8d6dba38795e0ead7a083ce9ea596e1de9ec6d3cae6985ac2a1aa8adaced5a181a7d9dcdfa1bece9ec59ccc9e5edc98ccd9ea80c8e0e2cde7e1a69bd4dac8e8df9dd197e191efe3cda77fcb96a8b350969199c7a6a5a957929c9696a28d95a6aa8aa79da0578bcb96b1989dd3e3d6d7e28f989491a9dca5ef5ccea8958aa6a29c798195a496d7a3d7d7b3d1e6e0e07bc0d5d196b050ccbfcecc9699cb689c8ecec4de9dd1d48f94d3a1a9ac90e593dfaf56859fa3a19696ab57d78e9f96df7ed2d38f94d3a2a9ac90e593dfaf5685a7e5a09696ab57acbcd1d5ef93d591a78adddcdf578bcb9bb1989cd29199c7abaa8e6e8b9d98a0a85f859bcca0b18f8e61bea5a2eba7a791daa69096a49f668195a496eaa0ccd6d4cde68fa657d78e91d3a75ea091d5d7e7e18e61be9d96b1985c859bcc99a6aae366d89ad0ad9e50d1a48f91b38fcdaad3d4b8e9d99185a98fcce3dacd9ecd8e91d3a761a091da8aa0cc9d6a9c8ec9d9dc8fd8dbe1acd9d3d5578bcb96aab350cce2b9cde8e38e61be9d9cb1985a95a18f94d39ea47281b8cac4d797859bcc99adaae366d89ad0ad9e5096a19d9f9696ab57cc8e9f96e69cc4dcd28aa0cc9e659c8e91a6ae508fce9f99b18fd4a9d3dc9fa3a5508fce9f9ab18fcda5c89ad1d9eaa491d2dcd59699cb6792a987a5a76591a09f99a2a2a463919e9696a28d95a3aa8aa3dad9a88edbdae8a591d2dcdad7e29cd39ad3e1d7e0b59ecfd0e1d1d8aa9f5bd2dcd1d5ea97c7ac8f94d39fa17281b787a0d56099ac8fb5c4d9cdaec4de87a0d5609cac8f8ed7ced8a1c1cdc8dfb36d89dfd9c9edd6d0728f92dbe8ef9ec8ac8f94d3a09c728192dbd9e8a1ccdedba5a69b9c5bd3dfd8b1985ac2a29ea59693e29ec3a987a0d56195ac8fdeddd18e61be9f98b19854c7dedac9dddba9578bcb98a8b350cdded6d696a8e296d18cceb1ea96cce2c8c7a5ca989a9cced7cfd560c0ebe9cae6c8cb68bce8e1d6e889c2a3caa7d3a2a6949598d7b1d5658fddaac7aca8d59b87dd9bbdd18d9ccc95d8d5dfd1a3d398dcdde492d2e69691e8dfe5b0cda9d1e3d98fd7d8dcd6cfcc9d65bce9c8d5ea91cb97ce91efdba994909d90d8e591d8dcd2d6e8c8cb6691c9e2e6dba2d8e1db90e5a3b590be9d98d19e8d94a399d1cfcc9d6abc95e1f0d8a0bece9e9ed196925b87de90b1d55f9a9899d9aab6c794909fc29cd55f9b9bd6c3d39ea59288928b9ce859a0ce9f989d99c794919d91e8b58d95a1a7c7a6a0989491a091e5ac77bece9f9dd195cb679598cecfd55f9ccc96a7d39fa36fbe9e9da0d5609c9bdf94d3a09c61c498c4a7a75acccacc9ba6ca9894929f91e2d389c2a2a1c59ccca45edc98ccd9ea79c8e8a7cee9dbcfa9c8dbd39cea57dee5ceda94cc9d72d69ddea2e1678b91a3b89696ab57d3decedbdd93d591a78ae48f989491a987e6e5a2c4e3d2baddd4d4a98198c4a7b3a594e89bd3ad958e99b38e8eb39894c8d3cea0d8d1a29a8f9d97abda8f9ba7d39ba8a5a39695a09bdadb66c4a5cf8aae8fc0579ae2c6e69697a0979de0a8d19867969a8eb0a6a698ae95a1a69b9d7a909896aa9f688b9fe599d999a06392b1969db25edba2ac9ea49ba47a90a68da4ee5f979ba59d9dab9465d7a0c8a0a963919fa3ada596ab678d9eaaa7b05685d8dcdb9699a3678d9d98b9a9579fac9598ec9ea2618fe497ab9f6d9ca39ba29ca29d6398b190a7a25edba3a691b0aa9465d7a19ea0ab679198ac98ec9fa06f879e9ca0a9618cada59eb395a5678d9eaa9fa85a93e79d91ae9de46996a88da5ad5c98b4989aa0a3a15e9e8ed296b056969f9b9daaa5b160919897aca4579fac959aac9b986e929a9ca9bb5e8cae9de0d69da369929d9eaea6a695a2a990ac9f986c9495a4a4ee5fc5a9959ca99b9d7a909887a7a662859899cdb1dea27ebacb96d19e978fa0a491a0dfa9a99adea2e8de97d6cacc9ad195de61c495a0ead7a083ddaad9aab6c79492c98de6a2978caadfcde8e2dea37fdae2a0e89dd7d0e1cdc6d6d39dd3a6cbe9e491d7d8dcd69ce1989e88e7dbd5e84ec2a0aa8ab58f989491a987c09869c9dedf90eacede55c498d7b1a669d4a5b6c3d39ec95dc898d79db1a08e9a96cdb1dea27ebacb97d19e5f8fe39694e8abaa729098cab0b26b96a099dc9faad170d1d1d9e9e89c83e3eae5a0aee1a9c7c7c4aad36bc9e4dbcbe8d6dba387e091dd9fa9d9d0df88d39ea957c5d1c9d5ae92c7a5d298a59fa399c0a49ddaa9629ba6ce9ea8a3d29a97cd9bd6985ac2a1aa8adedcd5a38198c4a7b3508f9199c7a8aa8e9ad7e0cae2da5cd0d3a28aa0cca17281cfc6e0e2509ee5ceda94d2a990d398cea0d55fc0cacc9ad195cb688898d7b1e893d4e4d6dad995cb6988a7d7d9eaa3d5dd8ddacfcca19287e0cddde95ac898ea94e0d6ce90bea3c29cb7a3d7d7c8c7a9ca989ad5e08ea0e39dc7e4d9cdcfcca4929caddae8de69", "d0e8dad86abed8cae8ec5cc6deda")))
});
define("video.statusEnum", function(e, t, i) {
    var a = {
        AuthTimeOut: "601",
        AuthArgsErr: "603",
        AuthDataEmpty: "604",
        TimerServerTimeOut: "611",
        GslbTimeOut: "621",
        TokenTimeOut: "623",
        URLNotSupport: "641",
        MetaCannotUse: "642",
        OutSea: "643",
        VideoNotSupport: "644",
        ADCallbackErr: "645",
        ADURLNotSupport: "646",
        CopyritghtBan: "647",
        ExceedPlayMaxCount: "648",
        NotSupport1080P: "649",
        CNBan: "650"
    };
    var s = {
        Idea: "Idea",
        Ready: "Ready",
        Start: "Start",
        Ended: "Ended",
        Playing: "Playing",
        Paused: "Paused",
        Seeking: "Seeking"
    };
    i.exports = {
        error: a,
        video: s
    }
});
define("video.timerProxy", function(e, t, i) {
    var a = e("extend.lib");
    var s = {
        get: function(e, t) {
            var i = a.getCookie("le_time");
            if (i) {
                var s = Math.floor((new Date).getTime() / 1e3) + parseInt(i);
                e(s, false)
            } else {
                var n = Math.round(Math.random());
                if (n == 1) {
                    this.update(e, t)
                } else {
                    e(Math.floor((new Date).getTime() / 1e3), false)
                }
            }
        },
        update: function(e, t, i) {
            var s = 0;
            if (!t)
                t = 2e3;
            if (!i)
                i = "http://api.letv.com/time";
            var n = function(t) {
                if (t) {
                    var i = t.stime - Math.floor((new Date).getTime() / 1e3);
                    a.setCookie("le_time", i, {
                        expires: 1,
                        domain: ".letv.com",
                        path: "/"
                    });
                    e(t.stime, true)
                }
            }, o = function() {
                e(Math.floor((new Date).getTime() / 1e3), false)
            };
            a.getJSON(i + "?callback=?", a.bind(n, this), a.bind(o, this), t, 1)
        }
    };
    t.get = s.get;
    t.update = s.update
});
define("video.token", function(e, t, i) {
    var a = e("extend.lib"), s = e("core.event");
    function n(e) {
        this.option = e
    }
    n.prototype = {
        getToken: function(t) {
            var i = a.getCookie("ssouid");
            if (this.ssouid === i && this.token && this.storepath == t) {
                this.trigger("success", this.token);
                return 
            }
            this.ssouid = i;
            this.storepath = t;
            this.uname = a.getCookie("m");
            if (!i ||!this.uname ||!this.option.pid) {
                this.trigger("success");
                return 
            }
            var s = this;
            var n = this.option.pid + "37b335ab693a416082b59904fe542b57" + this.ssouid + t;
            var o = e("extend.md5").call(this, n);
            var r = "http://yuanxian.letv.com/letv/getService.ldo?callback=?&from=token&pid=" + this.option.pid + "&userid=" + i + "&uname=" + this.uname + "&storepath=" + t + "&sign=" + o;
            a.getJSON(r, a.bind(this.onTokenSucc, this), function() {
                s.trigger("fail")
            }, 2e3, 3)
        },
        onTokenSucc: function(e) {
            if (e.code != 0) {
                this.trigger("success")
            }
            this.token = e.values.token;
            this.trigger("success", this.token)
        }
    };
    a.merge(n.prototype, s);
    i.exports = n
});
define("video.stream", function(e, t, i) {
    var a = e("extend.lib"), s = e("./baseVideo"), n = e("./statusEnum").error;
    var o = s.extend({
        init: function() {
            this.video_ = vjs(this.video);
            this.evt.on("setVideoEnable", this.changeVideoEnable, this);
            this.sendEvtId = setTimeout(a.bind(function() {
                if (!this.sended) {
                    this.sended = true;
                    (new Image).src = "http://m.letv.com/dc.gif?stack=" + this.evtList.join(",")
                }
            }, this), 1e5);
            this.evtList = []
        },
        src: function(e) {
            try {
                this.video.removeAttribute("src")
            } catch (t) {}
            try {
                this.video.src = e
            } catch (t) {
                this.video.setAttribute("src", e)
            }
            try {
                this.video.load()
            } catch (t) {}
            this.play();
            this.forcePlay()
        },
        forcePlay: function() {
            var e = 0, t = false;
            var i = a.bind(function() {
                t = true;
                if (++e < 5)
                    return;
                clearInterval(this.forceId);
                this.video_.off("timeupdate", i, this)
            }, this);
            this.video_.on("timeupdate", i, this);
            var s = a.bind(function() {
                this.play();
                if (++e < 10)
                    return;
                clearInterval(this.forceId);
                this.evt.off("timeupdate", i, this)
            }, this);
            if (this.forceId)
                clearInterval(this.forceId);
            this.forceId = setInterval(s, 2e3)
        },
        seek: function(e) {
            if (isNaN(e))
                return;
            this.evt.trigger("vjs_seeking");
            e = Math.max(e, 0);
            e = Math.min(e, this.gdur-5);
            var t = a.bind(function() {
                var a = this.currentTime();
                if (!isNaN(a) && (Math.ceil(a) >= e || Math.abs(a - e) < 2)) {
                    if (++i >= 2) {
                        clearTimeout(this.seekId);
                        this.evt.trigger("vjs_seeked")
                    } else {
                        this.seekId = setTimeout(t, 500)
                    }
                } else {
                    this.currentTime(e);
                    this.seekId = setTimeout(t, 500)
                }
            }, this);
            var i = 0;
            this.currentTime(e);
            if (this.seekId)
                clearTimeout(this.seekId);
            this.seekId = setTimeout(t, 500)
        },
        onchangeDefi: function() {
            this.evt.trigger("vjs_changeDefi")
        },
        currentTime: function(e) {
            if (typeof e === "undefined") {
                return this.video.currentTime
            } else {
                this.video.currentTime = e
            }
        },
        changeVideoEnable: function(e) {
            var t = "error canplay  ended  durationchange  seeked  loadeddata loadedmetadata timeupdate waiting playing play pause".split(/\s+/), i = "canplaythrough webkitendfullscreen stalled seeking durationchange setDuration".split(/\s+/);
            var a = e.args[0] ? this.video_.on: this.video_.off;
            vjs.each.call(this, t, function(e, t) {
                a.call(this.video_, t, this.globeEventHandler, this)
            });
            vjs.each.call(this, i, function(e, t) {
                a.call(this.video_, t, this.privateEventHandler, this)
            })
        },
        globeEventHandler: function(e) {
            if (e.type !== "timeupdate") {
                logger.log("globe:" + e.type)
            }
            this.evt.trigger(e.type);
            if (!this.sended && e.type !== "timeupdate") {
                this.evtList.push(e.type);
                this.sendDC()
            }
        },
        privateEventHandler: function(e) {
            switch (e.type) {
            case"stalled":
                this.onStalled();
                break;
            case"durationchange":
                try {
                    var t = this.video.duration
                } catch (e) {}
                if (!isNaN(t) && t > 1 && isFinite(t)) {
                    this.evt.trigger("setDuration", t)
                }
                break;
            case"webkitendfullscreen":
                clearInterval(this.stalledId);
                clearInterval(this.forceId);
                break;
            case"setDuration":
                this.gdur = e.args[0];
                break
            }
            if (!this.sended && e.type !== "timeupdate") {
                this.evtList.push(e.type);
                this.sendDC()
            }
        },
        onStalled: function(e) {
            if (this.video.paused)
                return;
            var t = 0, i = false;
            var s = a.bind(function() {
                i = true;
                if (++t < 10)
                    return;
                clearInterval(this.stalledId);
                this.video_.off("timeupdate", s, this)
            }, this);
            this.video_.on("timeupdate", s, this);
            var o = a.bind(function() {
                this.play();
                if (++t < 20)
                    return;
                clearInterval(this.stalledId);
                this.video_.off("timeupdate", s, this);
                if (!i)
                    this.setErrStatus(n["MetaCannotUse"])
            }, this);
            if (this.stalledId)
                clearInterval(this.stalledId);
            this.stalledId = setInterval(o, 2e3)
        },
        play: function() {
            if (this.video && typeof this.video.play === "function") {
                this.video.play()
            }
        },
        stopForcePlay: function() {
            if (this.forceId)
                clearInterval(this.forceId)
        },
        sendDC: function() {
            if (this.evtList.length == 15&&!this.sended) {
                this.sended = true;
                (new Image).src = "http://m.letv.com/dc.gif?stack=" + this.evtList.join(",")
            }
        }
    });
    i.exports = o
});
define("video.gslb", function(e, t, i) {
    var a = e("extend.detect"), s = e("extend.lib"), n = e("core.event");
    function o(e) {
        this.option = e;
        this.evt = e.events;
        var t = navigator.userAgent;
        this.param = ["&expect=" + 3, "termid=" + (a.isLetv ? 4 : 2), "pay=" + this.option.isMember, "ostype=" + (a.Android && "android" || /Mac OS/i.test(t) && "macos" || /Windows/.test(t) && "windows" || /linux/.test(t) && "linux" || "un"), "hwtype=" + (a.iPhone && "iphone" || a.iPad && "ipad" || /LETVX60/.test(t) && "X60" || /LETVX40/.test(t) && "X40" || "un")].join("&")
    }
    o.prototype = {
        getGslb: function(e, t) {
            if (e.length <= 0) {
                this.trigger("fail");
                return 
            }
            this.urls = e;
            this.token = t;
            this.currIdx =- 1;
            this.changeGslbURL()
        },
        getLiveGslb: function(t) {
            if (t.length <= 0) {
                this.trigger("fail");
                return 
            }
            this.urls = t;
            this.streamid = s.getParamVal(t[0], "stream_id");
            var i = e("./timerProxy");
            i.get(s.bind(this.onGetTimeSucc, this))
        },
        onGetTimeSucc: function(t, i) {
            t += 600;
            var a = e("./auth").getLiveKey(this.streamid, t);
            var n = [this.urls[0], this.param, "&sign=live_phone&format=1&jsonp=?&platid=10&playid=1&splatid=", this.option.pname == "MPlayer" ? "1006": "1005", "&tm=", t, "&key=", a].join("");
            s.getJSON(n, s.bind(this.onLiveGslbSucc, this), s.bind(this.onLiveGslbFail, this), 5e3, 3)
        },
        onLiveGslbSucc: function(e, t) {
            if (e && e.nodelist && e.nodelist.length > 0) {
                var i = [], a = e.nodelist;
                for (var s = 0, n = a.length; s < n; s++) {
                    if (a[s].location)
                        i.push(a[s].location)
                    }
                this.evt.trigger("ToSetTime", e && e.curtime ? e.curtime : Math.floor((new Date).getTime() / 1e3));
                this.trigger("liveSuccess", i);
                this.evt.trigger("gslbScheduler", t)
            } else {
                this.trigger("liveFail")
            }
        },
        onLiveGslbFail: function() {
            this.trigger("liveFail")
        },
        changeGslbURL: function() {
            if (++this.currIdx >= this.urls.length) {
                this.trigger("fail");
                return 
            }
            var e = "";
            if (this.token) {
                e = "&token=" + this.token + "&uid=" + s.getCookie("ssouid")
            }
            var t = this.urls[this.currIdx] + "&format=1&jsonp=?" + e + this.param;
            if (this.option.isTrylook)
                t += "&stop=600";
            s.getJSON(t, s.bind(this.onGslbSucc, this), s.bind(this.onGslbFail, this), 5e3, 1)
        },
        onGslbSucc: function(e, t) {
            if (e.playlevel >= 3&&!this.isUserChangeRate) {
                var i, a = this.movieVO;
                if (a["1"])
                    i = "1";
                else if (a["2"])
                    i = "2";
                else if (a["3"])
                    i = "3";
                if (i && this.defi != i) {
                    this.evt.trigger("TO_RateChanged", i);
                    return 
                }
            }
            if (e && e.nodelist && e.nodelist.length > 0) {
                var s = [], n = e.nodelist;
                for (var o = 0, r = n.length; o < r; o++) {
                    if (n[o].location)
                        s.push(n[o].location)
                    }
                this.trigger("success", s);
                this.evt.trigger("gslbScheduler", t)
            } else if (e && e.status) {
                this.trigger("fail")
            } else {
                this.changeGslbURL()
            }
        },
        onGslbFail: function() {
            this.changeGslbURL()
        }
    };
    s.merge(o.prototype, n);
    i.exports = o
});
define("view.tpl", function(e, t, i) {
    var a = function(e) {
        var t;
        switch (e) {
        case"minLive":
            t = ['<div class="hv_box hv_box_hide hv_box_live hv_box_live_mb" style="margin-top: 0">', '<div class="hv_play" style="background: none;"><video x-webkit-airplay="allow" style="width:100%;height:100%;" autoplay></video></div>', '<div class="hv_play_bg js-pannel" style="display:block;"></div>', '<div class="hv_play_poster" style="display: none"></div>', '<div class="hv_botbar">', '<div class="hv_botbar_bg"></div>', '<div class="hv_botbar_cnt">', '<div class="hv_start">', '<span class="hv_ico_stop"  style="display: block"><i></i></span>', "</div>", '<div class="hv_scroll">', '<div class="hv_scroll_cnt"><div class="live_bar">正在直播 <span>00:00:00</span></div></div>', "</div>", '<div class="hv_botbar_btn">', , '<div class="hv_ico_screen"></div>', "</div>", "</div>", "</div>", '<div class="hv_ico_pasued" style="display:none;z-index: 19"></div>', '<div class="hv_ico_loading" style="display: none;z-index: 19"><div class="hv_loading"></div></div>', '<div class="hv_pop js-poptip" style="display:none;z-index: 11"></div>', '<div class="hv_play_bg js-bg" style="display:block;z-index: 10"></div>', "</div>"].join("");
            break;
        case"live":
            t = ['<div class="hv_box hv_box_hide hv_box_live" style="margin-top: 0">', '<div class="hv_play" style="background: none;"><video x-webkit-airplay="allow" style="width:100%;height:100%;" autoplay></video></div>', '<div class="hv_play_bg js-pannel" style="display:block;"></div>', '<div class="hv_play_poster" style="display: none"></div>', '<div class="hv_tip js-tip" style="display: none;"><span class="js-tip-msg"></span><span>|</span><div class="hv_tip_close">关闭</div></div>', '<div class="hv_botbar">', '<div class="hv_botbar_bg"></div>', '<div class="hv_botbar_cnt">', '<div class="hv_start">', '<span class="hv_ico_stop"  style="display: block"><i></i></span>', "</div>", '<div class="hv_scroll">', '<div class="hv_scroll_cnt"><div class="live_bar">正在直播 <span>00:00:00</span></div></div>', "</div>", '<div class="hv_botbar_btn">', '<div class="hv_ico_clear">', '<span class="hv_ico_sub hv_ico_clarity">流畅</span>', '<ul class="clear_ul"></ul>', "</div>", '<div class="hv_ico_screen"></div>', "</div>", "</div>", "</div>", '<div class="hv_ico_pasued" style="display:none;z-index: 19"></div>', '<div class="hv_ico_loading" style="display: none;z-index: 19"><div class="hv_loading"></div></div>', '<div class="hv_pop js-poptip" style="display:none;z-index: 11"></div>', '<div class="hv_play_bg js-bg" style="display:block;z-index: 10"></div>', "</div>"].join("");
            break;
        case"minBase":
            t = ['<div class="hv_box hv_box_hide hv_box_mb" style="margin-top: 0">', '<div class="hv_play" style="background: none;"><video x-webkit-airplay="allow" style="width:100%;height:100%;" autoplay></video></div>', '<div class="hv_play_bg js-pannel" style="display:block;"></div>', '<div class="hv_play_poster" style="display: none"></div>', '<div class="hv_botbar">', '<div class="hv_botbar_bg"></div>', '<div class="hv_botbar_cnt">', '<div class="hv_start">', '<span class="hv_ico_stop"  style="display: block"><i></i></span>', "</div>", '<div class="hv_scroll">', '<div class="hv_scroll_cnt">', '<div class="progress_bar">', '<span class="time_cur" style="left:0px;margin-left:35px;">00:00</span>', '<span class="time_total"></span>', "</div>", '<div class="progress_download" style="width:0px;"></div>', '<div class="porgress_playback" style="width:0px;"></div>', '<div class="hv_ico_playing" style="left:0px;"><span></span><span></span><span></span></div>', "</div>", "</div>", '<div class="hv_botbar_btn">', '<div class="hv_ico_screen"></div>', "</div>", "</div>", "</div>", '<div class="hv_ico_pasued" style="display:none;z-index: 19"></div>', '<div class="hv_ico_loading" style="display: none;z-index: 19"><div class="hv_loading"></div></div>', '<div class="hv_pop js-poptip" style="display:none;z-index: 11"></div>', '<div class="hv_play_bg js-bg" style="display:block;z-index: 10"></div>', "</div>"].join("");
            break;
        case"IPhone":
            t = ['<div class="hv_box hv_box_hide hv_box_mb" style="margin-top: 0">', '<div class="hv_play" style="background: none;"><video x-webkit-airplay="allow" style="width:100%;height:100%;display: none;" autoplay></video></div>', '<div class="hv_play_poster" style="display: none"></div>', '<div class="hv_ico_pasued" style="display:none;z-index: 19"></div>', '<div class="hv_pop js-poptip" style="display:none;z-index: 11"></div>', '<div class="hv_play_bg js-bg" style="display:block;z-index: 10"></div>', "</div>"].join("");
            break;
        case"base":
        default:
            t = ['<div class="hv_box hv_box_hide" style="margin-top: 0">', '<div class="hv_play" style="background: none;"><video x-webkit-airplay="allow" style="width:100%;height:100%;" autoplay></video></div>', '<div class="hv_play_bg js-pannel" style="display:block;"></div>', '<div class="hv_play_poster" style="display: none"></div>', '<div class="hv_topbar">', '<div class="hv_topbar_bg"></div>', '<div class="hv_topbar_cnt"><span class="hv_ico_back"></span><span class="hv_tit"></span><span class="hv_ico_sub hv_ico_move" style="display: none;">推送</span></div>', "</div>", '<div class="hv_tip" style="display: none"><span>01:32</span><span>已开启跳过片头/片尾</span><span>|</span><a href="#">关闭</a></div>', '<div class="hv_tip js-tip" style="display: none;"><span class="js-tip-msg"></span><span>|</span><div class="hv_tip_close">关闭</div></div>', '<div class="hv_botbar">', '<div class="hv_botbar_bg"></div>', '<div class="hv_botbar_cnt">', '<div class="hv_start">', '<span class="hv_ico_stop"  style="display: block"><i></i></span>', "</div>", '<div class="hv_scroll">', '<div class="hv_scroll_cnt">', '<div class="progress_bar">', '<span class="time_cur" style="left:0px;margin-left:35px;">00:00</span>', '<span class="time_total"></span>', "</div>", '<div class="progress_download" style="width:0px;"></div>', '<div class="porgress_playback" style="width:0px;"></div>', '<div class="hv_ico_playing" style="left:0px;"><span></span><span></span><span></span></div>', "</div>", "</div>", '<div class="hv_botbar_btn">', '<div class="hv_ico_next"></div>', '<div class="hv_ico_clear">', '<span class="hv_ico_sub hv_ico_clarity">流畅</span>', '<ul class="clear_ul"></ul>', "</div>", '<div class="hv_ico_screen"></div>', "</div>", "</div>", "</div>", '<div class="hv_ico_pasued" style="display:none;"></div>', '<div class="hv_ico_loading" style="display: none;"><div class="hv_loading"></div></div>', '<div class="hv_pop js-poptip" style="display:none;z-index:11"></div>', '<div class="hv_rigbar" style="display:none">', '<ul class="hv_tuisong">', '<li class="p0"></li>', '<li class="p1">推送视频到其他设备，享受大屏观看体验</li>', '<li class="hv_ico_sub hv_ico_supertv">推送超级电视</li>', '<li class="hv_ico_sub hv_ico_airplay">通过AirPlay推送</li>', "</ul>", "</div>", '<div class="hv_pop hv_fastslide" style="display:none;">', '<div class="hv_fastslide_bar"></div>', '<div class="hv_ico_fastslide"></div>', '<div class="hv_fashslide_time"><span class="js-seek-curtime">00:00</span>/<span class="js-seek-tottime">50:23</span></div>', "</div>", '<div class="hv_play_bg js-bg" style="display:block;z-index: 10"></div>', "</div>"].join("");
            break
        }
        return t
    };
    var s = function(e) {
        var t;
        switch (e) {
        case"live":
        case"base":
        case"minBase":
        default:
            t = 'body,p,dl,dt,dd,ul,ol,li{  margin:0;   padding:0}.hv_box{  font:12px/1.5 "微软雅黑",arial;*line-height:1.5}.hv_box div,.hv_box ul,.hv_box dl{  zoom:1}.hv_box ul,.hv_box ol{   list-style:none;    margin:0;   padding:0}.hv_box img{  border:0}div:after,ul:after,dl:after,.clearfix:after{   content:""; display:block;  clear:both; height:0;   visibility:hidden}abbr,article,aside,audio,canvas,datalist,details,figure,footer,header,hgroup,menu,nav,output,progress,section,video{  display:block;  margin:0;   padding:0}.hv_box a{    text-decoration:none}.clearfix{ clear:both; zoom:1}.hv_ico_star,.hv_ico_stop,.hv_ico_refresh,.hv_ico_next,.hv_ico_back,.hv_ico_screen,.hv_ico_allscreen,.hv_ico_pasued,.hv_ico_fastslide,.hv_pop .hv_pop_close span,.hv_tip .hv_tip_close,.hv_ico_loading,.hv_loading{  background:url(http://i3.letvimg.com/img/201403/24/hv_ico.png) no-repeat -10000px}.hv_ico_sub{  text-align:center;  border:2px solid #cdcdcd;   color:#ffffff;  border-radius:3px;  font-size:13px}.hv_box{ position:relative;  background:#000000; height:100%;    overflow:hidden; clear:both;}.hv_fullscreen{    position:absolute;  width:100%; height:100%;    top:0;  left:0; z-index:1000}.hv_topbar,.hv_botbar,.hv_rigbar,.hv_tip{}.hv_box_hide .hv_topbar{ transform:translate(0,-40px);   -webkit-transform:translate(0,-40px);   -moz-transform:translate(0,-40px);  -o-transform:translate(0,-40px);    -ms-transform:translate(0,-40px)}.hv_box_hide .hv_botbar{   transform:translate(0,41px);    -webkit-transform:translate(0,41px);    -moz-transform:translate(0,41px);   -o-transform:translate(0,41px); -ms-transform:translate(0,41px)}.hv_box_hide .hv_rigbar{    transform:translate(300px,0);   -webkit-transform:translate(300px,0);   -moz-transform:translate(300px,0);  -o-transform:translate(300px,0);    -ms-transform:translate(300px,0)}.hv_box_hide .hv_tip{  transform:translate(0,70px);    -webkit-transform:translate(0,70px);    -moz-transform:translate(0,70px);   -o-transform:translate(0,70px); -ms-transform:translate(0,70px)}.hv_box_hide .clear_ul.hover{   display:none}.hv_topbar,.hv_topbar_bg,.hv_topbar_cnt{   position:absolute;  left:0; top:-1px;   width:100%; height:40px}.hv_topbar{}.hv_topbar_bg{  background:#000000; opacity:0.5}.hv_topbar_cnt{ color:#ffffff;  opacity:0.6}.hv_topbar_cnt .hv_ico_back{    float:left; background-position:0 -266px;   width:17px; height:27px;    margin:9px 20px 0;  display:none}.hv_fullscreen .hv_ico_back{   display:block}.hv_topbar_cnt .hv_tit{   float:left; font-size:17px; line-height:38px;   margin:0 20px}.hv_fullscreen .hv_tit{   margin:0}.hv_topbar_cnt .hv_ico_move{   float:right;    padding:0 8px;  height:24px;    line-height:22px;   border-radius:4px;  margin-right:20px;  margin-top:6px}.hv_play{    width:100%; height:100%}.hv_play_bg,.hv_play_poster{    height:100%;    position:absolute;  top:0;  left:0; width:100%}.hv_play_poster{ background-size:cover}.hv_fullscreen .hv_play_poster{   background-color:#000;  background-position:center center;  background-repeat:no-repeat;    background-size:auto}.hv_botbar,.hv_botbar_bg,.hv_botbar_cnt{   position:absolute;  left:0; bottom:0;   width:100%; height:40px}.hv_botbar{}.hv_botbar_bg{  border-top:1px solid #171717;   background:#000000; opacity:0.5}.hv_botbar_cnt{}.hv_start{  width:50px; height:40px;    float:left; position:relative;  z-index:1}.hv_ico_star,.hv_ico_stop,.hv_ico_refresh{    display:block;  width:50px; height:40px;    cursor:pointer}.hv_ico_star{    background:none;    display:none;   padding-top:6px;    height:34px}.hv_ico_star i{ display:block;  margin:0 auto;  width:10px; height:28px;    border-left:1px solid #FFFFFF;  border-right:1px solid #FFFFFF}.hv_ico_stop{    background-position:12px -64px; display:none}.hv_ico_refresh{   background-position:8px -135px}.hv_ico_big .hv_ico_refresh{ background-position:-44px -135px}.hv_scroll,.hv_scroll_cnt{ height:40px}.hv_scroll{ float:left; width:100%; margin-left:-50px;  margin-right:-152px}.hv_scroll_cnt{ position:relative;  margin-left:50px;   margin-right:152px}.progress_bar{   border-bottom:1px solid #262626;    height:20px;    position:relative}.progress_bar span{   font-size:12px}.porgress_breakpoint{    position:absolute;  top:19px;   width:3px;  height:3px; background:#ffffff}.progress_download{  position:absolute;  top:0;  height:40px;    background:#067ac7; opacity:0.2}.porgress_playback{ position:absolute;  top:0;  height:40px;    background:#067ac7; opacity:0.6}.time_total,.time_cur{  position:absolute;  bottom:-20px;   right:0;    color:#ffffff}.hv_ico_playing{  width:20px; height:38px;    position:absolute;  top:0;  background:#30bafe; border:1px solid;   border-color:#28c6f8 #1ba7f4 #038ee1 #4be1ff;   line-height:40px;   text-align:center}.hv_ico_playing span{ display:inline-block;   width:1px;  height:8px; margin-right:1px;   line-height:0px;    background:#8ed4f7; border-top:1px solid #2497d0;   font-size:0;    margin-top:16px}.hv_botbar_btn{ float:right;    margin-top:11px;    width:152px}.hv_ico_next,.hv_ico_clear,.hv_ico_screen{  float:left; margin:0 10px}.hv_ico_next{ background-position:0 -213px;   width:20px; height:24px}.hv_ico_next.gray{  background-position:0 -497px}.hv_ico_clear{ position:relative}.hv_ico_clarity{  display:block;  padding:0 5px;  height:18px;    line-height:17px}.clear_ul:before,.hv_tip:before{   content:""; height:10px;    width:10px; z-index:2;  position:absolute;  left:50%;   margin-left:-5px;   bottom:-5px;    -webkit-transform-origin:5px 5px;   -moz-transform-origin:5px 5px;  -o-transform-origin:5px 5px;    -moz-transform:rotate(45deg);   -o-transform:rotate(45deg); -webkit-transform:rotate(45deg);    background:-moz-linear-gradient(-45deg,transparent,transparent 49%,rgba(0,0,0,1) 50%,rgba(0,0,0,1));    background:-webkit-gradient(linear,left top,right bottom,from(transparent),color-stop(49%,transparent),color-stop(50%,rgba(0,0,0,1)),to(rgba(0,0,0,1)));    background:-o-linear-gradient(left top,transparent,transparent 49%,rgba(0,0,0,1) 50%,rgba(0,0,0,1))}.clear_ul{  position:absolute;  bottom:42px;    left:-14px; width:64px; background:#050505; color:#ffffff;  text-align:center;  display:none}.clear_ul li{  height:30px;    line-height:30px;   overflow:hidden;    margin-bottom:4px;  font-size:13px}.clear_ul li.hover{  background:#00a0e9}.clear_ul.hover{ display:block}.hv_ico_screen{   background-position:0 -319px;   width:24px; height:24px}.hv_ico_allscreen{  background-position:0 -372px;   width:24px; height:24px}.hv_tip{    position:absolute;  bottom:46px;    left:40px;  background:#000000; border:1px solid #262626;   height:21px;    line-height:21px;   padding:0 10px; opacity:0.6;    color:#ffffff}.hv_tip:before{   bottom:-3px;    left:24px}.hv_tip span{ margin:0 4px}.hv_tip a{ margin:0 4px;   color:#ffffff}.hv_tip .hv_tip_close{    float:right;    position:relative;  background-position:0 -460px;   width:13px; height:13px;    text-indent:-999px; margin-top:4px; margin-left:4px}.hv_ico_pasued,.hv_ico_loading{ position:absolute;  top:50%;    left:50%;   margin:-55px 0 0 -55px; width:110px;    height:110px;   overflow:hidden;    z-index:100}.hv_ico_pasued{ background-position:-140px 0}.hv_ico_loading,.hv_loading{   width:107px;    height:107px}.hv_ico_loading{   background-position:-106px -443px}.hv_loading{  background-position:-230px -443px;  animation:disqus-embed-spinner .7s infinite linear; -webkit-animation:disqus-embed-spinner .7s infinite linear}@keyframes disqus-embed-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes disqus-embed-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}.hv_rigbar{    position:absolute;  top:0;  right:0;    width:300px;    height:100%;    background:#000000; opacity:0.6}.hv_tuisong{    padding:0 42px}.hv_tuisong li{  margin-bottom:20px}.hv_tuisong .p0{ background:url(http://i3.letvimg.com/img/201403/10/1420/hv_ico_tui.png) no-repeat center top;   height:128px;   margin-top:100px}.hv_tuisong .p1{   color:#ffffff;  font-size:16px}.hv_ico_supertv,.hv_ico_airplay{ border-radius:4px;  height:40px;    line-height:38px}.hv_juji{  width:302px;    opacity:0.6}.hv_juji li{    float:left; width:99px; height:69px;    line-height:69px;   font-size:24px; font-family:Arial;  color:#ffffff;  text-align:center;  border-right:1px solid #ffffff; border-bottom:1px solid #ffffff}.hv_charlist{   opacity:0.8}.hv_charlist li{    height:67px;    color:#cccccc;  font-size:16px; padding:0 18px; padding-top:18px;   border-bottom:1px solid #cccccc;    vertical-align:middle}.hv_charlist li.hover{    background:#00a0e9; color:#ffffff}.hv_pop_bg{   display:none;   background:#000000; opacity:0.2;    overflow:hidden;    width:100%; height:100%;    position:absolute;  top:0px;    left:0px}.hv_pop{   display:none;   position:absolute;  top:50%;    left:50%;   width:270px;    height:128px;   padding:50px 30px 20px 30px;    margin:-104px 0 0 -165px;   background:#000000; border:1px solid #262626;   color:#ffffff;  text-align:center;  vertical-align:middle;  opacity:0.6}.hv_pop .hv_pop_close{  position:absolute;  top:-10px;  right:-10px;    width:16px; height:16px;    border:2px solid #000000;   border-radius:16px; background:#000000}.hv_pop .hv_pop_close span{  display:block;  width:12px; height:12px;    border:2px solid #ffffff;   border-radius:12px; background-position:2px -423px}.hv_pop .hv_blu{ color:#00a0e9}.hv_pop .hv_font16{   font-size:16px}.hv_pop .hv_font14{  font-size:14px; margin-top:14px}.hv_pop .hv_font14 .hv_ico_sub{ font-size:14px; padding:0 10px}.hv_otherpop{    padding:0;  width:330px;    height:200px}.hv_otherpop .hv_font16{   border-bottom:1px solid #272727;    height:50px;    line-height:50px}.hv_otherpop .hv_font14{   border-bottom:1px solid #505050;    height:50px;    margin-top:0;   line-height:50px}.hv_pop_change{    padding:0;  width:329px;    height:200px}.hv_pop_change .hv_font16{ margin-top:12px}.hv_pop_change .hv_font141{ font-size:14px; text-align:left;    padding:0 16px; margin-top:10px}.hv_pop_change .hv_font141 .hv_ico_sub{ margin-left:20px;   padding:0 10px}.hv_pop_change .hv_pop_ico{  position:absolute;  bottom:0;   left:-1px}.hv_pop_change .hv_pop_ico .hv_ico1{  display:inline-block;   height:48px;    width:109px;    line-height:48px;   text-align:center;  border-top:1px solid #373737;   border-left:1px solid #373737}.hv_pop_change .hv_font14{    margin-top:4px}.hv_pop_change .hv_ico_tui1{ margin-top:8px; background:url(http://i3.letvimg.com/img/201403/18/hv_ico_tui1.png) no-repeat center center;    height:47px}.hv_pop_change1 .hv_font16{ margin-top:50px}.hv_pop_change1 .hv_pop_ico .hv_ico1{   width:164px}.hv_fastslide{  width:145px;    height:110px;   background:#000000; top:50%;    left:50%;   margin:-55px 0 0 -72px; padding:0}.hv_fastslide_bar{    background:#00a0e9; width:20px; height:5px; overflow:hidden}.hv_ico_fastslide{  background-position:-160px -133px;  height:86px;    width:72px; margin:0 auto}.hv_ico_fastslide_left{   -moz-transform:rotate(180deg);  -o-transform:rotate(180deg);    -webkit-transform:rotate(180deg)}.hv_fashslide_time{    text-align:center;  color:#999999}.hv_fashslide_time span{  color:#ffffff}.hv_box_mb{}.hv_box_mb .hv_topbar{    display:none}.hv_box_mb .hv_scroll{ margin-right:-40px}.hv_box_mb .hv_scroll_cnt{   margin-right:40px}.hv_box_mb .hv_botbar_btn{    width:40px}.hv_box_mb .hv_ico_pasued,.hv_box_mb .hv_ico_loading{    margin:-35px 0 0 -35px}.hv_box_mb .hv_ico_loading,.hv_box_mb .hv_loading,.hv_box_mb .hv_ico_pasued{ width:70px; height:70px}.hv_box_mb .hv_ico_loading{ background-position:-124px -354px}.hv_box_mb .hv_loading{   background-position:-213px -354px}.hv_box_mb .hv_ico_pasued{    background-position:-266px 0}.hv_box_sys_hide{}.hv_box_sys_hide .hv_topbar,.hv_box_sys_hide .hv_botbar,.hv_box_sys_hide .hv_rigbar,.hv_box_sys_hide .hv_tip,.hv_box_sys_hide .hv_fastslide,.hv_box_sys_hide .hv_ico_loading{    display:none}.hv_box_live{}.hv_box_live .hv_scroll{ margin-right:-120px}.hv_box_live .hv_scroll_cnt{    margin-right:120px}.hv_box_live .hv_botbar_btn{ width:120px}.hv_box_live .live_bar{ color:#ffffff;  line-height:42px;   padding-left:30px;  font-size:12px}.hv_box_live .live_bar span{ font-size:12px}.hv_box_live .hv_topbar,.hv_box_live .hv_fastslide{  display:none}.hv_box_live_mb .hv_scroll{    margin-right:-40px}.hv_box_live_mb .hv_scroll_cnt{  margin-right:40px}.hv_box_live_mb .hv_botbar_btn{   width:40px}.hv_box_live_mb .live_bar{   padding-left:10px}.hv_box_live_mb .hv_ico_pasued,.hv_box_live_mb .hv_ico_loading{   margin:-35px 0 0 -35px}.hv_box_live_mb .hv_ico_loading,.hv_box_live_mb .hv_loading,.hv_box_live_mb .hv_ico_pasued{  width:70px; height:70px}.hv_box_live_mb .hv_ico_loading{    background-position:-124px -354px}.hv_box_live_mb .hv_loading{  background-position:-213px -354px}.hv_box_live_mb .hv_ico_pasued{   background-position:-266px 0}.hv_kt_vip,.hv_sk_vip{ line-height:28px;   opacity:0.9}.hv_kt_vip a,.hv_sk_vip a{  display:inline-block;   width:40%;  border-radius:5px;  margin:0 10px;  height:30px;    line-height:30px}.hv_kt_vip .a1,.hv_sk_vip .a1{ color:#fff; background-color:#f68703}.hv_sk_vip .a1{    width:33%;  margin:0 5px}.hv_sk_vip i{  font-style:normal;  color:#F68703;  padding:0 2px}.hv_kt_vip .a2{   color:#0f93de;  border:1px solid #0f93de}.hv_sk_vip .hv_font12{ font-size:15px; margin-bottom:12px}.hv_btn20{   padding:20px 0}.hv_pop_poster{  position:absolute;  top:50%;    left:50%;   margin:-112px 0 0 -182px;   width:365px;    height:225px;   overflow:hidden;    background-color:#f1f1f1}.hv_pop_poster p{  text-align:center;  margin-bottom:12px}.hv_pop_poster p.hv_p1{  padding-top:48px}.hv_pop_poster a{  display:inline-block;   height:40px;    width:224px;    line-height:40px;   background-color:#f7f7f7;   font-size:15px; color:#7e7e7e;  border:1px solid #d1d1d1}.hv_pop_poster a.blu{  background-color:#00a0e9;   color:#ffffff;  border:1px solid #00a0e9}.hv_pop_poster a.close{    width:20px; height:20px;    display:block;  position:absolute;  top:10px;   right:10px; border:none;    background:none}.hv_pop_poster a.close i{   display:block;  width:18px; height:2px; position:absolute;  top:6px;    left:0; background:#737373; transform:rotate(-45deg);   -ms-transform:rotate(-45deg);   -moz-transform:rotate(-45deg);  -webkit-transform:rotate(-45deg);   -o-transform:rotate(-45deg)}.hv_pop_poster a.close i.i_1{   transform:rotate(45deg);    -ms-transform:rotate(45deg);    -moz-transform:rotate(45deg);   -webkit-transform:rotate(45deg);    -o-transform:rotate(45deg)}.hv_pop_poster .hv_org{  color:#fd6c01}'
        }
        return t
    };
    i.exports = {
        getTpl: a,
        getCss: s
    }
});
define("view.component", function(e, t, i) {
    var a = e("extend.lib"), s = e("extend.detect"), n = e("core.event");
    var o = vjs.extend({
        init: function(e) {
            this.option = e.option;
            this.__proto__.model = e;
            this.__proto__.evt = e.events;
            this.__proto__.state = {
                videoState: "init",
                isDrag: false,
                isSeeking: false
            };
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this);
            this.render(this.model.option["cont"]);
            this.evt.on("setPoster", function(e) {
                if (!this.model.vinfo.poster || this.model.vinfo.up == 1) {
                    this.initPoster(e.args[0])
                }
            }, this);
            this.__proto__.parentEl = this.model.dom.parentEl;
            this.initChildren()
        },
        addEvent: function() {
            this.evt.on("play", this.stateChange, this);
            this.evt.on("pause", this.stateChange, this);
            this.evt.on("ended", this.stateChange, this);
            this.evt.on("vjs_seeking", this.stateChange, this);
            this.evt.on("vjs_seeked", this.stateChange, this)
        },
        removeEvent: function() {
            this.evt.off("play", this.stateChange, this);
            this.evt.off("pause", this.stateChange, this);
            this.evt.off("ended", this.stateChange, this);
            this.evt.off("vjs_seeking", this.stateChange, this);
            this.evt.off("vjs_seeked", this.stateChange, this)
        },
        stateChange: function(e) {
            var t = e.type;
            var i = "";
            switch (t) {
            case"play":
                i = "play";
                break;
            case"pause":
                i = "pause";
                break;
            case"ended":
                i = "ended";
                break;
            case"vjs_seeking":
            case"vjs_changeDefi":
                this.state.isSeeking = true;
                break;
            case"vjs_seeked":
                this.state.isSeeking = false;
                break
            }
            if (i) {
                this.state.videoState = i
            }
        },
        setTrylook: function(e) {
            if (e) {
                this.evt.on("timeupdate", this.checkTryLook, this)
            } else {
                this.evt.off("timeupdate", this.checkTryLook, this)
            }
        },
        checkTryLook: function(e) {
            if (isNaN(e))
                e = this.core.getCurrentTime();
            if (this.model.option.isTrylook && e >= 360) {
                this.evt.trigger("TO_Pause");
                this.evt.trigger("changeFullScreen", false);
                this.evt.trigger("showTip", "tryLookEnd");
                this.evt.trigger("TO_Seek", 1);
                this.evt.trigger("tryLookEnd");
                this.evt.trigger("TO_Stop");
                return 1
            }
            return 0
        },
        render: function(t) {
            var i;
            if (!/^#/.test(t))
                t = "#" + t;
            i = vjs(t);
            if (!i ||!i.length ||!i[0].nodeName) {
                throw new TypeError("The element or ID supplied is not valid.")
            }
            var a = e("view.tpl").getTpl(this.option.tplType);
            a = a.replace(/{cont}/g, t);
            i[0].innerHTML = a;
            i[0].style.width = this.option.width + "px";
            i[0].style.height = this.option.height + "px";
            this.model.dom = {
                tag: i,
                parentEl: i.find(".hv_box")
            };
            if (this.model.vinfo.poster) {
                this.initPoster(this.model.vinfo.poster)
            }
            return i[0]
        },
        initPoster: function(e) {
            var t = this.model.dom.parentEl.find(".hv_play_poster")[0];
            t.style.backgroundImage = "url(" + e + ")";
            t.style.display = "block"
        },
        initChildren: function() {
            var t = this.option, i = this.childrens = {};
            if (t && t.children) {
                vjs.each.call(this, t.children, function(t, a) {
                    var s = e(a), n = new s(this);
                    i[a] = n
                })
            }
        },
        getChildren: function(e) {
            var t = function(i) {
                for (var a in i) {
                    if (a === e)
                        return i[a];
                    if (i[a].childrens) {
                        return t(i[a].childrens)
                    }
                }
                return null
            };
            return t(this.childrens)
        },
        show: function() {},
        hide: function() {},
        enable: function() {},
        disable: function() {}
    });
    a.merge(o.prototype, n);
    i.exports = o
});
define("view.controlBar", function(e, t, i) {
    var a = e("./component");
    var s = a.extend({
        init: function() {
            this.initChildren()
        }
    });
    s.prototype.option = {
        children: {
            playBtn: "view.widget.playBtn",
            fullBtn: "view.widget.fullBtn",
            defiBtn: "view.widget.defiBtn",
            porgressbar: "view.widget.progressBar",
            nextVideoBtn: "view.widget.nextVideoBtn"
        }
    };
    i.exports = s
});
define("view.playingPannel", function(e, t, i) {
    var a = e("./component"), s = e("extend.lib"), n = e("extend.detect"), o = e("extend.touchable");
    var r = a.extend({
        init: function() {
            this.nodes = {
                pannel: this.parentEl.find(".js-pannel"),
                poster: this.parentEl.find(".hv_play_poster"),
                loading: this.parentEl.find(".hv_ico_loading"),
                title: this.parentEl.find(".hv_tit"),
                seekTip: this.parentEl.find(".hv_fastslide"),
                seekTipImg: this.parentEl.find(".hv_ico_fastslide"),
                seekTipCurrentTime: this.parentEl.find(".js-seek-curtime"),
                seekTipTotalTime: this.parentEl.find(".js-seek-tottime"),
                seekTipBar: this.parentEl.find(".hv_fastslide_bar"),
                optDefi: this.parentEl.find(".clear_ul"),
                bigPlayBtn: this.parentEl.find(".hv_ico_pasued"),
                shadow: this.parentEl.find(".js-bg"),
                currentTimeTip: this.parentEl.find(".time_cur")
            };
            this.nodes.title[0].innerHTML = this.model.vinfo.title || "";
            this.pannelWidth = this.nodes.pannel.width();
            this.seekTotalTime = 60 * 3;
            this.startSeekTime = null;
            this.seekTime = 0;
            this.seekDir = "";
            this.duration = 0;
            this.prepareSeekTime = null;
            this.autoHideTime = null;
            this.isMove = false;
            this.pannelTouchable = new o(this.nodes.pannel[0], {
                isTargetNode: true
            });
            this.evt.on("setDuration", this.onSetDuration, this);
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("tryLookEnd", this.onTrylookEnd, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (!n.Android) {
                this.pannelTouchable.on("touchstart", this.onPannelTouchStart, this);
                this.pannelTouchable.on("touchmove", this.onPannelTouchMove, this);
                this.pannelTouchable.on("touchend", this.onPannelTouchEnd, this)
            }
            if (vjs.isDebug) {
                this.parentEl.on("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("click", this.toPlay, this);
                this.nodes.shadow.on("click", this.stopPropagation)
            } else {
                this.parentEl.on("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("touchend", this.toPlay, this);
                this.nodes.shadow.on("touchend", this.stopPropagation)
            }
            this.evt.on("play", this.onPlay, this);
            this.evt.on("ended", this.onEnded, this);
            this.evt.on("canplay canplaythrough play playing seeked vjs_seeked", this.hide, this);
            this.evt.on("seeking waiting error vjs_seeking", this.show, this);
            this.evt.on("TO_Resize", this.onResize, this);
            this.evt.on("showTip", this.onShowTip, this)
        },
        removeEvent: function() {
            if (!n.Android) {
                this.pannelTouchable.off("touchstart", this.onPannelTouchStart, this);
                this.pannelTouchable.off("touchmove", this.onPannelTouchMove, this);
                this.pannelTouchable.off("touchend", this.onPannelTouchEnd, this)
            }
            if (vjs.isDebug) {
                this.parentEl.off("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("click", this.toPlay, this);
                this.nodes.shadow.off("click", this.stopPropagation)
            } else {
                this.parentEl.off("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("touchend", this.toPlay, this);
                this.nodes.shadow.off("touchend", this.stopPropagation)
            }
            this.evt.off("play", this.onPlay, this);
            this.evt.off("ended", this.onEnded, this);
            this.evt.off("canplay canplaythrough play playing seeked vjs_seeked", this.hide, this);
            this.evt.off("seeking waiting error vjs_seeking", this.show, this);
            this.evt.off("TO_Resize", this.onResize, this);
            this.evt.off("showTip", this.onShowTip, this)
        },
        onSetDuration: function(e) {
            this.duration = e.args[0];
            this.nodes.seekTipTotalTime[0].innerHTML = s.formatTime(this.duration)
        },
        onMovieSucc: function() {
            this.nodes.bigPlayBtn[0].style.display = "block"
        },
        toPlay: function() {
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.poster[0].style.display = "none";
            this.nodes.loading[0].style.display = "block";
            this.nodes.shadow[0].style.display = "none";
            this.evt.trigger("TO_Play")
        },
        onPannelTouchStart: function() {
            this.isMove = false;
            clearTimeout(this.prepareSeekTime);
            var e = this.nodes.currentTimeTip[0].currentTime;
            this.startSeekTime = typeof e == "undefined" ? 0 : e
        },
        onPannelTouchMove: function(e) {
            if (this.state.videoState == "init")
                return;
            this.isMove = true;
            var t = this.pannelTouchable.currentStartDelta.x / this.pannelWidth;
            if (Math.abs(t) >= .15&&!this.state.isDrag) {
                this.state.isDrag = true;
                this.nodes.seekTip[0].style.display = "block";
                this.nodes.loading[0].style.display = "none";
                this.evt.trigger("TO_Pause")
            }
            if (this.state.isDrag) {
                var i = e.args[1];
                i.preventDefault();
                var a = this.pannelTouchable.currentDelta.x;
                if (Math.abs(a) < 2)
                    return;
                if (!this.seekDir || this.seekDir == "right" && a <= 0 || this.seekDir == "left" && a > 0) {
                    if (a > 0) {
                        this.nodes.seekTipImg.removeClass("hv_ico_fastslide_left");
                        this.seekDir = "right"
                    } else {
                        this.nodes.seekTipImg.addClass("hv_ico_fastslide_left");
                        this.seekDir = "left"
                    }
                }
                this.seekTime = this.startSeekTime + t * this.seekTotalTime;
                this.seekTime = Math.max(0, this.seekTime);
                this.seekTime = Math.min(this.seekTime, this.duration);
                this.nodes.seekTipBar.setStyle("width", this.seekTime / this.duration * 100 + "%");
                this.nodes.seekTipCurrentTime[0].innerHTML = s.formatTime(this.seekTime);
                this.evt.trigger("updateSeekTime", this.seekTime)
            }
        },
        onPannelTouchEnd: function(e) {
            if (this.state.isDrag) {
                var t = e.args[1];
                t.stopPropagation();
                this.prepareSeekTime = setTimeout(s.bind(function() {
                    this.nodes.seekTip[0].style.display = "none";
                    this.state.isDrag = false;
                    this.evt.trigger("TO_Seek", this.seekTime);
                    if (!this.state.isUserPause) {
                        this.evt.trigger("TO_Play")
                    }
                    this.startSeekTime = null;
                    this.seekTime = 0
                }, this), 500)
            }
        },
        onPlay: function() {
            this.nodes.poster[0].style.display = "none";
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.shadow[0].style.display = "none";
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel();
            this.evt.off("play", this.onPlay, this)
        },
        onEnded: function() {
            this.nodes.poster[0].style.display = "block";
            this.evt.on("play", this.onPlay, this)
        },
        show: function() {
            this.nodes.loading[0].style.display = "block"
        },
        hide: function() {
            this.nodes.loading[0].style.display = "none"
        },
        toSeek: function(e) {
            this.startSeekTime = e.args[0]
        },
        autoHidePannel: function() {
            clearTimeout(this.autoHideTime);
            this.autoHideTime = setTimeout(s.bind(function() {
                if (!this.state.isDrag) {
                    this.parentEl.addClass("hv_box_hide");
                    this.nodes.optDefi.removeClass("hover")
                }
            }, this), 5e3)
        },
        togglePannel: function(e) {
            if (e && e.target === this.nodes.pannel[0]&&!this.isMove) {
                if (this.parentEl.hasClass("hv_box_hide")) {
                    this.parentEl.removeClass("hv_box_hide")
                } else {
                    this.parentEl.addClass("hv_box_hide");
                    this.nodes.optDefi.removeClass("hover")
                }
            }
            this.autoHidePannel()
        },
        onShowTip: function() {
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel()
        },
        onResize: function() {
            this.pannelWidth = this.nodes.pannel.width()
        },
        onTrylookEnd: function() {
            this.nodes.loading[0].style.display = "none";
            this.parentEl.addClass("hv_box_hide")
        },
        stopPropagation: function(e) {
            e.stopPropagation()
        }
    });
    i.exports = r
});
define("view.pushing", function(e, t, i) {
    var a = e("./component"), s = e("module.user"), n = e("extend.lib");
    var o = a.extend({
        init: function() {
            this.nodes = {
                pushingBtn: this.model.dom.parentEl.find(". hv_ico_move"),
                startPushingBtn: this.model.dom.parentEl.find(".hv_ico_supertv")
            };
            this.addEvent()
        },
        addEvent: function() {
            this.nodes.pushingBtn.on("click", function() {
                this.startPushingBtn[0].show()
            }, this);
            this.nodes.startPushingBtn.on("click", function() {
                var e = n.getCookie("userid");
                var t = "http://duoping.go.letv.com/?act=push&toDeviceId=117.121.58.84110_-378262597&seq=23&userId=letv_529dde039041853&videoId=20009705&time=33041&title=fengzw&deviceType=0";
                n.getJSON()
            })
        }
    });
    i.exports = o
});
define("view.popTip", function(e, t, i) {
    var a = e("./component"), s = e("video.statusEnum").error;
    var n = a.extend({
        init: function() {
            this.nodes = {
                popTip: this.parentEl.find(".js-poptip"),
                shadow: this.parentEl.find(".js-bg"),
                bigPlay: this.parentEl.find(".hv_ico_pasued"),
                loading: this.parentEl.find(".hv_ico_loading")
            };
            this.nodes.popTip.on("click", function(e) {
                var t = vjs(e.target).getAttr("type");
                switch (t) {
                case"login":
                    if (window.Spirit && Spirit.userLogin && Spirit.userLogin.openLetvLogin) {
                        Spirit.userLogin.openLetvLogin()
                    } else if (this.model.option.pname == "MPlayer") {
                        location.href = "http://sso.letv.com/user/mloginHome?next_action=" + location.href
                    }
                    break;
                case"back-home":
                    location.href = "http://www.letv.com";
                    break;
                case"refresh":
                    location.reload();
                    break;
                case"costTicket":
                    this.evt.trigger("TO_UseTicket");
                    break;
                case"close":
                    this.hide();
                    break;
                case"tv":
                    location.href = "http://shop.letv.com/zt/mobile.html?cps_id=Le_ydm007";
                    break;
                case"zhifu":
                    if (this.model.option.pname == "MPlayer") {
                        location.href = "http://zhifu.letv.com/mz/tobuy/regular?fronturl=" + encodeURIComponent(location.href)
                    } else {
                        location.href = "http://zhifu.letv.com/tobuy/regular?ref=pfuceng&from=H5PAD&fronturl=" + encodeURIComponent(location.href)
                    }
                }
            }, this);
            this.evt.on("showMessage", function(e) {
                if (e.args[0]) {
                    this.show(e.args[0], e.args[1])
                } else {
                    this.hide()
                }
            }, this)
        },
        show: function(e, t) {
            this.nodes.bigPlay[0].style.display = "none";
            if (this.nodes.loading[0])
                this.nodes.loading[0].style.display = "none";
            var i = "";
            t = t || {};
            this.nodes.popTip.removeClass("hv_kt_vip");
            switch (e) {
            case"vip1":
                i = ['<p class="hv_font16">此视频为会员影片，请使用电脑登录乐视网，加入乐视VIP会员。</p>', '<p class="hv_font14">如您已是会员，请<a type="login" href="javascript:void(0);" class="hv_blu">登录</a></p>'].join("");
                break;
            case"vip2":
                i = ['<p class="hv_font16">此视频为会员影片，请使用电脑登录乐视网，加入乐视VIP会员。</p>', '<p class="hv_font14">或请用会员身份登录。</p>'].join("");
                break;
            case"tvVip1":
                i = ['<p class="hv_font16">此视频为会员影片，请进入TV版加入乐视VIP会员。</p>', '<p class="hv_font14">如您已是会员，请<a type="login" href="javascript:void(0);" class="hv_blu">登录</a></p>'].join("");
                break;
            case"tvVip2":
                i = ['<p class="hv_font16">此视频为会员影片，请进入TV版加入乐视VIP会员。</p>', '<p class="hv_font14">或请用会员身份登录。</p>'].join("");
                break;
            case s.CopyritghtBan:
                i = ['<p class="hv_font16">由于版权方的要求，该视频暂不支持在该平台播放</p>', '<p class="hv_font14">回乐视网观看，<a type="back-home" href="javascript:void(0);" class="hv_blu">立即前往！</a></p>'].join("");
                break;
            case s.OutSea:
                i = '<p class="hv_font16">因版权方要求，此视频只允许在中国大陆播放,若您所在区域为中国大陆，请联系客服: 400-6300-104处理</p>';
                break;
            case s.CNBan:
                i = '<p class="hv_font16"><br/>因政策原因，该内容无法提供观看</p>';
                break;
            case"transcode":
                i = '<p class="hv_font16">很抱歉，您想看的视频正在转码中，请稍后再试。</p>';
                break;
            case"offline":
                i = ['<p class="hv_font16">很抱歉，您想看的视频已下线</p>', '<p class="hv_font14">去<a type="back-home" href="javascript:void(0);" class="hv_blu">首页看看其他内容。</a></p>'].join("");
                break;
            case s.TimerServerTimeOut:
            case s.AuthTimeOut:
            case s.GslbTimeOut:
                i = ['<p class="hv_font16">很抱歉，运营商网络服务故障</p>', '<p class="hv_font14">请<a type="refresh" href="javascript:void(0);" class="hv_blu">刷新重试。</a></p>'].join("");
                break;
            case"err":
                i = ['<p class="hv_font16">很抱歉，该视频无法播放</p>', '<p class="hv_font14">请<a type="refresh" href="javascript:void(0);" class="hv_blu">刷新重试</a>，或者换个浏览器试试。</p>'].join("");
                break;
            case"ticket":
                i = ['<p class="hv_font16">继续欣赏请使用观影券。</p>', '<p class="hv_font14">您有观影券：<span class="hv_blu">' + t.ticketNum + "</span> 张</p>", '<p class="hv_font14">免费观看需消耗<span class="hv_blu">' + t.costNum + "</span> 张</p>", '<p class="hv_font14"><span class="hv_ico_sub" type="costTicket">确认使用</span></p>'].join("");
                break;
            case"needTicket":
                i = '<p class="hv_font16">您本月的观影券已用完，请使用电脑登录乐视网购买本影片。会员享受半价优惠</p>';
                break;
            case s.NotSupport1080P:
                i = '<p class="hv_font16">本平台不支持1080P码流视频播放<br/>还请谅解！</p>';
                break;
            case"authBan":
                i = '<p class="hv_font14">该视频暂时无法在此平台播放<br/>请用电脑访问乐视网进行观看，敬请谅解！<br/>试试<a type="tv" class="hv_blu" href="javascript:void(0);">超级电视</a>感受不一样的观影体验。</p>';
                break;
            case"loginMembre":
                this.nodes.popTip.addClass("hv_kt_vip");
                i = ['<p class="hv_font12">试看已结束，继续观看请开通会员</p>', '<p class="hv_font16">开通会员每月增20张观影券</p>', '<p class="hv_btn20"><a href="javascript:void(0);" type="zhifu" k-name="send-sum-stat" data-sum-stat="sumtmp;MZPVIP" class="a1">立即开通会员</a><a href="javascript:void(0);" type="login" class="a2">会员请登录</a></p>'].join("");
                break;
            case"openMembre":
                this.nodes.popTip.addClass("hv_kt_vip");
                i = ['<p class="hv_font12">试看已结束，继续观看请开通会员</p>', '<p class="hv_font16">开通会员每月增20张观影券</p>', '<p class="hv_btn20"><a href="javascript:void(0);" type="zhifu" class="a1">立即开通会员</a></p>'].join("");
                break;
            case"useTicket":
                this.nodes.popTip.addClass("hv_sk_vip");
                i = ['<p class="hv_font12">试看已结束</p>', '<p class="hv_font16"><a href="javascript:void(0);" type="costTicket" class="a1">使用观影券</a>继续观看，您还有<i>', t.ticketsize, "张</i></p>", '<p class="hv_font14">48小时内可重复观看当前影片</p>'].join("");
                break
            }
            if (i) {
                this.nodes.popTip[0].innerHTML = i;
                this.nodes.popTip[0].style.display = "block";
                this.nodes.shadow[0].style.display = "block"
            }
        },
        hide: function() {
            this.nodes.popTip[0].style.display = "none";
            this.nodes.shadow[0].style.display = "none"
        }
    });
    i.exports = n
});
define("view.tip", function(e, t, i) {
    var a = e("./component"), s = e("extend.lib");
    var n = a.extend({
        init: function() {
            this.nodes = {
                container: this.parentEl.find(".js-tip"),
                msg: this.parentEl.find(".js-tip-msg"),
                closeBtn: this.parentEl.find(".hv_tip_close")
            };
            this.addEvent();
            this.autoTime
        },
        addEvent: function() {
            this.nodes.closeBtn.on("click", this.hide, this);
            this.evt.on("showTip", function(e) {
                this.show(e.args[0])
            }, this)
        },
        show: function(e) {
            var t = "";
            var i = false;
            switch (e) {
            case"slow1":
                t = "很抱歉，您使用的网络运营商服务暂不稳定。请选择更低的清晰度观看。";
                break;
            case"slow2":
                t = "很抱歉，您使用的网络运营商服务暂不稳定。您可暂停视频，多缓冲一会儿。";
                break;
            case"changeDefi":
                t = "正在为您切换清晰度...";
                i = true;
                break;
            case"trylook":
                t = "会员影片可试看6分钟";
                i = true;
                break;
            case"tryLookEnd":
                t = "试看已结束，继续欣赏请开通VIP会员，免费观看";
                i = true;
                break
            }
            this.nodes.msg[0].innerHTML = t;
            this.nodes.container[0].style.display = "";
            if (i) {
                clearTimeout(this.autoTime);
                this.autoTime = setTimeout(s.bind(this.hide, this), 5e3)
            }
        },
        hide: function() {
            this.nodes.container[0].style.display = "none"
        }
    });
    i.exports = n
});
define("view.widget.progressBar", function(e, t, i) {
    var a = e("extend.lib"), s = e("view.controlBar"), n = e("extend.detect"), o = e("extend.touchable");
    var r = s.extend({
        init: function() {
            this.nodes = {
                progressBar: this.parentEl.find(".progress_bar"),
                sliderBtn: this.parentEl.find(".hv_ico_playing"),
                currentBar: this.parentEl.find(".porgress_playback"),
                bufferBar: this.parentEl.find(".progress_download"),
                totalTimeTip: this.parentEl.find(".time_total"),
                currentTimeTip: this.parentEl.find(".time_cur")
            };
            this.sliderBtnWidth = this.nodes.sliderBtn.width();
            this.onResize();
            this.hideTotalTimeTipPercent = 0;
            this.isTotalTimeTipHide = false;
            this.currentTimeTipPosition = "right";
            this.seekTime = 0;
            this.duration = 0;
            this.isDrag = false;
            this.evt.on("setDuration", this.onSetDuration, this);
            this.silderTouchable = new o(this.nodes.sliderBtn[0]);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            this.silderTouchable.on("touchstart", this.onSliderTouchStart, this);
            this.silderTouchable.on("touchmove", this.onSliderTouchMove, this);
            this.silderTouchable.on("touchend", this.onSliderTouchEnd, this);
            this.evt.on("timeupdate", this.onTimeUpdate, this);
            this.evt.on("updateSeekTime", this.onUpdateSeekTime, this);
            this.evt.on("TO_Stop", this.onStop, this);
            this.evt.on("tryLookEnd", this.onTryLookEnd, this);
            this.evt.on("TO_Resize", this.onResize, this)
        },
        removeEvent: function() {
            this.silderTouchable.off("touchstart", this.onSliderTouchStart, this);
            this.silderTouchable.off("touchmove", this.onSliderTouchMove, this);
            this.silderTouchable.off("touchend", this.onSliderTouchEnd, this);
            this.evt.off("timeupdate", this.onTimeUpdate, this);
            this.evt.off("updateSeekTime", this.onUpdateSeekTime, this);
            this.evt.off("TO_Stop", this.onStop, this);
            this.evt.off("tryLookEnd", this.onTryLookEnd, this);
            this.evt.off("TO_Resize", this.onResize, this)
        },
        onResize: function() {
            this.progressBarWidth = this.nodes.progressBar.width();
            this.progressBarOffset = this.nodes.progressBar.offset().left;
            this.maxProgressPercent = (this.progressBarWidth - this.sliderBtnWidth) / this.progressBarWidth;
            this.hideTotalTimeTipPercent = (this.progressBarWidth - this.nodes.totalTimeTip.width() - this.sliderBtnWidth) / this.progressBarWidth
        },
        onSetDuration: function(e) {
            this.duration = e.args[0] || 0;
            this.nodes.totalTimeTip[0].innerHTML = a.formatTime(this.duration);
            this.hideTotalTimeTipPercent = (this.progressBarWidth - this.nodes.totalTimeTip.width() - this.sliderBtnWidth) / this.progressBarWidth
        },
        onSliderTouchStart: function(e) {
            var t = e.args[1];
            t.preventDefault();
            this.seekTime = 0;
            this.diffX = e.args[0].startTouch.x - this.nodes.sliderBtn.offset().left;
            document.body.focus();
            document.onselectstart = function() {
                return false
            }
        },
        onSliderTouchMove: function(e) {
            this.state.isDrag = true;
            var t = e.args[0].currentTouch.x - this.progressBarOffset - this.diffX;
            var i = t / this.progressBarWidth;
            this.setProgress(i, "percent")
        },
        onSliderTouchEnd: function() {
            this.state.isDrag = false;
            var e = parseFloat(this.nodes.sliderBtn.getStyle("left")) / 100 * this.duration;
            if (this.checkTryLook(e))
                return;
            this.evt.trigger("TO_Seek", e);
            if (this.state.videoState == "ended") {
                this.evt.trigger("TO_Play", e)
            }
            document.onselectstart = null
        },
        onTimeUpdate: function() {
            if (this.state.isDrag || this.state.isSeeking)
                return;
            this.setProgress()
        },
        onUpdateSeekTime: function(e) {
            this.setProgress(e.args[0])
        },
        onStop: function() {
            this.nodes.totalTimeTip[0].style.display = "none";
            this.nodes.bufferBar.setStyle("width", 0);
            this.setProgress(0)
        },
        onTryLookEnd: function() {
            this.setProgress(0)
        },
        setProgress: function(e, t) {
            var i, s;
            if (t == "percent") {
                i = e
            } else {
                s = typeof e != "undefined" ? e : this.core.getCurrentTime();
                i = s / this.duration
            }
            i = Math.max(0, i);
            i = Math.min(i, this.maxProgressPercent);
            s = s || i * this.duration;
            this.nodes.currentTimeTip[0].innerHTML = a.formatTime(s);
            this.nodes.currentTimeTip[0].currentTime = s;
            if (i >= this.hideTotalTimeTipPercent) {
                if (!this.isTotalTimeTipHide) {
                    this.nodes.totalTimeTip[0].style.display = "none";
                    this.isTotalTimeTipHide = true
                }
            } else {
                if (this.isTotalTimeTipHide) {
                    this.nodes.totalTimeTip[0].style.display = "";
                    this.isTotalTimeTipHide = false
                }
            }
            var n = this.model.option.tplType == "base" ? 45: 55;
            if (i * this.progressBarWidth > n) {
                if (this.currentTimeTipPosition != "left") {
                    this.nodes.currentTimeTip.setStyle("marginLeft", "-" + n + "px");
                    this.currentTimeTipPosition = "left"
                }
            } else {
                if (this.currentTimeTipPosition != "right") {
                    this.nodes.currentTimeTip.setStyle("marginLeft", "35px");
                    this.currentTimeTipPosition = "right"
                }
            }
            i = i * 100 + "%";
            this.nodes.sliderBtn[0].style.left = i;
            this.nodes.currentBar[0].style.width = i;
            this.nodes.currentTimeTip[0].style.left = i;
            if (typeof e == "undefined") {
                var o = this.core.getBuffered();
                var r;
                for (var d = 0, l = o.length; d < l; d++) {
                    if (o[d].end - s >= 0) {
                        r = o[d].end / this.duration * 100 + "%";
                        break
                    }
                }
                r = r && r > i ? r : i;
                this.nodes.bufferBar.setStyle("width", r)
            }
        }
    });
    i.exports = r
});
define("view.widget.playBtn", function(e, t, i) {
    var a = e("view.controlBar");
    var s = a.extend({
        init: function() {
            this.nodes = {
                playBtn: this.parentEl.find(".hv_start span")
            };
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (vjs.isDebug) {
                this.nodes.playBtn.on("click", this.onBtnPlay, this)
            } else {
                this.nodes.playBtn.on("touchend", this.onBtnPlay, this)
            }
            this.evt.on("play", this.onPlay, this);
            this.evt.on("pause", this.onPause, this);
            this.evt.on("ended", this.onEnded, this)
        },
        removeEvent: function() {
            if (vjs.isDebug) {
                this.nodes.playBtn.off("click", this.onBtnPlay, this)
            } else {
                this.nodes.playBtn.off("touchend", this.onBtnPlay, this)
            }
            this.evt.off("play", this.onPlay, this);
            this.evt.off("pause", this.onPause, this);
            this.evt.off("ended", this.onEnded, this)
        },
        onBtnPlay: function() {
            switch (this.nodes.playBtn[0].className) {
            case"hv_ico_star":
                this.evt.trigger("TO_Pause");
                this.state.isUserPause = true;
                break;
            case"hv_ico_stop":
                this.evt.trigger("TO_Play");
                this.state.isUserPause = false;
                break;
            case"hv_ico_refresh":
                this.evt.trigger("TO_Refresh");
                this.state.isUserPause = false;
                break
            }
        },
        onPlay: function() {
            this.nodes.playBtn[0].className = "hv_ico_star";
            this.state.isUserPause = false
        },
        onPause: function() {
            this.nodes.playBtn[0].className = "hv_ico_stop"
        },
        onEnded: function() {
            this.nodes.playBtn[0].className = "hv_ico_refresh";
            this.state.isUserPause = false
        }
    });
    i.exports = s
});
define("view.widget.fullBtn", function(e, t, i) {
    var a = e("view.controlBar"), s = e("extend.detect");
    var n = a.extend({
        init: function() {
            this.nodes = {
                fullBtn: this.parentEl.find(".hv_ico_screen"),
                pannel: this.parentEl.find(".js-pannel"),
                optDefi: this.parentEl.find(".clear_ul")
            };
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (vjs.isDebug) {
                this.nodes.fullBtn.on("click", this.onFullBtnClick, this)
            } else {
                this.nodes.fullBtn.on("touchend", this.onFullBtnClick, this)
            }
        },
        removeEvent: function() {
            if (vjs.isDebug) {
                this.nodes.fullBtn.off("click", this.onFullBtnClick, this)
            } else {
                this.nodes.fullBtn.off("touchend", this.onFullBtnClick, this)
            }
        },
        onFullBtnClick: function() {
            if (s.Android && (this.model.option.pname == "MPlayer" || this.model.option.pname == "coop")) {
                if (this.nodes.fullBtn.hasClass("hv_ico_allscreen")) {
                    this.nodes.fullBtn.removeClass("hv_ico_allscreen");
                    this.parentEl.removeClass("hv_fullscreen");
                    document.removeEventListener("touchstart", this.preventDefault, false)
                } else {
                    this.nodes.fullBtn.addClass("hv_ico_allscreen");
                    this.parentEl.addClass("hv_fullscreen");
                    document.addEventListener("touchstart", this.preventDefault, false)
                }
                window.scrollTo(0, 1);
                this.evt.trigger("TO_Resize")
            } else {
                this.parentEl.addClass("hv_box_hide");
                this.nodes.optDefi.removeClass("hover");
                this.requestFullScreen()
            }
        },
        preventDefault: function(e) {
            e.preventDefault()
        },
        requestFullScreen: function() {
            this.evt.trigger("changeFullScreen", true)
        }
    });
    i.exports = n
});
define("view.widget.defiBtn", function(e, t, i) {
    var a = e("view.controlBar"), s = e("extend.lib");
    var n = a.extend({
        init: function() {
            this.nodes = {
                optDefi: this.parentEl.find(".clear_ul"),
                btnDefi: this.parentEl.find(".hv_ico_clarity")
            };
            this.defiEnum = ["流畅", "高清", "超清", "720P", "1080P", "原画"];
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            this.evt.on("onVideoRateChanged", this.onVideoRateChanged, this);
            if (vjs.isDebug) {
                this.nodes.btnDefi.on("click", this.onBtnDefi, this);
                this.nodes.optDefi.on("click", this.onOptDefi, this)
            } else {
                this.nodes.btnDefi.on("touchend", this.onBtnDefi, this);
                this.nodes.optDefi.on("touchend", this.onOptDefi, this)
            }
        },
        removeEvent: function() {
            this.evt.off("onVideoRateChanged", this.onVideoRateChanged, this);
            if (vjs.isDebug) {
                this.nodes.btnDefi.off("click", this.onBtnDefi, this);
                this.nodes.optDefi.off("click", this.onOptDefi, this)
            } else {
                this.nodes.btnDefi.off("touchend", this.onBtnDefi, this);
                this.nodes.optDefi.off("touchend", this.onOptDefi, this)
            }
        },
        onMovieSucc: function(e) {
            var t = this.movieVO = e.args[0];
            if (t) {
                this.initDefi()
            }
        },
        onOptDefi: function(e) {
            var t = e.target;
            if (t.tagName.toLowerCase() == "li") {
                var i = vjs(t).getAttr("value");
                s.setCookie("defi", i, {
                    path: "/",
                    domain: "letv.com",
                    expires: new Date(2099, 12, 30, 23, 59, 59)
                });
                this.evt.trigger("showTip", "changeDefi");
                this.evt.trigger("TO_RateChanged", i, true)
            }
            this.nodes.optDefi.removeClass("hover")
        },
        onBtnDefi: function(e) {
            var t = this.nodes.optDefi;
            if (t.hasClass("hover")) {
                t.removeClass("hover")
            } else {
                t.addClass("hover")
            }
        },
        onVideoRateChanged: function(e) {
            this.defi = e.args[0];
            var t = this.nodes.optDefi[0];
            for (var i = 0, a = t.children.length; i < a; i++) {
                var s = t.children[i];
                if (s.getAttribute("value") == this.defi) {
                    vjs(s).addClass("hover")
                } else {
                    vjs(s).removeClass("hover")
                }
            }
            this.nodes.btnDefi[0].innerHTML = this.defiEnum[parseInt(this.defi)-1]
        },
        initDefi: function() {
            var e = this.movieVO, t = this.nodes.optDefi[0], i = [];
            for (var a in e) {
                i.push(parseInt(a))
            }
            i.sort();
            var s = [];
            for (var n = 0, o = i.length; n < o; n++) {
                s.push('<li value="' + i[n] + '">' + this.defiEnum[parseInt(i[n])-1] + "</li>")
            }
            t.innerHTML = s.join("")
        }
    });
    i.exports = n
});
define("view.widget.nextVideoBtn", function(e, t, i) {
    var a = e("view.controlBar"), s = e("extend.lib");
    var n = a.extend({
        init: function() {
            this.nodes = {
                nextVideoBtn: this.parentEl.find(".hv_ico_next")
            };
            var e = this.model.vinfo;
            if (!window.nextVideoSrc || e.nextvid <= 0 || e.nextvid == e.vid || this.model.option.pname == "MPlayer") {
                this.nodes.nextVideoBtn.addClass("gray")
            } else {
                this.evt.on("setVideoEnable", function(e) {
                    if (e.args[0]) {
                        this.addEvent()
                    } else {
                        this.removeEvent()
                    }
                }, this)
            }
        },
        addEvent: function() {
            this.nodes.nextVideoBtn.on("click", this.onNextVideoBtnClick, this)
        },
        removeEvent: function() {
            this.nodes.nextVideoBtn.off("click", this.onNextVideoBtnClick, this)
        },
        onNextVideoBtnClick: function() {
            if (!this.nodes.nextVideoBtn.hasClass("gray")) {
                this.evt.trigger("TO_PlayNext")
            }
        }
    });
    i.exports = n
});
define("view.minControlBar", function(e, t, i) {
    var a = e("./component");
    var s = a.extend({
        init: function() {
            this.initChildren()
        }
    });
    s.prototype.option = {
        children: {
            playBtn: "view.widget.playBtn",
            fullBtn: "view.widget.fullBtn",
            porgressbar: "view.widget.progressBar"
        }
    };
    i.exports = s
});
define("view.minPlayingPannel", function(e, t, i) {
    var a = e("./component"), s = e("extend.lib"), n = e("extend.detect");
    var o = a.extend({
        init: function() {
            this.nodes = {
                pannel: this.parentEl.find(".js-pannel"),
                poster: this.parentEl.find(".hv_play_poster"),
                loading: this.parentEl.find(".hv_ico_loading"),
                bigPlayBtn: this.parentEl.find(".hv_ico_pasued"),
                shadow: this.parentEl.find(".js-bg")
            };
            this.pannelWidth = this.nodes.pannel.width();
            this.autoHideTime = null;
            this.isMove = false;
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("tryLookEnd", this.onTrylookEnd, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (vjs.isDebug) {
                this.parentEl.on("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("click", this.toPlay, this);
                this.nodes.shadow.on("click", this.stopPropagation)
            } else {
                this.parentEl.on("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("touchend", this.toPlay, this);
                this.nodes.shadow.on("touchend", this.stopPropagation)
            }
            this.evt.on("play", this.onPlay, this);
            this.evt.on("ended", this.onEnded, this);
            this.evt.on("canplay canplaythrough play playing seeked vjs_seeked", this.hide, this);
            this.evt.on("seeking waiting error vjs_seeking", this.show, this);
            this.evt.on("TO_Resize", this.onResize, this);
            this.evt.on("showTip", this.onShowTip, this)
        },
        removeEvent: function() {
            if (vjs.isDebug) {
                this.parentEl.off("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("click", this.toPlay, this);
                this.nodes.shadow.off("click", this.stopPropagation)
            } else {
                this.parentEl.off("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("touchend", this.toPlay, this);
                this.nodes.shadow.off("touchend", this.stopPropagation)
            }
            this.evt.off("play", this.onPlay, this);
            this.evt.off("ended", this.onEnded, this);
            this.evt.off("canplay canplaythrough play playing seeked vjs_seeked", this.hide, this);
            this.evt.off("seeking waiting error vjs_seeking", this.show, this);
            this.evt.off("TO_Resize", this.onResize, this);
            this.evt.off("showTip", this.onShowTip, this)
        },
        onMovieSucc: function() {
            this.nodes.bigPlayBtn[0].style.display = "block"
        },
        toPlay: function() {
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.poster[0].style.display = "none";
            this.nodes.loading[0].style.display = "block";
            this.nodes.shadow[0].style.display = "none";
            this.evt.trigger("TO_Play")
        },
        onPlay: function() {
            this.nodes.poster[0].style.display = "none";
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.shadow[0].style.display = "none";
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel();
            this.evt.off("play", this.onPlay, this)
        },
        onEnded: function() {
            this.nodes.poster[0].style.display = "block";
            this.evt.on("play", this.onPlay, this)
        },
        show: function() {
            this.nodes.loading[0].style.display = "block"
        },
        hide: function() {
            this.nodes.loading[0].style.display = "none"
        },
        autoHidePannel: function() {
            clearTimeout(this.autoHideTime);
            this.autoHideTime = setTimeout(s.bind(function() {
                if (!this.state.isDrag) {
                    this.parentEl.addClass("hv_box_hide")
                }
            }, this), 5e3)
        },
        togglePannel: function(e) {
            if (e && e.target === this.nodes.pannel[0]&&!this.isMove) {
                if (this.parentEl.hasClass("hv_box_hide")) {
                    this.parentEl.removeClass("hv_box_hide")
                } else {
                    this.parentEl.addClass("hv_box_hide")
                }
            }
            this.autoHidePannel()
        },
        onShowTip: function() {
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel()
        },
        onResize: function() {
            this.pannelWidth = this.nodes.pannel.width()
        },
        onTrylookEnd: function() {
            this.nodes.loading[0].style.display = "none";
            this.parentEl.addClass("hv_box_hide")
        },
        stopPropagation: function(e) {
            e.stopPropagation()
        }
    });
    i.exports = o
});
define("view.iphonePlayingPannel", function(e, t, i) {
    var a = e("./component"), s = e("extend.lib"), n = e("extend.detect");
    var o = a.extend({
        init: function() {
            this.nodes = {
                bigPlayBtn: this.parentEl.find(".hv_ico_pasued"),
                shadow: this.parentEl.find(".js-bg"),
                video: this.parentEl.find("video")
            };
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (vjs.isDebug) {
                this.nodes.bigPlayBtn.on("click", this.toPlay, this);
                this.nodes.shadow.on("click", this.stopPropagation)
            } else {
                this.nodes.bigPlayBtn.on("touchend", this.toPlay, this);
                this.nodes.shadow.on("touchend", this.stopPropagation)
            }
        },
        removeEvent: function() {
            if (vjs.isDebug) {
                this.nodes.bigPlayBtn.off("click", this.toPlay, this);
                this.nodes.shadow.off("click", this.stopPropagation)
            } else {
                this.nodes.bigPlayBtn.off("touchend", this.toPlay, this);
                this.nodes.shadow.off("touchend", this.stopPropagation)
            }
        },
        onMovieSucc: function() {
            this.nodes.bigPlayBtn[0].style.display = "block";
            this.nodes.video[0].style.display = "block"
        },
        toPlay: function() {
            this.evt.trigger("TO_Play")
        },
        stopPropagation: function(e) {
            e.stopPropagation()
        }
    });
    i.exports = o
});
define("view.liveControlBar", function(e, t, i) {
    var a = e("./component");
    var s = a.extend({
        init: function() {
            this.initChildren()
        }
    });
    s.prototype.option = {
        children: {
            playBtn: "view.widget.playBtn",
            fullBtn: "view.widget.fullBtn",
            defiBtn: "view.widget.defiBtn",
            porgressbar: "view.widget.liveProgressBar"
        }
    };
    i.exports = s
});
define("view.minLiveControlBar", function(e, t, i) {
    var a = e("./component");
    var s = a.extend({
        init: function() {
            this.initChildren()
        }
    });
    s.prototype.option = {
        children: {
            playBtn: "view.widget.playBtn",
            fullBtn: "view.widget.fullBtn",
            porgressbar: "view.widget.liveProgressBar"
        }
    };
    i.exports = s
});
define("view.widget.liveProgressBar", function(e, t, i) {
    var a = e("extend.lib"), s = e("view.controlBar");
    var n = s.extend({
        init: function() {
            this.nodes = {
                currentTime: this.parentEl.find(".live_bar span")
            };
            this.currentTime = 0;
            this.autoTime = null;
            this.evt.on("ToSetTime", this.onSetCurrentTime, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            this.evt.on("play playing", this.startUpdateTime, this);
            this.evt.on("pause ended waiting onVideoRateChanged", this.stopUpdateTime, this)
        },
        removeEvent: function() {
            this.evt.on("play playing", this.startUpdateTime, this);
            this.evt.on("pause ended waiting onVideoRateChanged", this.stopUpdateTime, this)
        },
        onSetCurrentTime: function(e) {
            this.currentTime = e.args[0];
            this.updateTime();
            this.startUpdateTime()
        },
        updateTime: function() {
            var e = new Date(++this.currentTime * 1e3);
            var t = e.getHours(), i = e.getMinutes(), a = e.getSeconds();
            if (t < 10)
                t = "0" + t;
            if (i < 10)
                i = "0" + i;
            if (a < 10)
                a = "0" + a;
            this.nodes.currentTime[0].innerHTML = t + ":" + i + ":" + a
        },
        startUpdateTime: function() {
            clearInterval(this.autoTime);
            this.autoTime = setInterval(a.bind(this.updateTime, this), 1e3)
        },
        stopUpdateTime: function() {
            clearInterval(this.autoTime)
        }
    });
    i.exports = n
});
define("view.livePlayingPannel", function(e, t, i) {
    var a = e("./component"), s = e("extend.lib"), n = e("extend.detect");
    var o = a.extend({
        init: function() {
            this.nodes = {
                pannel: this.parentEl.find(".js-pannel"),
                poster: this.parentEl.find(".hv_play_poster"),
                loading: this.parentEl.find(".hv_ico_loading"),
                bigPlayBtn: this.parentEl.find(".hv_ico_pasued"),
                shadow: this.parentEl.find(".js-bg"),
                optDefi: this.parentEl.find(".clear_ul")
            };
            this.autoHideTime = null;
            this.evt.on("movieSucc", this.onMovieSucc, this);
            this.evt.on("setVideoEnable", function(e) {
                if (e.args[0]) {
                    this.addEvent()
                } else {
                    this.removeEvent()
                }
            }, this)
        },
        addEvent: function() {
            if (vjs.isDebug) {
                this.parentEl.on("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("click", this.toPlay, this);
                this.nodes.shadow.on("click", this.stopPropagation)
            } else {
                this.parentEl.on("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.on("touchend", this.toPlay, this);
                this.nodes.shadow.on("touchend", this.stopPropagation)
            }
            this.evt.on("play", this.onPlay, this);
            this.evt.on("canplay canplaythrough play playing tryLookEnd seeked", this.hide, this);
            this.evt.on("seeking waiting error", this.show, this);
            this.evt.on("showTip", this.onShowTip, this)
        },
        removeEvent: function() {
            if (vjs.isDebug) {
                this.parentEl.off("mouseup", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("click", this.toPlay, this);
                this.nodes.shadow.off("click", this.stopPropagation)
            } else {
                this.parentEl.off("touchend", this.togglePannel, this);
                this.nodes.bigPlayBtn.off("touchend", this.toPlay, this);
                this.nodes.shadow.off("touchend", this.stopPropagation)
            }
            this.evt.off("play", this.onPlay, this);
            this.evt.off("canplay canplaythrough play playing tryLookEnd seeked", this.hide, this);
            this.evt.off("seeking waiting error", this.show, this);
            this.evt.off("showTip", this.onShowTip, this)
        },
        onMovieSucc: function() {
            this.nodes.bigPlayBtn[0].style.display = "block"
        },
        toPlay: function() {
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.loading[0].style.display = "block";
            this.nodes.shadow[0].style.display = "none";
            this.evt.trigger("TO_Play")
        },
        onPlay: function() {
            this.nodes.poster[0].style.display = "none";
            this.nodes.bigPlayBtn[0].style.display = "none";
            this.nodes.shadow[0].style.display = "none";
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel();
            this.evt.off("play", this.onPlay, this)
        },
        show: function() {
            this.nodes.loading[0].style.display = "block"
        },
        hide: function() {
            this.nodes.loading[0].style.display = "none"
        },
        autoHidePannel: function() {
            clearTimeout(this.autoHideTime);
            this.autoHideTime = setTimeout(s.bind(function() {
                if (!this.state.isDrag) {
                    this.parentEl.addClass("hv_box_hide");
                    this.nodes.optDefi.removeClass("hover")
                }
            }, this), 5e3)
        },
        togglePannel: function(e) {
            if (e && e.target === this.nodes.pannel[0]) {
                if (this.parentEl.hasClass("hv_box_hide")) {
                    this.parentEl.removeClass("hv_box_hide")
                } else {
                    this.parentEl.addClass("hv_box_hide");
                    this.nodes.optDefi.removeClass("hover")
                }
            }
            this.autoHidePannel()
        },
        onShowTip: function() {
            this.parentEl.removeClass("hv_box_hide");
            this.autoHidePannel()
        },
        stopPropagation: function(e) {
            e.stopPropagation()
        }
    });
    i.exports = o
});
define("player", function(e, t, i) {
    if (typeof LETV !== "undefined") {
        window.Config = LETV.using.call(window, "__INFO__.video")
    } else {
        window.Config = {}
    }
    var a = window.LELib = function() {};
    var s = a.Revive = {};
    var n = a.FlashVars;
    var o = e("extend.detect"), r = e("extend.lib"), d = e("core.vjs");
    var l = {}, c = o.Android || (o.iPad || o.iPod || o.iPhone)&&!o.atwin || o.wph || o.ps;
    s.Player = function(t, i, a, n, o, p) {
        p = p || {};
        var f = function(a) {
            var f = h(t, n);
            var u = {
                cont: t,
                width: i.w,
                height: i.h,
                flashvar: f,
                extInfo: p
            };
            if (c || typeof p != "undefined" && p.forceH5) {
                if (l && typeof l.playMovie == "function" && typeof meaidHtml != "undefined" && meaidHtml.pcid.length > 1) {
                    l.playMovie({
                        vid: r.getParamVal(f, "vid")
                    })
                } else if (Config.trylook != 10 || a) {
                    var v = e("module.h5player");
                    l = new v(u)
                }
            } else {
                i.wmode = "direct";
                if (typeof $ !== "undefined" && $.browser && $.browser.safari&&!$.browser.chrome) {
                    i.wmode = "opaque"
                }
                if (i.newwmode)
                    i.wmode = i.newwmode;
                try {
                    if (i.w >= 970) {
                        d(".js_play_con")[0].style.height = "575px";
                        d(".video-play")[0].style.height = "515px";
                        i.h += 35
                    } else {
                        d(".js_play_con")[0].style.height = "";
                        d(".video-play")[0].style.height = ""
                    }
                } catch (g) {}
                l = s.flashPlayer(t, i, f, o instanceof Array ? o[3] : o, [10, 0, 0])
            }
        };
        var u = function(e) {
            if (e) {
                i.w = e.width || i.w;
                i.h = e.height || i.h
            }
            f(true)
        };
        f(false);
        return {
            player: l,
            reload: u
        }
    };
    s.LivePlayer = function(t, i, a, n, o, r) {
        r = r || {};
        var d = function() {
            var d = {
                cont: t,
                width: i.w,
                height: i.h,
                urlList: a,
                flashvar: n,
                extInfo: r
            };
            if (c || r.forceH5) {
                var h = e("module.h5player");
                l = new h(d)
            } else {
                i.wmode = "direct";
                if ($.browser.safari&&!$.browser.chrome) {
                    i.wmode = "opaque"
                }
                s.flashPlayer(t, i, n, o instanceof Array ? o[3] : o, [10, 2, 0])
            }
        };
        var h = function(e) {
            if (e) {
                i.w = e.width || i.w;
                i.h = e.height || i.h
            }
            d()
        };
        d();
        return {
            player: l,
            reload: h
        }
    };
    s.Video = function(e, t, i) {
        this.video;
        this.videoBox = e;
        this.urlList = i.v || ["undefind"];
        this.initpic = i.p || "";
        this.timer = null;
        this.duration = 0;
        this.option = t || {
            w: 540,
            h: 450
        };
        this.config = {
            height: this.option.h,
            width: this.option.w,
            controls: "controls",
            preload: "preload",
            poster: this.initpic,
            autoplay: ""
        };
        this.getcurrent = function() {
            var e = this.video.currentTime;
            return e
        };
        this.initVideo = function() {
            var e = this;
            var t = LETV.Base64.decode(this.urlList[0]);
            var i = 0;
            var a = function(t) {
                $("#" + e.videoBox).html("<div style='background:#111;color:#fff;line-height:" + e.option.h + "px;height:" + e.option.h + "px'>" + t + "</div>")
            };
            if (this.urlList[0] == "(none)" || this.urlList[0] == "undefind" || this.urlList[0] == "") {
                a("您观看的视频不支持此设备播放!");
                return false
            }
            var s = function() {
                i++;
                var n = $("<video>").attr(e.config).css({
                    background: "#000"
                });
                $("#" + e.videoBox).html(n);
                var o = n.get(0);
                o.src = t + "&_rand=" + Math.random();
                o.onerror = function() {
                    if (i > 9) {
                        a("视频加载失败，请重试。");
                        return 
                    }
                    s()
                };
                o.load();
                e.video = o
            };
            s()
        };
        this.initVideo()
    };
    s.SimplePlayer = function(e, t, i, a) {
        var s = this;
        this.videoBox = e;
        this.urlList = i.v || ["undefind"];
        this.initpic = i.p || "";
        this.option = t || {
            w: 540,
            h: 450
        };
        this.config = {
            height: this.option.h,
            width: this.option.w
        };
        this.initVideo = function() {
            var e = $("#" + this.videoBox);
            var i = parseInt(this.config.width) / 2-100;
            var n = this.urlList[0];
            var o;
            var r = "";
            if (t.autoplay == 1) {
                r = 'autoplay="autoplay" '
            }
            var d = "";
            if (t.poster) {
                d = 'poster="' + t.poster + '" '
            }
            if (n) {
                var l = [];
                var c = $('<div style="position:relative; width:' + this.config.width + "px; height=" + this.config.height + 'px;"><a id="html5_play_button_' + this.videoBox + '" href="javascript:$(\'#videoHTML5_' + this.videoBox + "')[0].play();\" style=\"width:100px; height:100px; display:block; background:url('http://i1.letvimg.com/img/201304/08/html5_play_button.png') no-repeat 0 0; position:absolute; top:" + (this.config.height / 2-50) + "px; left:" + (this.config.width / 2-50) + 'px; text-indent:-3000px; z-index:100;">播放</a><video id="videoHTML5_' + this.videoBox + '" type="video/mp4" width="' + this.config.width + 'px" height="' + this.config.height + 'px" controls="controls" ' + r + d + ' style="background-color:#000;"></video></div>');
                c.appendTo(e);
                var h = $("#videoHTML5_" + this.videoBox), p = $("#html5_play_button_" + this.videoBox);
                h.on({
                    play: function() {
                        try {
                            h.removeAttr("poster");
                            window[t.callback].PLAYER_VIDEO_PLAY()
                        } catch (e) {}
                        p.css("display", "none");
                        if (!o) {
                            o = true;
                            var i = new Image;
                            i.onload = function() {
                                i = null
                            };
                            var s = LETV.using("App.Stat.html5VV").getData();
                            a = a ? a : {};
                            for (var n in a) {
                                s[n] = a[a]
                            }
                            i.src = "http://dc.letv.com/mhtml5/p?" + s.statver + "&" + s.cid + "&" + s.vinfo + "&" + s.playurl + "&" + s.rate + "&" + s.vlen + "&" + s.os + "&" + s.terminal + "&" + s.ref + "&" + s.ptype
                        }
                    },
                    pause: function() {
                        try {
                            window[t.callback].PLAYER_VIDEO_PAUSE()
                        } catch (e) {}
                        p.css("display", "block")
                    }
                }).attr("src", n);
                try {
                    h.play()
                } catch (f) {}
                s.call = function(e) {
                    try {
                        h[0][e]()
                    } catch (t) {
                        console.log(t)
                    }
                }
            }
        };
        this.initVideo();
        return this
    };
    s.chainBroadcast = function(e) {
        var t = $("#j_jujiarea_down");
        var i = t.find("a[data-vid=" + e.vid + "]");
        var a = $(i).attr("data-key");
        window.location.hash = a;
        LETV.Plugin.JuList()
    };
    s.mainChainBroadcast = function(e) {
        if (e.index > 0) {
            var t = window.__INFO__.playlist;
            t.curno = e.index;
            $(".crumbs-info").find("h1").html(e.title);
            $(document).attr("title", e.title + " - 在线观看 - 乐视网");
            var i = window.__INFO__.video.cid;
            if (i != 2 && i != 5) {
                $(".crumbs-info").find("font").html(e.title)
            }
            LETV.App.Play.PlayList($.extend({
                cont: ".J-List"
            }, t))
        }
    };
    s.getNextKey = function(e) {
        if (e < window.__INFO__.playlist.total) {
            return parseInt(e) + 1
        } else {
            return -1
        }
    };
    function h(t, i) {
        var a = /[?#&]*callbackJs=([\w+\.]+)/i.exec(i);
        var s = "callback_" + String(Math.random()).slice(-6), n, o;
        if (typeof window.interfaces == "undefined")
            window.interfaces = [];
        var r = window.interfaces;
        try {
            var d = e("module.Flash.interface");
            var l = new d;
            l.cont = t
        } catch (c) {}
        if (a !== null && a[1] !== "LETV.Plugin.Video.refreshState") {
            n = new Function("status", "data", "return " + a[1] + "(status,data)");
            r.push(n)
        }
        var h = function(e, t) {
            for (var i = 0, a = r.length; i < a; i++) {
                o = r[i](e, t);
                if (o)
                    return o
            }
            return l && l[e] && typeof l[e] === "function" && l[e](t)
        };
        window[s] = h;
        return a !== null ? i.replace("callbackJs=" + a[1], "callbackJs=" + s) : i + "&callbackJs=" + s
    }
});
LTK.use("player");
var ten_minutes_ban = {
    init: function() {
        if (!vjs.videoBanEnd)
            return;
        var e = /m.letv.com/i.test(location.host), t = /www.letv.com/i.test(location.host), i, a;
        if (t) {
            i = this._parseTimeFormat(__INFO__.video.duration)
        } else if (e) {
            i = info.duration
        }
        if (i < 600 ||!e&&!t || $("#tips-style").length > 0)
            return;
        var s = document.createElement("style"), n = [".cls-btn{ position:absolute; width:30px; height:30px; right:10px;}", ".cls-btn i{ background-color:#c6c6c6; width:4px; height:20px; position:absolute; top:5px; left:13px;}", ".cls-btn a{ display:block; height:30px; position:relative;}.cls-btn i{ background-color:#c6c6c6; width:4px; height:20px; position:absolute; top:5px; left:13px;}", ".cls-btn .i-1{ -moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);}", ".cls-btn .i-2{ -moz-transform:rotate(-45deg);-webkit-transform:rotate(-45deg);}", ".top-down{ background-color:#DBDBDB; padding:5px 0; position:relative;}.top-down span,.top-down a,.top-down em{ font-size:12px;}", ".top-down span{ padding-left:5px; line-height:28px;}", ".top-down .top-down,.top-down em{ float:right; display:inline; margin-right:5px; line-height:28px;}", ".top-down .top-down{ background-color:#F8F8F8; color:#06A7E1; padding:0 10px; margin-right:40px;}", ".top-down em{ top:0;}.top-down em,.top-down em a{ height:23px; width:23px;}.top-down em i{ height:13px; left:10px; width:3px;}", ".tips-time {height: 40px; width: 100%;padding: 0;max-width:100%; background-color:#ffdea5; color:#623e00; overflow:hidden;}", ".tips-time p{ max-width:970px; min-width:310px; margin:0 auto; margin-top:6px; position:relative;}", ".tips-time p span{ font-size:16px;}", ".tips-time .top-down{ background-color:#fff0d6; color:#623e00; padding:0 5px;}", ".tips-time em, .tips-time em a{width:30px; height:30px;}", ".tips-time em{ margin-right:0;}", ".tips-time em i{ left:12px; top:8px;}"].join("");
        s.innerHTML = n;
        s.id = "tips-style";
        document.getElementsByTagName("head")[0].appendChild(s);
        var o = ['<div class="tips-time top-down">', '<p><span>本页面提供10分钟预览</span> <em class="cls-btn"><a href="javascript:;">', '<i class="i-1"></i><i class="i-2"></i></a></em> <a href="javascript:;" class="top-down">点这里观看完整版', "</a></p></div>"].join("");
        if (t) {
            $(".Player").before(o)
        } else if (e) {
            var r = $("#j-dltips");
            if (r && r.length > 0) {
                $("#j-dltips").html(o)
            } else {
                $("#j-player").before(o)
            }
        }
        a = $(".tips-time");
        a.find(".cls-btn").click(function() {
            a[0].parentNode.removeChild(a[0]);
            var e = $("#tips-style")[0];
            e.parentNode.removeChild(e);
            e = null
        });
        a.find(".top-down").click(function() {
            location.href = "http://down.m.letv.com/download.php?ref=2068"
        })
    },
    _parseTimeFormat: function(e) {
        var t = e.split(":"), i = 0;
        for (var a = 0; a < t.length; a++) {
            i = parseInt(t[a]) + i * 60
        }
        return i
    }
};
window.__openApp = {
    param: {
        type: "",
        vid: "",
        pid: "",
        ref: "",
        downloadfrom: ""
    },
    initParam: function(e) {
        this.param.ref = e.ref || "";
        this.param.vid = e.vid || info.vid || "";
        this.param.pid = e.pid || info.pid || "";
        this.param.type = e.type || "";
        this.param.downloadfrom = e.downloadfrom || "";
        var t = navigator.userAgent;
        this.isiPad = t.match(/iPad/i) != null;
        this.isiPhone = t.match(/iPhone/i) != null;
        this.isandroid = t.match(/Android/i) != null;
        this.isChrome = t.toLowerCase().match(/chrome/) != null;
        this.isWeiXin = t.match(/MicroMessenger/i) != null
    },
    _bindDownloadEvent: function(e) {
        this.initParam(e);
        if (this.isWeiXin) {
            location.href = "http://ti50.3g.qq.com/open/s?aid=jumpurl&url=http://url.cn/" + encodeURIComponent(e.shortUrl);
            return 
        }
        location.href = e.url
    },
    _bindDefaultAppEvent: function(e) {
        this.options = e || {};
        this.initParam(this.options);
        var t = this._getOpenAppUrl();
        var i = this._getDownloadAppUrl();
        setTimeout(function() {
            var e = (new Date).valueOf();
            if (__openApp.isandroid) {
                var a = document.createElement("iframe");
                a.style.cssText = "width:0px;height:0px;position:fixed;top:0;left:0;";
                a.src = t;
                document.body.appendChild(a);
                e = (new Date).valueOf()
            } else {
                location.href = t
            }
            setTimeout(function() {
                var t = (new Date).valueOf();
                if (1550 > t - e) {
                    location.href = i
                }
            }, 1500)
        }, 100)
    },
    _getOpenAppUrl: function() {
        var e = "", t = "";
        if (this.param.type.match(/pay/i)) {
            t = 1
        } else {
            t = 0
        }
        e = "letvclient://msiteAction?actionType=" + encodeURIComponent(t) + "&pid=" + encodeURIComponent(this.param.pid) + "&vid=" + encodeURIComponent(this.param.vid) + "&from=mletv";
        return e
    },
    _getDownloadAppUrl: function() {
        var e = "", t = "", i = {
            smartbanner: "MZuxfq",
            downloadapptips: "Ukstkl",
            launchpage: "IlwBkr",
            2068: "P3QVbB",
            other: "IjrlGs"
        }, a = "";
        if (this.isWeiXin) {
            if (this.param.downloadfrom == "downloadapptips" || this.param.ref == "2068") {
                e = "http://a.app.qq.com/o/simple.jsp?pkgname=com.letv.android.client&g_f=991646"
            } else {
                if ((t = i[this.param.downloadfrom]) || (t = i[this.param.ref])) {} else {
                    t = i["other"]
                }
                e = "http://ti50.3g.qq.com/open/s?aid=jumpurl&url=http://url.cn/" + encodeURIComponent(t)
            }
        } else {
            if (this.param.downloadfrom) {
                a = "?from=" + encodeURIComponent(this.param.downloadfrom)
            } else if (this.param.ref) {
                a = "?ref=" + encodeURIComponent(this.param.ref)
            }
            e = this.param.ref === "2068" ? "http://m.letv.com/client/download.php" : "http://app.m.letv.com/download.php" + a
        }
        return e
    }
};
window.__memberPay = {
    init: function(e) {
        this.userInfo = e;
        this._initDom();
        this._initEvent()
    },
    _isLogin: function() {
        if (typeof this.userInfo == "undefined") {
            return false
        }
        return true
    },
    _isVip: function() {
        return this.userInfo["vip"]
    },
    _initDom: function() {
        var e = '<div id="appTip" class="charges">' + '<div class="crs">' + '<div class="crs-info">此视频为会员影片，请进入乐视视频，加入VIP会员后观看。</div>' + '<div class="crs-select">' + '<a class="openLink" href="javascript:;" k-name="send-sum-stat" data-sum-stat="sumtmp;pvipdk">打开乐视视频</a>' + '<a class="downloadLink" href="http://app.m.letv.com/download.php?" k-name="send-sum-stat" data-sum-stat="sumtmp;pvipxz">下载乐视视频</a>' + '<a href="javascript:;" id="login">会员登录</a>' + "</div>" + "</div>" + '<div class="crs new" style="display:none;">' + '<div class="crs-info">此视频为会员影片，请进入乐视视频，加入VIP会员后观看。</div>' + '<div class="crs-select">' + '<a href="javascript:;" id="watch">已是会员立即观看</a>' + '<a class="openLink" href="javascript:;" k-name="send-sum-stat" data-sum-stat="sumtmp;pvipdk">重新打开乐视视频</a>' + '<a class="downloadLink" href="http://app.m.letv.com/download.php?" k-name="send-sum-stat" data-sum-stat="sumtmp;pvipxz">下载乐视视频</a>' + "</div>" + "</div>" + "</div>";
        document.getElementById("j-player").innerHTML = e;
        this._appTip = document.getElementById("appTip");
        this._appTip.style.display = "block";
        this._openLink = document.getElementsByClassName("openLink");
        this._loginLink = document.getElementById("login");
        this._watchLink = document.getElementById("watch");
        this._tip = document.getElementsByClassName("crs");
        if (this._isLogin()) {
            document.getElementById("login").style.display = "none";
            if (window.location.href.indexOf("#isLogin") > 0) {
                this._show();
                __memberPay._tip[1].getElementsByTagName("div")[0].innerHTML = "抱歉，您还不是VIP会员请重新打开乐视视频购买VIP会员"
            }
        }
    },
    _initEvent: function() {
        for (var e = 0, t = this._openLink.length; e < t; e++) {
            this._openLink[e].addEventListener("click", this._open)
        }
        this._loginLink.addEventListener("click", this._login);
        this._watchLink.addEventListener("click", function() {
            if (!__memberPay._isLogin()) {
                window.location.href = "http://sso.letv.com/user/mloginHome?next_action=" + encodeURIComponent(window.location.href + "#isLogin")
            } else {
                __player.init()
            }
        })
    },
    _login: function(e) {
        e.preventDefault();
        window.location.href = "http://sso.letv.com/user/mloginHome?next_action=" + encodeURIComponent(window.location.href)
    },
    _open: function() {
        __memberPay._show();
        __openApp._bindDefaultAppEvent({
            type: "pay"
        })
    },
    _show: function() {
        this._tip[0].style.display = "none";
        this._tip[1].style.display = "block"
    }
};
window.__trylook = {
    init: function(e) {
        this.showTip = true;
        this.userInfo = e;
        this._initDom();
        this._initEvent()
    },
    _isLogin: function() {
        if (typeof this.userInfo == "undefined") {
            return false
        }
        return true
    },
    _isVip: function() {
        return this.userInfo["vip"]
    },
    _getTicketNum: function() {
        return this.userInfo["ticketsize"]
    },
    _initDom: function() {
        var e = document.getElementById("j-player"), t = document.getElementById("j-tryLook") || "", i;
        if (!t) {
            t = document.createElement("div");
            t.id = "j-tryLook";
            t.className = "look-play";
            document.body.insertBefore(t, e)
        }
        this.jTrylook = t;
        var a = document.getElementById("j-smart") || "";
        if (a)
            a.style.display = "none";
        var s = "<b>试看6分钟，观看全片请</b><em><a href='javascript:;' k-name='send-sum-stat' data-sum-stat='sumtmp;MZSKVIP' type='open'>开通会员</a></em>";
        if (this._isLogin() && this.userInfo.allowmonth == 2) {
            if (!this._isLogin()) {
                i = s + "<b>或直接</b><em><a href='javascript:;' type='login'>登录</a></em>"
            } else {
                i = s
            }
        } else if (!this._isLogin()) {
            i = s + "<b>或直接</b><em><a href='javascript:;' type='login'>登录</a></em>"
        } else if (this._getTicketNum() > 0) {
            i = "<b>观看全片将使用1张观影券</b><em><a href='javascript:;' type='useTicket'>点击使用</a></em>"
        } else if (this._isVip()) {
            i = "<b>观影券已用完，观看全片请到网页版购买影片</b>"
        } else {
            i = s
        }
        t.innerHTML = i;
        this.loginBtn = document.getElementById("loginBtn")
    },
    _initEvent: function() {
        var e = LTK.require("extend.lib");
        var t = e.bind(function(t) {
            if (!t.target)
                return;
            t.preventDefault();
            var i = t.target.getAttribute("type");
            switch (i) {
            case"login":
                if (!this._isLogin()) {
                    window.location.href = "http://sso.letv.com/user/mloginHome?next_action=" + encodeURIComponent(window.location.href)
                } else {
                    __player.init()
                }
                break;
            case"useTicket":
                if (this.IsClickTicket)
                    return;
                this.IsClickTicket = true;
                e.getJSON(this.userInfo.ticketurl + "&callback=?", e.bind(function(e) {
                    this.IsClickTicket = false;
                    if (e.status == 1) {
                        if (typeof mainPlayer != "undefined") {
                            this.jTrylook.style.display = "none";
                            window.info.trylook = 0;
                            mainPlayer.reload()
                        }
                    }
                }, this));
                break;
            case"open":
                window.location.href = "http://zhifu.letv.com/mz/tobuy/regular?fronturl=" + encodeURIComponent(window.location.href);
                break
            }
        }, this);
        this.jTrylook.addEventListener("click", t)
    },
    destroy: function() {
        var e = document.getElementById("j-tryLook");
        if (e) {
            e.parentNode.removeChild(e)
        }
    }
};
window.le = window.le || {};
le._cb_ = le._cb_ || {};
window.__player = {
    init: function() {
        var e = window.innerWidth, t = 181 / 320 * e, i = {
            mmsid: info.mmsid,
            callbackJs: "le._cb_._player",
            isPlayerAd: "0"
        };
        if (info.site) {
            i.typeFrom = info.site;
            i.sysFullScreen = true
        }
        window.__INFO__ = {
            video: info
        };
        this._params = ["j-player", {
            w: e,
            h: t
        }, {}, this._getParams(i), "", {
            pname: "MPlayer",
            forceH5: true,
            isAutoPlay: !info.unicom ? true: Object.prototype.toString.call(info.unicom) == "[object Array]" && (info.unicom[0] == 3 || info.unicom[0] == 5) ? false: true
        }
        ];
        le._cb_._player = this._callback;
        this._initPlayer()
    },
    _initPlayer: function() {
        window.mainPlayer = LELib.Revive.Player.apply(LELib.Revive, this._params)
    },
    _callback: function(e, t) {
        if (e == "PLAYER_VIDEO_COMPLETE" && info.nextUrl) {
            le.evt.pageEvent.fire({
                type: "nextVideo"
            })
        } else if (e == "MEMBER_PAY") {
            __memberPay.init(t)
        } else if (e == "TRYLOOK_TIP") {
            __trylook.init(t)
        } else if (e == "TRYLOOK_End") {
            __trylook.destroy()
        }
    },
    _getParams: function(e) {
        var t = [];
        for (var i in e) {
            t.push(i + "=" + e[i])
        }
        return t.join("&")
    }
};
