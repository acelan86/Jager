/**
 * jager 猎鸥 视频广告项目名字空间
 */
window.SATK.define('Jager.AdPlayer', function (require) {
    "use strict";

    var Event = require('SATK.Event'),
        array = require('SATK.array');

    // var linearMap = {
    //     'play' : 'pre-roll',
    //     'pause' : 'pause',
    //     'stop' : 'post-roll'
    // };

    // loadstart事件：浏览器开始请求媒介；

    // progress事件：浏览器正在获取媒介；

    // suspend事件：浏览器非主动获取媒介数据，但没有加载完整个媒介资源；

    // abort事件：浏览器在完全加载前中止获取媒介数据；

    // error事件：获取媒介数据出错；

    // emptied事件：媒介元素的网络状态突然变为未初始化；

    // stalled事件：浏览器获取媒介数据异常；

    // play事件：即将开始播放

    // pause事件：暂停播放

    // loadedmetadata事件：浏览器获取完媒介资源的时长和尺寸

    // loadeddata事件：已加载当前播放位置的媒介数据；

    // waiting事件：播放由于下一帧无效（例如未加载）而已停止（但浏览器确认下一帧会马上有效）；

    // playing事件：已经开始播放

    // canplay事件：浏览器能够开始媒介播放，但估计以当前速率播放不能直接将媒介播放完（播放期间需要缓冲）；

    // canplaythrough事件：浏览器估计以当前速率直接播放可以直接播放完整个媒介资源（期间不需要缓冲）；

    // seeking事件：浏览器正在请求数据（seeking属性值为true）；

    // seeked事件：浏览器停止请求数据（seeking属性值为false）；

    // timeupdate事件：当前播放位置（currentTime属性）改变；

    // ended事件：播放由于媒介结束而停止；

    // ratechange事件：默认播放速率（defaultPlaybackRate属性）改变或播放速率（playbackRate属性）改变；

    // durationchange事件：媒介时长（duration属性）改变；

    // volumechange事件：音量（volume属性）改变或静音（muted属性）。

    var eventList = 'loadstart,progress,suspend,abort,error,emptied,stalled,play,pause,loadedmetadata,loadeddata,waiting,playing,canplay,canplaythrough,seeking,seeked,timeupdate,ended,ratechange,durationchange,volumechange'.split(',');


    function AdPlayer(video) {
        //var options = opt_options || {};

        this.video = video;

        this.events = [
            "error",
            "play",
            "playing",
            "ended",
            "pause",
            "touchstart",
            "timeupdate"
        ];


        array.each(eventList, function (eventName) {
            Event.on(this.video, eventName, this.onVideoEvent);
        }, this);
    }

    AdPlayer.prototype = {
        playVideo : function () {
            //this.video.removeAttribute('src');
            this.video.play();
        },
        pauseVideo : function () {
            this.player.pause();
        },
        onVideoEvent: function(e) {
            var video = e.target,
                type = e.type;

            switch (type) {
                case "touchstart":
                    console.log(type);
                    break;
                case "timeupdate":
                    console.log(type, video.currentTime);
                    break;
                default:
                    console.log(type);
                    break;
            }
        //     switch (e.type) {
        //         case"play":
        //         case"playing":
        //             if (this.isAdInit)
        //                 this.callAD("AD_PLAY");
        //             if (this.delayPauseID)
        //                 clearTimeout(this.delayPauseID);
        //             if (!d.iPhone) {
        //                 this.bigPlay[0].style.display = "none";
        //                 this.poster[0].style.display = "none"
        //             }
        //             this.isADStarted = true;
        //             break;
        //         case"pause":
        //             if (this.playID)
        //                 clearTimeout(this.playID);
        //             if (this.delayPauseID)
        //                 clearTimeout(this.delayPauseID);
        //             this.delayPauseID = setTimeout(function() {
        //                 c.callAD("AD_PAUSE")
        //             }, 500);
        //             break;
        //         case"ended":
        //             this.callAD("AD_ENDED");
        //             this.playAD(++this.curIdx);
        //             break;
        //         case"touchstart":
        //             this.callAD("AD_CLICK");
        //             break;
        //         case"timeupdate":
        //             if (++this.timerCount < 2)
        //                 return;
        //             this.evt.off("timeupdate", this.onVideoEvent, this);
        //             break;
        //         case"error":
        //             this.callAD("AD_ERROR", {
        //                 error: this.video.error
        //             });
        //             this.pingback.sendError(l["ADURLNotSupport"]);
        //             this.playAD(++this.curIdx);
        //             break
        //     }
        }
    };

    return AdPlayer;
});