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