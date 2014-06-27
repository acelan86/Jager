/**
 * 数据代理，从引擎获取数据并格式化, 处理成可用格式
 */
window.SATK.define('Jager.proxy', function (require) {
    "use strict";

    var core = require('SATK.core'),
        storage = require('SATK.storage'),
        net = require('SATK.net'),
        Deferred = require('SATK.Deferred'),
        URL = require('SATK.URL'),
        config = require('Jager.config');
    
    /* 获取门户广告统一轮播数 */
    var seed = (function (key) {
        var value = parseInt(storage.get(key), 10) || core.rand(1, 100);
        //大于1000就从0开始，防止整数过大
        storage.set(key, value > 1000 ? 1 : ++value, {expires : 30 * 24 * 60 * 60 * 1000}); //默认一个月过期
        return value;
    })('sinaads_' + core.uid);

    var enterTime = core.now();

    return {
        seed : seed,
        request : function (pdps) {
            var deferred = new Deferred();
            var params = [
                'adunitid=' + pdps,                                 //pdps数组
                'rotate_count=' + seed,                             //轮播数，批量加载使用普通rotator
                'TIMESTAMP=' + enterTime.toString(36),              //时间戳
                'referral=' + encodeURIComponent(URL.top)           //当前页面url
            ];
            net.jsonp(config.SAX_URL + params.join('&'), function (data) {
                deferred.resolve(data);
            });
            return deferred;
        }
    };
});