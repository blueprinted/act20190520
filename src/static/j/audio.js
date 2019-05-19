function iAudio(options) {
    this.defaults = {
        attrs: {
            loop: false,
            preload: 'auto',
            src: '',
            autoplay: false
        },
        _key: 0,
        playCallback: function () { },
        pauseCallback: function () { },
        loadedCallback: function () { }
    };
    this.options = $.extend(this.defaults, options || {}),/* initial params */
        this._audio = null,
        this._initialed = false,
        this._playing = false,
        this._loaded = false;
}
iAudio.prototype = {
    init: function () {
        var _self = this;
        try {
            _self._audio = new Audio;
        } catch (e) {
            return false;
        }

        this._audio.addEventListener('loadeddata', function () {
            _self._loaded = true;
            if (_self.options.attrs.autoplay && _self.options.attrs.preload == 'auto') {
                _self.play();
            }
            try {
                _self.options.loadedCallback(_self);
            } catch (e) {
                _self.log('loadedCallback fail !');
            }
        }, false);
        this._audio.addEventListener('play', function () {
            _self._playing = true;
            try {
                _self.options.playCallback(_self);
            } catch (e) {
                _self.log('playCallback fail !');
            }
        }, false);
        this._audio.addEventListener('pause', function () {
            _self._playing = false;
            try {
                _self.options.pauseCallback(_self);
            } catch (e) {
                _self.log('pauseCallback fail !');
            }
        }, false);
        this._audio.addEventListener('abort', function () {
            //alert('abort');
        }, false);
        this._audio.addEventListener('error', function () {
            //alert('error');
        }, false);
        for (var k in this.options.attrs) {
            if ((this.options.attrs).hasOwnProperty(k) && k in this._audio) {
                this._audio[k] = (this.options.attrs)[k];
            }
        }
        if (this.options.attrs.autoplay || this.options.attrs.preload == 'auto') {
            try { this._audio.load() } catch (e) { }
        }
        this._initialed = true;
        return true;
    },
    load: function () {
        this._audio.load();
    },
    toggle: function () {
        if (!this._playing) {
            this.play();
        } else {
            this.pause();
        }
    },
    play: function () {
        if (this._audio) this._audio.play();
    },
    pause: function () {
        if (this._audio) this._audio.pause();
    },
    stop: function () {
        if (this._audio) {
            this._audio.pause();
            try { this._audio.currentTime = 0 } catch (e) { }/*iphone4s safari 会出js错误*/
        }
    },
    log: function (msg) {
        if (console && console.log)
            console.log(msg);
    },
    run: function () {
        if (!this._initialed) {
            return this.init();
        } else {
            return this._audio == null ? false : true;
        }
    }
}


var audioer, audio_yes, audio_no, audio_done;
function callback_init_music(musicConf) {
    audioer = new iAudio({
        attrs: {
            loop: true,
            preload: 'auto',
            src: musicConf.bg_sound,
            autoplay: false
        },
        playCallback: function (o) {
            $('#btn_audio').removeClass("sound_icon_off").addClass('sound_icon_on');
        },
        pauseCallback: function (o) {
            $('#btn_audio').removeClass('sound_icon_on').addClass('sound_icon_off');
        }
    });
    // if (isIOS()) {
    //     audioer.run();
    // }

    // audio_yes = new iAudio({
    //     attrs: {
    //         loop: false,
    //         preload: 'auto',
    //         src: musicConf.yes_sound,
    //         autoplay: false,
    //     }
    // });
    // audio_yes.run();
    // audio_no = new iAudio({
    //     attrs: {
    //         loop: false,
    //         preload: 'auto',
    //         src: musicConf.no_sound,
    //         autoplay: false,
    //     }
    // });
    // audio_no.run();
    // audio_done = new iAudio({
    //     attrs: {
    //         loop: false,
    //         preload: 'auto',
    //         src: 'http://wap.dl.pinyin.sogou.com/wapdl/hole/201508/14/201508142045027712_done.mp3',
    //         autoplay: false,
    //     }
    // });
    // audio_done.run();


    audioer.run();
    audioer.play();

}


$('#btn_audio').on(touchSupport() ? 'touchend' : 'click', function (e) {
    e.preventDefault();
    audioer.toggle();

});


$('html').one(touchSupport() ? 'touchstart' : 'click', function () {
    audioer.play();
});

$(function () {
    var timestamp = new Date().getTime();
    $.getJSON('static/j/music_config.js?v=' + timestamp, function (data) {
        var musicConf = data;
        callback_init_music(musicConf);
    }); //读取分享配置
});

