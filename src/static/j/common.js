
/**
 *
 */
"use strict";
var touchmove = false;
var touchSupport = function(){return 'ontouchend' in document;}
function bindClick(selector, func, bubble) {
    if (!touchSupport()) {
        $(selector).on('click', function(){
            var self = $(this);
            func(self);
            if (!bubble) { return false; }
        }); // 响应事件
    } else {
        $(selector).on('touchmove', function(){
            touchmove = true;
        }).on('touchend', function(){
            if (touchmove == true) { touchmove = false; return; }
            var self = $(this);
            func(self); // 响应事件
            if (!bubble) { return false; }
        });
    }
}

var JSLOADED = [];/*javascript动态载入标识数组*/
var evalscripts = [];/*js相关*/

function $id(id) {
    return document.getElementById(id) ? document.getElementById(id) : null;
}

function $C(classname, ele, tag) {
    var returns = [];
    var ele = isUndefined(ele) ? '' : ele;
    ele = typeof ele == 'object' ? ele : (ele !== '' ? ($id(ele) ? $id(ele) : null) : document);
    if(!ele)
        return returns;
    tag = tag || '*';
    if(ele.getElementsByClassName) {
        var eles = ele.getElementsByClassName(classname);
        if(tag != '*') {
            for (var i = 0, L = eles.length; i < L; i++) {
                if (eles[i].tagName.toLowerCase() == tag.toLowerCase()) {
                    returns.push(eles[i]);
                }
            }
        } else {
            returns = eles;
        }
    } else {
        eles = ele.getElementsByTagName(tag);
        var pattern = new RegExp("(^|\\s)"+classname+"(\\s|$)");
        for (i = 0, L = eles.length; i < L; i++) {
            if (pattern.test(eles[i].className)) {
                returns.push(eles[i]);
            }
        }
    }
    return returns;
}

function isUndefined(val) {
    return typeof val == 'undefined' ? true : false;
}

function getFilename(filename) {
    return filename.substr(filename.lastIndexOf('/') + 1);
}

/**	功能 获取url参数值
 *	@param arg String 要获取的参数名
 *	@param url String url地址 可选,缺省为当前页面的地址
 *	@return String 要获取的参数值 参数不存在则为""
 */
function getUrlArg(arg, url){
    var arg = isUndefined(arg) ? '' : arg;
    var url = isUndefined(url) || url === '' ? document.location.href : url;
    if(url.indexOf('?') == -1 || arg == '')
        return '';
    url = url.substr(url.indexOf('?')+1);
    var expr = new RegExp('(\\w+)=(\\w+)','ig');
    var args = [];
    while((tmp = expr.exec(url)) != null){
        args[tmp[1]] = tmp[2];
    }
    return isUndefined(args[arg]) ? '' : args[arg];
}

function in_array(needle, haystack){
    if(typeof haystack == 'undefined')return false;
    if(typeof needle == 'string' || typeof needle == 'number'){
        for(var i in haystack){
            if(haystack[i] == needle){
                return true;
            }
        }
    }
    return false;
}

function trim(str) {
    return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function preg_replace(search, replace, str, regswitch) {
    var regswitch = !regswitch ? 'ig' : regswitch;
    var len = search.length;
    for(var i = 0; i < len; i++) {
        re = new RegExp(search[i], regswitch);
        str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
    }
    return str;
}

function isLoaded(callback) {
    var callback = typeof callback == 'undefined' ? function(){} : callback;
    if(window.document.readyState == 'complete') {
        if(typeof callback == 'function') {
            try{callback()}catch(e){}
        }
        return true;
    }
    setTimeout('isLoaded('+callback+')', 700);
}


function androidAppIsLogined() {
    return document.cookie.indexOf('account_login_state') !== -1 && document.cookie.substr(document.cookie.indexOf('account_login_state')+'account_login_state'.length+1,1) != '0';
}

function supportAndroidAppLogin() {
    return isAndroid() && typeof window['SogouHotwordsUtils'] != 'undefined' && window['SogouHotwordsUtils'].loginAccount;
}

function screen_mode() {
    var mode;
    if('orientation' in window) {
        if(window.orientation != 90 && window.orientation != -90) {
            mode = 1;
        } else {
            mode = 0;
        }
    } else {
        if($(window).width() < $(window).height()) {
            mode = 1;
        } else {
            mode = 0;
        }
    }
    return mode;
}

function getEvent() {
    if(document.all) return window.event;
    func = getEvent.caller;
    while(func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func=func.caller;
    }
    return null;
}

function doane(event, preventDefault, stopPropagation) {
    var preventDefault = isUndefined(preventDefault) ? 1 : preventDefault;
    var stopPropagation = isUndefined(stopPropagation) ? 1 : stopPropagation;
    e = event ? event : window.event;
    if(!e) {
        e = getEvent();
    }
    if(!e) {
        return null;
    }
    if(preventDefault) {
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    if(stopPropagation) {
        if(e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
    return e;
}

function hash(string, length) {
    var length = length ? length : 32;
    var start = 0;
    var i = 0;
    var result = '';
    var filllen = length - string.length % length;
    for(i = 0; i < filllen; i++){
        string += "0";
    }
    while(start < string.length) {
        result = stringxor(result, string.substr(start, length));
        start += length;
    }
    return result;
}

function stringxor(s1, s2) {
    var s = '';
    var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var max = Math.max(s1.length, s2.length);
    for(var i=0; i<max; i++) {
        var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        s += hash.charAt(k % 52);
    }
    return s;
}

/**  add javascript
 *  @param src String
 *  @param text String
 *	@param callback function
 *  @param reload Int 0/1
 *  @param targetid String possible value{htmlhead,htmlbody,...}
 *  @param charset String
 *  @return void
 */
function appendscript(src, text, callback, reload, targetid, charset) {
    var src = isUndefined(src) ? '' : src;
    var text = isUndefined(text) ? '' : text;
    var callback = isUndefined(callback) ? '' : callback;
    var targetid = (isUndefined(targetid) || targetid == '' || targetid == null) ? 'htmlhead' : targetid;
    var reload = isUndefined(reload) ? 0 : (parseInt(reload) == 1 ? 1 : 0);
    var charset = isUndefined(charset) ? '' : charset;
    var id = hash(src + text);
    if(!src && !text) return;
    if(targetid != 'htmlhead' && targetid != 'htmlbody' && !$id(targetid)) return;
    if(!reload && in_array(id, evalscripts)) return;
    if(reload && $id(id)) {
        $id(id).parentNode.removeChild($id(id));
    }

    evalscripts.push(id);
    var scriptNode = document.createElement("script");
    scriptNode.type = "text/javascript";
    scriptNode.id = id;
    scriptNode.charset = charset ? charset : '';
    try {
        if(src) {
            scriptNode.src = src;
            scriptNode.onloadDone = false;
            scriptNode.onload = function () {
                scriptNode.onloadDone = true;
                JSLOADED[src] = 1;
                if(callback)
                    try{eval('callback()')} catch(e) {}
            };
            scriptNode.onreadystatechange = function () {
                if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
                    scriptNode.onloadDone = true;
                    JSLOADED[src] = 1;
                    if(callback)
                        try{eval('callback()')} catch(e) {}
                }
            };
        } else if(text){
            scriptNode.text = text;
        }
        if(targetid == 'htmlhead') {
            document.getElementsByTagName('head')[0].appendChild(scriptNode);
        } else if(targetid == 'htmlbody') {
            document.getElementsByTagName('body')[0].appendChild(scriptNode);
        } else {
            $id(targetid).appendChild(scriptNode);
        }
    } catch(e) {}
}

function getSiteUrl() {
    var url = window.location.pathname.substr(0,1) == '/' ? window.location.pathname : ('/'+window.location.pathname);
    url = url.replace(/\/\w+\.[^\/]+/, '/');
    url = 'http://'+window.location.host + url;
    url += url.substr(url.length-1, 1) == '/' ? '' : '/';
    return url;
}

/* audio */
function iAudio(options) {
    this.defaults = {
        attrs: {
            loop: false,
            preload: 'auto',
            src: '',
            autoplay:true
        },
        _key: 0,
        initCallback: function(){},
        playCallback: function(){},
        pauseCallback: function(){},
        loadedCallback: function(){}
    };
    this.options = $.extend(this.defaults, options || {}),/* initial params */
        this._audio = null,
        this._initialed = false,
        this._playing = false,
        this._loaded = false;
    this.run();
}
iAudio.prototype = {
    init: function() {
        var _self = this;
        try {
            _self._audio = new Audio;
        } catch(e) {
            return false;
        }

        this._audio.addEventListener('loadeddata', function() {
            _self._loaded = true;
            if(_self.options.attrs.autoplay && _self.options.attrs.preload == 'auto') {
                _self.play();
            }
            try {
                _self.options.loadedCallback(_self);
            } catch(e) {
                _self.log('loadedCallback fail !');
            }
        }, false);
        this._audio.addEventListener('play', function() {
            _self._playing = true;
            try {
                _self.options.playCallback(_self);
            } catch(e) {
                _self.log('playCallback fail !');
            }
        }, false);
        this._audio.addEventListener('pause', function() {
            _self._playing = false;
            try {
                _self.options.pauseCallback(_self);
            } catch(e) {
                _self.log('pauseCallback fail !');
            }
        }, false);
        this._audio.addEventListener('abort', function() {
            //alert('abort');
        }, false);
        this._audio.addEventListener('error', function() {
            //alert('error');
        }, false);
        this._audio.addEventListener('ended', function() {
            try{_self._audio.currentTime = 0}catch(e){}
        }, false);
        for(var k in this.options.attrs) {
            if ((this.options.attrs).hasOwnProperty(k) && k in this._audio) {
                this._audio[k] = (this.options.attrs)[k];
            }
        }
        if(this.options.attrs.autoplay || this.options.attrs.preload == 'auto') {
            try{this._audio.load()}catch(e){}
        }
        try {
            _self.options.initCallback(_self);
        } catch(e) {
            _self.log('initCallback fail !');
        }
        this._initialed = true;
        return true;
    },
    load: function() {
        this._audio.load();
    },
    toggle: function() {
        if (!this._playing) {
            this.play();
        } else {
            this.pause();
        }
    },
    play: function() {
        if (this._audio) this._audio.play();
    },
    pause: function() {
        if (this._audio) this._audio.pause();
    },
    stop: function() {
        if (this._audio) {
            this._audio.pause();
            try{this._audio.currentTime = 0}catch(e){}/*iphone4s safari js error*/
        }
    },
    log: function(msg) {
        if(console && console.log)
            console.log(msg);
    },
    run: function() {
        if(!this._initialed) {
            return this.init();
        } else {
            return this._audio == null ? false : true;
        }
    }
}

function getUserAgent() {
    var agent;
    
    try {
        if(window.parent.setUserAgent){
            agent = window.parent.setUserAgent
        }else{
            agent = navigator.userAgent
        }
    } catch (error) {
        agent = navigator.userAgent
    }
    return agent;
}

function isWeiXin() {
    if (getUserAgent().toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    }
    return false;
}

function isQQ() {
    return /qq\s*\//i.test(getUserAgent());
}

function isIOS() {
    return (/(iphone|ipad|ios)/i).test(getUserAgent());
}

function isAndroid() {
    return /android[\/\s]+([\d\.]+)/i.test(getUserAgent())
}

function isPC() {
    if ((getUserAgent().toLowerCase().indexOf('mac') > -1 || getUserAgent().toLowerCase().indexOf('windows') > -1) && (!isIOS()) ){
        return true;
    }
}

/**	倒计时
 *	@param endtime	String/Integer 结束时间 如:2014-04-02 11:00:00 或 1396407600
 *	@param starttime String/Integer 开始时间 如:2014-04-01 11:00:00 或 1396321200
 *	@param recall Object(function)/null/String 结束回调
 *	@param update Object(function)/null/String 更新回调
 *	@dayid	显示day元素id String
 *	@hourid 显示hour元素id String
 *	@minid 显示minute元素id String
 *	@secid	显示second元素id String
 *	@return void
 */
function jsClocker(options) {
	this.defaults = {
		endtime: 10,
		starttime: 0,
		recall: function(){},
		update: function(df, total){},
		dayid: 'day',
		hourid: 'hour',
		minid: 'min',
		secid: 'sec',
		onlySec: true,
		autoRun: false
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
	this.starttime;
	this.endtime;
	this.timeleft;
	this.timer;/*计时器*/
	this.timediff;
	this.fp = 5;
	this.paused = !0;
	this.done = !0;
	this.counter = 0;/*计数器*/
	this.inc = 0;
	this.init();
}
jsClocker.prototype = {
	init: function() {
		this.endtime = /^\d+$/.test(this.options.endtime) ? parseInt(this.options.endtime) : strtotime(this.options.endtime.toString());
		this.starttime = /^\d+$/.test(this.options.starttime) ? parseInt(this.options.starttime) : strtotime(this.options.starttime.toString());
		this.timeleft = this.timediff = this.endtime - this.starttime;
		if(this.autoRun && this.timediff > 0)
			this.run();
	},
	run: function() {
		var _self = this;
		if(_self.timediff < 1 || _self.timer)
			return;
		_self.paused = !1;
		_self.done = !1;
		var timer = function(td) {
			if(_self.options.onlySec) {
				var sec = td;
			} else {
				var day = parseInt(td/86400);
				var hour = parseInt((td%86400)/3600);
				var min = parseInt((td%3600)/60);
				var sec = td%60;
				if($id(_self.options.dayid))
					$id(_self.options.dayid).innerHTML = day;
				if($id(_self.options.hourid))
					$id(_self.options.hourid).innerHTML = hour;
				if($id(_self.options.minid))
					$id(_self.options.minid).innerHTML = min;
			}
			if($id(_self.options.secid))
				$id(_self.options.secid).innerHTML = sec;
			if(td > 0) {
				_self.timeleft = td;
				_self.counter++;
				if(_self.counter % _self.fp == 0) {
					_self.counter = 0;
					td = td - 1;
				}
				_self.timer = setTimeout(function(){
					try{clearTimeout(_self.timer)}catch(e){}
					if(typeof _self.options.update == 'function') {_self.options.update(td, _self.timediff)}
					timer(td);
				}, 1000/_self.fp);
			} else {
				_self.timeleft = 0;
				_self.timer = null;
				_self.counter = 0;
				_self.done = !0;
				if(typeof _self.options.update == 'function') {_self.options.update(td, _self.timediff)}
				if(typeof _self.options.recall == 'function') {_self.options.recall(_self)}
			}
		}
		timer(_self.timeleft);
	},
	stop: function() {
		this.pause();
		this.timeleft = this.timediff;
		this.done = !0;
	},
	doned: function() {
		return this.done;
	},
	pause: function() {
		try{clearTimeout(this.timer);this.timer=null;this.counter=0}catch(e){}
		this.paused = !0;
	},
	adjust: function(sec) {/*倒计时微调*/
		this.pause();
		this.timeleft += sec;
		if(this.timeleft <= 0) {
			this.timeleft = 0;
		}
		if(sec > 0) {
			this.timediff += sec;
		}
		this.run();
	},
	info: function() {
		return {
			starttime: this.options.starttime,
			endtime: this.endtime,
			starttime2: this.starttime,
			endtime2: this.endtime,
			timediff: this.timediff,
			timeleft: this.timeleft,
			timer: this.timer,
			counter: this.counter,
			paused: this.paused
		}
	}
}

function jsToast(options) {
	this.options = options || {};
	this.timer;
	this.inited = !1;
	this.queue = [];
  this.queueLock = false;
  this.init();
}
jsToast.prototype = {
	init: function() {
		var defaults = {
      mode: 0, //0 队列模式 1:单一模式
			prefixTitle: '',
			duration: 1.25,
			elemId: 'js-toast',
            elemClass: 'js-toast'
		};
		this.options = $.extend(false, {}, defaults, this.options);/* initial params */
		this.inited = !0;
	},
  queueAdd: function (msg, duration) {
    var self = this;
    self.queue.push({msg:msg, duration:duration});
    return self;
  },
  render: function(msg) {
      var selector = '#'+this.options.elemId;
      $(selector).remove();
      var jstoast = '<div id="'+this.options.elemId+'" class="'+this.options.elemClass+'">'+(this.options.prefixTitle+msg)+'</div>';
    	$('body').append(jstoast);
      $(selector).css({
        position: 'fixed',
        bottom: '32px',
		display: 'none'
      });
      setTimeout(function(){$(selector).css({left:($(window).width()-$(selector).width())/2+'px',display:'block'})}, 0);
  },
	show: function(msg, duration) {
    var self = this;
    var msg = typeof msg == 'undefined' ? '' : msg;
    var duration = typeof duration == 'undefined' ?  this.options.duration : parseFloat(duration);
    if (self.options.mode > 0 && ((self.queue).length > 0 || self.queueLock)) {
      return;
    }
    this.queueAdd(msg, duration);
    this.queueExec();
	},
  hide: function() {
      $('#'+this.options.elemId).remove();
  },
  queueExec: function() {
    var self = this;
    if (self.queueLock) {
        return false;
    }
    self.queueLock = true;
    var args = self.queue.shift();
    if (args) {
        self.render(args.msg);
        setTimeout(function(){
            self.queueLock = false;
            self.queueExec();
        }, args.duration*1000);
    } else {
        self.hide();
        this.queueLock = false;
    }
  }
}

;(function($){
    $(function(){
        'use strict';
        var defaultHandle = {
        timeout: 0,
        dataType: 'json',
        confirm: {
            noConfirm: true,
            title: '确定要执行该操作吗？',
            cancelFunc: function(){}
        },
        formCheck: function() {},
        beforeSerialize: function(form, options){},
        beforeSubmit: function(arr, form, options){},
        success: function(resp, jqXHR, textStatus){},
        error: function(jqXHR, textStatus, errorThrown){},
        complete: function(jqXHR, textStatus){}
    };
    $('form[ajaxform="true"]').each(function(){
        if(!$(this).data('action')) {
            $(this).data('action', $(this).attr('action'));
        }
    });
    $('form[ajaxform="true"][ajaxtype="ajaxform"]').each(function(){
        var _form = $(this);
        if(!$(_form).attr('id')) {
            $(_form).attr('id', 'ajaxform_'+hash((new Date().getTime()).toString(), 8));
        }
        var _formId = $(_form).attr('id');/*表单id*/
        var _submitBtn = $(_form).find('button[type="submit"]');/*提交按钮*/
        //检查表单的 ajaxFormHandle
        var ajaxFormHandle;
        try {
            ajaxFormHandle = eval('ajaxform_handle_'+_formId);
        }catch(e) {
            ajaxFormHandle = {}
        }
        ajaxFormHandle = $.extend(false, {}, defaultHandle, ajaxFormHandle);
        $(_form).ajaxForm({
            dataType: ajaxFormHandle.dataType,
            timeout: ajaxFormHandle.timeout,
            beforeSerialize:function(form, options){
                if(false === ajaxFormHandle.beforeSerialize(form, options)) {
                    return false;
                }
            },
            beforeSubmit: function(arr, form, options) {
                if (false === ajaxFormHandle.formCheck()) {
                    return false;
                }
                if(false === ajaxFormHandle.beforeSubmit(arr, form, options)) {
                    return false;
                }
                $(_submitBtn).attr('disabled', true);
            },
            complete: function(jqXHR, textStatus) {
                $(_form).attr('action',$(_form).data('action'));
                $(_submitBtn).attr('disabled', false);
                ajaxFormHandle.complete(jqXHR, textStatus);
            },
            success: function(resp, jqXHR, textStatus) {
                if ((ajaxFormHandle.dataType).toLowerCase() == 'json') {
                    try{resp = JSON.parse(resp)}catch(e){}
                    if(typeof resp != 'object' || Object.prototype.toString.call(resp).toLowerCase() != '[object object]') {
                        jsToaster.show('\u54cd\u5e94\u6570\u636e\u683c\u5f0f\u4e0d\u6b63\u786e');/*响应数据格式不正确*/
                        return false;
                    }
                }
                ajaxFormHandle.success(resp, jqXHR, textStatus);
            },
            error:function(jqXHR, textStatus, errorThrown) {
                ajaxFormHandle.error(jqXHR, textStatus, errorThrown);
            }
        });
        if ($(_form).attr('onsubmit') && /^\s*return\s+false\s*;\s*$/i.test($(_form).attr('onsubmit'))) {
            $(_form).removeAttr('onsubmit');
        }
    });
    $('form[ajaxform="true"][ajaxtype="ajaxsubmit"]').each(function(){
        var _form = $(this);
        if(!$(_form).attr('id')) {
            $(_form).attr('id', 'ajaxform_'+hash((new Date().getTime()).toString(), 8));
        }
        var _formId = $(_form).attr('id');/*表单id*/
        var _submitBtn = $(_form).find('button[type="submit"]');/*提交按钮*/
        //检查表单的 ajaxFormHandle
        var ajaxFormHandle;
        try {
            ajaxFormHandle = eval('ajaxform_handle_'+_formId);
        }catch(e) {
            ajaxFormHandle = {}
        }
        ajaxFormHandle = $.extend(false, {}, defaultHandle, ajaxFormHandle);
        $(_form).submit(function(e){
            e.preventDefault(); // prevent native submit
            var postform = function(options) {
                $(_form).ajaxSubmit({
                    dataType: options.dataType,
                    timeout: options.timeout,
                    beforeSerialize:function(form, options){
                        if(false === options.beforeSerialize(form, options)) {
                            return false;
                        }
                    },
                    beforeSubmit: function(arr, form, options) {
                        if(false === options.beforeSubmit(arr, form, options)) {
                            return false;
                        }
                        $(_submitBtn).attr('disabled', true);
                    },
                    complete: function(jqXHR, textStatus) {
                        $(_form).attr('action',$(_form).data('action'));
                        $(_submitBtn).attr('disabled', false);
                        options.complete(jqXHR, textStatus);
                    },
                    success: function(resp, jqXHR, textStatus) {
                        if ((ajaxFormHandle.dataType).toLowerCase() == 'json') {
                            try{resp = JSON.parse(resp)}catch(e){}
                            if(typeof resp != 'object' || Object.prototype.toString.call(resp).toLowerCase() != '[object object]') {
                                jsToaster.show('\u54cd\u5e94\u6570\u636e\u683c\u5f0f\u4e0d\u6b63\u786e');/* 响应数据格式不正确 */
                                return false;
                            }
                        }
                        options.success(resp, jqXHR, textStatus);
                    },
                    error:function(jqXHR, textStatus, errorThrown) {
                        options.error(jqXHR, textStatus, errorThrown);
                    }
                });
            };
            if($(_submitBtn).attr('disabled')) {
                jsToaster.show('\u8bf7\u7b49\u5f85\u5f53\u524d\u64cd\u4f5c\u6267\u884c\u5b8c\u6bd5');/* 请等待当前操作执行完毕 */
                return false;
            }
            if (false === ajaxFormHandle.formCheck()) {
                return false;
            }
            if(ajaxFormHandle.confirm.noConfirm) {
                postform(ajaxFormHandle);
            } else {
                showConfirm(ajaxFormHandle.confirm, function(){
                    postform(ajaxFormHandle);
                }, function(){ajaxFormHandle.confirm.cancelFunc()});
            }
            return false;
        });
    });
});
})(jQuery);

/*

  Basic GUI blocking jpeg encoder ported to JavaScript and optimized by
  Andreas Ritter, www.bytestrom.eu, 11/2009.

  Example usage is given at the bottom of this file.

  ---------

  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

  * Neither the name of Adobe Systems Incorporated nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function JPEGEncoder(quality) {
    var self = this;
    var fround = Math.round;
    var ffloor = Math.floor;
    var YTable = new Array(64);
    var UVTable = new Array(64);
    var fdtbl_Y = new Array(64);
    var fdtbl_UV = new Array(64);
    var YDC_HT;
    var UVDC_HT;
    var YAC_HT;
    var UVAC_HT;

    var bitcode = new Array(65535);
    var category = new Array(65535);
    var outputfDCTQuant = new Array(64);
    var DU = new Array(64);
    var byteout = [];
    var bytenew = 0;
    var bytepos = 7;

    var YDU = new Array(64);
    var UDU = new Array(64);
    var VDU = new Array(64);
    var clt = new Array(256);
    var RGB_YUV_TABLE = new Array(2048);
    var currentQuality;

    var ZigZag = [
            0, 1, 5, 6,14,15,27,28,
            2, 4, 7,13,16,26,29,42,
            3, 8,12,17,25,30,41,43,
            9,11,18,24,31,40,44,53,
            10,19,23,32,39,45,52,54,
            20,22,33,38,46,51,55,60,
            21,34,37,47,50,56,59,61,
            35,36,48,49,57,58,62,63
        ];

    var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
    var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
    var std_ac_luminance_values = [
            0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
            0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
            0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
            0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
            0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
            0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
            0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
            0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
            0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
            0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
            0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
            0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
            0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
            0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
            0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
            0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
            0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
            0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
            0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
            0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
            0xf9,0xfa
        ];

    var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
    var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
    var std_ac_chrominance_values = [
            0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
            0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
            0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
            0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
            0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
            0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
            0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
            0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
            0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
            0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
            0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
            0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
            0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
            0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
            0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
            0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
            0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
            0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
            0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
            0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
            0xf9,0xfa
        ];

    function initQuantTables(sf){
            var YQT = [
                16, 11, 10, 16, 24, 40, 51, 61,
                12, 12, 14, 19, 26, 58, 60, 55,
                14, 13, 16, 24, 40, 57, 69, 56,
                14, 17, 22, 29, 51, 87, 80, 62,
                18, 22, 37, 56, 68,109,103, 77,
                24, 35, 55, 64, 81,104,113, 92,
                49, 64, 78, 87,103,121,120,101,
                72, 92, 95, 98,112,100,103, 99
            ];

            for (var i = 0; i < 64; i++) {
                var t = ffloor((YQT[i]*sf+50)/100);
                if (t < 1) {
                    t = 1;
                } else if (t > 255) {
                    t = 255;
                }
                YTable[ZigZag[i]] = t;
            }
            var UVQT = [
                17, 18, 24, 47, 99, 99, 99, 99,
                18, 21, 26, 66, 99, 99, 99, 99,
                24, 26, 56, 99, 99, 99, 99, 99,
                47, 66, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99
            ];
            for (var j = 0; j < 64; j++) {
                var u = ffloor((UVQT[j]*sf+50)/100);
                if (u < 1) {
                    u = 1;
                } else if (u > 255) {
                    u = 255;
                }
                UVTable[ZigZag[j]] = u;
            }
            var aasf = [
                1.0, 1.387039845, 1.306562965, 1.175875602,
                1.0, 0.785694958, 0.541196100, 0.275899379
            ];
            var k = 0;
            for (var row = 0; row < 8; row++)
            {
                for (var col = 0; col < 8; col++)
                {
                    fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                    fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                    k++;
                }
            }
        }

        function computeHuffmanTbl(nrcodes, std_table){
            var codevalue = 0;
            var pos_in_table = 0;
            var HT = new Array();
            for (var k = 1; k <= 16; k++) {
                for (var j = 1; j <= nrcodes[k]; j++) {
                    HT[std_table[pos_in_table]] = [];
                    HT[std_table[pos_in_table]][0] = codevalue;
                    HT[std_table[pos_in_table]][1] = k;
                    pos_in_table++;
                    codevalue++;
                }
                codevalue*=2;
            }
            return HT;
        }

        function initHuffmanTbl()
        {
            YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
            UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
            YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
            UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
        }

        function initCategoryNumber()
        {
            var nrlower = 1;
            var nrupper = 2;
            for (var cat = 1; cat <= 15; cat++) {
                //Positive numbers
                for (var nr = nrlower; nr<nrupper; nr++) {
                    category[32767+nr] = cat;
                    bitcode[32767+nr] = [];
                    bitcode[32767+nr][1] = cat;
                    bitcode[32767+nr][0] = nr;
                }
                //Negative numbers
                for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
                    category[32767+nrneg] = cat;
                    bitcode[32767+nrneg] = [];
                    bitcode[32767+nrneg][1] = cat;
                    bitcode[32767+nrneg][0] = nrupper-1+nrneg;
                }
                nrlower <<= 1;
                nrupper <<= 1;
            }
        }

        function initRGBYUVTable() {
            for(var i = 0; i < 256;i++) {
                RGB_YUV_TABLE[i]              =  19595 * i;
                RGB_YUV_TABLE[(i+ 256)>>0]     =  38470 * i;
                RGB_YUV_TABLE[(i+ 512)>>0]     =   7471 * i + 0x8000;
                RGB_YUV_TABLE[(i+ 768)>>0]     = -11059 * i;
                RGB_YUV_TABLE[(i+1024)>>0]     = -21709 * i;
                RGB_YUV_TABLE[(i+1280)>>0]     =  32768 * i + 0x807FFF;
                RGB_YUV_TABLE[(i+1536)>>0]     = -27439 * i;
                RGB_YUV_TABLE[(i+1792)>>0]     = - 5329 * i;
            }
        }

        // IO functions
        function writeBits(bs)
        {
            var value = bs[0];
            var posval = bs[1]-1;
            while ( posval >= 0 ) {
                if (value & (1 << posval) ) {
                    bytenew |= (1 << bytepos);
                }
                posval--;
                bytepos--;
                if (bytepos < 0) {
                    if (bytenew == 0xFF) {
                        writeByte(0xFF);
                        writeByte(0);
                    }
                    else {
                        writeByte(bytenew);
                    }
                    bytepos=7;
                    bytenew=0;
                }
            }
        }

        function writeByte(value)
        {
            byteout.push(clt[value]); // write char directly instead of converting later
        }

        function writeWord(value)
        {
            writeByte((value>>8)&0xFF);
            writeByte((value   )&0xFF);
        }

        // DCT & quantization core
        function fDCTQuant(data, fdtbl)
        {
            var d0, d1, d2, d3, d4, d5, d6, d7;
            /* Pass 1: process rows. */
            var dataOff=0;
            var i;
            var I8 = 8;
            var I64 = 64;
            for (i=0; i<I8; ++i)
            {
                d0 = data[dataOff];
                d1 = data[dataOff+1];
                d2 = data[dataOff+2];
                d3 = data[dataOff+3];
                d4 = data[dataOff+4];
                d5 = data[dataOff+5];
                d6 = data[dataOff+6];
                d7 = data[dataOff+7];

                var tmp0 = d0 + d7;
                var tmp7 = d0 - d7;
                var tmp1 = d1 + d6;
                var tmp6 = d1 - d6;
                var tmp2 = d2 + d5;
                var tmp5 = d2 - d5;
                var tmp3 = d3 + d4;
                var tmp4 = d3 - d4;

                /* Even part */
                var tmp10 = tmp0 + tmp3;    /* phase 2 */
                var tmp13 = tmp0 - tmp3;
                var tmp11 = tmp1 + tmp2;
                var tmp12 = tmp1 - tmp2;

                data[dataOff] = tmp10 + tmp11; /* phase 3 */
                data[dataOff+4] = tmp10 - tmp11;

                var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
                data[dataOff+2] = tmp13 + z1; /* phase 5 */
                data[dataOff+6] = tmp13 - z1;

                /* Odd part */
                tmp10 = tmp4 + tmp5; /* phase 2 */
                tmp11 = tmp5 + tmp6;
                tmp12 = tmp6 + tmp7;

                /* The rotator is modified from fig 4-8 to avoid extra negations. */
                var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
                var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
                var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
                var z3 = tmp11 * 0.707106781; /* c4 */

                var z11 = tmp7 + z3;    /* phase 5 */
                var z13 = tmp7 - z3;

                data[dataOff+5] = z13 + z2;    /* phase 6 */
                data[dataOff+3] = z13 - z2;
                data[dataOff+1] = z11 + z4;
                data[dataOff+7] = z11 - z4;

                dataOff += 8; /* advance pointer to next row */
            }

            /* Pass 2: process columns. */
            dataOff = 0;
            for (i=0; i<I8; ++i)
            {
                d0 = data[dataOff];
                d1 = data[dataOff + 8];
                d2 = data[dataOff + 16];
                d3 = data[dataOff + 24];
                d4 = data[dataOff + 32];
                d5 = data[dataOff + 40];
                d6 = data[dataOff + 48];
                d7 = data[dataOff + 56];

                var tmp0p2 = d0 + d7;
                var tmp7p2 = d0 - d7;
                var tmp1p2 = d1 + d6;
                var tmp6p2 = d1 - d6;
                var tmp2p2 = d2 + d5;
                var tmp5p2 = d2 - d5;
                var tmp3p2 = d3 + d4;
                var tmp4p2 = d3 - d4;

                /* Even part */
                var tmp10p2 = tmp0p2 + tmp3p2;    /* phase 2 */
                var tmp13p2 = tmp0p2 - tmp3p2;
                var tmp11p2 = tmp1p2 + tmp2p2;
                var tmp12p2 = tmp1p2 - tmp2p2;

                data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
                data[dataOff+32] = tmp10p2 - tmp11p2;

                var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
                data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
                data[dataOff+48] = tmp13p2 - z1p2;

                /* Odd part */
                tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
                tmp11p2 = tmp5p2 + tmp6p2;
                tmp12p2 = tmp6p2 + tmp7p2;

                /* The rotator is modified from fig 4-8 to avoid extra negations. */
                var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
                var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
                var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
                var z3p2 = tmp11p2 * 0.707106781; /* c4 */
                var z11p2 = tmp7p2 + z3p2;    /* phase 5 */
                var z13p2 = tmp7p2 - z3p2;

                data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
                data[dataOff+24] = z13p2 - z2p2;
                data[dataOff+ 8] = z11p2 + z4p2;
                data[dataOff+56] = z11p2 - z4p2;

                dataOff++; /* advance pointer to next column */
            }

            // Quantize/descale the coefficients
            var fDCTQuant;
            for (i=0; i<I64; ++i)
            {
                // Apply the quantization and scaling factor & Round to nearest integer
                fDCTQuant = data[i]*fdtbl[i];
                outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
                //outputfDCTQuant[i] = fround(fDCTQuant);

            }
            return outputfDCTQuant;
        }

        function writeAPP0()
        {
            writeWord(0xFFE0); // marker
            writeWord(16); // length
            writeByte(0x4A); // J
            writeByte(0x46); // F
            writeByte(0x49); // I
            writeByte(0x46); // F
            writeByte(0); // = "JFIF",'\0'
            writeByte(1); // versionhi
            writeByte(1); // versionlo
            writeByte(0); // xyunits
            writeWord(1); // xdensity
            writeWord(1); // ydensity
            writeByte(0); // thumbnwidth
            writeByte(0); // thumbnheight
        }

        function writeSOF0(width, height)
        {
            writeWord(0xFFC0); // marker
            writeWord(17);   // length, truecolor YUV JPG
            writeByte(8);    // precision
            writeWord(height);
            writeWord(width);
            writeByte(3);    // nrofcomponents
            writeByte(1);    // IdY
            writeByte(0x11); // HVY
            writeByte(0);    // QTY
            writeByte(2);    // IdU
            writeByte(0x11); // HVU
            writeByte(1);    // QTU
            writeByte(3);    // IdV
            writeByte(0x11); // HVV
            writeByte(1);    // QTV
        }

        function writeDQT()
        {
            writeWord(0xFFDB); // marker
            writeWord(132);       // length
            writeByte(0);
            for (var i=0; i<64; i++) {
                writeByte(YTable[i]);
            }
            writeByte(1);
            for (var j=0; j<64; j++) {
                writeByte(UVTable[j]);
            }
        }

        function writeDHT()
        {
            writeWord(0xFFC4); // marker
            writeWord(0x01A2); // length

            writeByte(0); // HTYDCinfo
            for (var i=0; i<16; i++) {
                writeByte(std_dc_luminance_nrcodes[i+1]);
            }
            for (var j=0; j<=11; j++) {
                writeByte(std_dc_luminance_values[j]);
            }

            writeByte(0x10); // HTYACinfo
            for (var k=0; k<16; k++) {
                writeByte(std_ac_luminance_nrcodes[k+1]);
            }
            for (var l=0; l<=161; l++) {
                writeByte(std_ac_luminance_values[l]);
            }

            writeByte(1); // HTUDCinfo
            for (var m=0; m<16; m++) {
                writeByte(std_dc_chrominance_nrcodes[m+1]);
            }
            for (var n=0; n<=11; n++) {
                writeByte(std_dc_chrominance_values[n]);
            }

            writeByte(0x11); // HTUACinfo
            for (var o=0; o<16; o++) {
                writeByte(std_ac_chrominance_nrcodes[o+1]);
            }
            for (var p=0; p<=161; p++) {
                writeByte(std_ac_chrominance_values[p]);
            }
        }

        function writeSOS()
        {
            writeWord(0xFFDA); // marker
            writeWord(12); // length
            writeByte(3); // nrofcomponents
            writeByte(1); // IdY
            writeByte(0); // HTY
            writeByte(2); // IdU
            writeByte(0x11); // HTU
            writeByte(3); // IdV
            writeByte(0x11); // HTV
            writeByte(0); // Ss
            writeByte(0x3f); // Se
            writeByte(0); // Bf
        }

        function processDU(CDU, fdtbl, DC, HTDC, HTAC){
            var EOB = HTAC[0x00];
            var M16zeroes = HTAC[0xF0];
            var pos;
            var I16 = 16;
            var I63 = 63;
            var I64 = 64;
            var DU_DCT = fDCTQuant(CDU, fdtbl);
            //ZigZag reorder
            for (var j=0;j<I64;++j) {
                DU[ZigZag[j]]=DU_DCT[j];
            }
            var Diff = DU[0] - DC; DC = DU[0];
            //Encode DC
            if (Diff==0) {
                writeBits(HTDC[0]); // Diff might be 0
            } else {
                pos = 32767+Diff;
                writeBits(HTDC[category[pos]]);
                writeBits(bitcode[pos]);
            }
            //Encode ACs
            var end0pos = 63; // was const... which is crazy
            for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
            //end0pos = first element in reverse order !=0
            if ( end0pos == 0) {
                writeBits(EOB);
                return DC;
            }
            var i = 1;
            var lng;
            while ( i <= end0pos ) {
                var startpos = i;
                for (; (DU[i]==0) && (i<=end0pos); ++i) {}
                var nrzeroes = i-startpos;
                if ( nrzeroes >= I16 ) {
                    lng = nrzeroes>>4;
                    for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
                        writeBits(M16zeroes);
                    nrzeroes = nrzeroes&0xF;
                }
                pos = 32767+DU[i];
                writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
                writeBits(bitcode[pos]);
                i++;
            }
            if ( end0pos != I63 ) {
                writeBits(EOB);
            }
            return DC;
        }

        function initCharLookupTable(){
            var sfcc = String.fromCharCode;
            for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
                clt[i] = sfcc(i);
            }
        }

        this.encode = function(image,quality,toRaw) // image data object
        {
            var time_start = new Date().getTime();

            if(quality) setQuality(quality);

            // Initialize bit writer
            byteout = new Array();
            bytenew=0;
            bytepos=7;

            // Add JPEG headers
            writeWord(0xFFD8); // SOI
            writeAPP0();
            writeDQT();
            writeSOF0(image.width,image.height);
            writeDHT();
            writeSOS();

            // Encode 8x8 macroblocks
            var DCY=0;
            var DCU=0;
            var DCV=0;

            bytenew=0;
            bytepos=7;

            this.encode.displayName = "_encode_";

            var imageData = image.data;
            var width = image.width;
            var height = image.height;

            var quadWidth = width*4;
            var tripleWidth = width*3;

            var x, y = 0;
            var r, g, b;
            var start,p, col,row,pos;
            while(y < height){
                x = 0;
                while(x < quadWidth){
                start = quadWidth * y + x;
                p = start;
                col = -1;
                row = 0;

                for(pos=0; pos < 64; pos++){
                    row = pos >> 3;// /8
                    col = ( pos & 7 ) * 4; // %8
                    p = start + ( row * quadWidth ) + col;

                    if(y+row >= height){ // padding bottom
                        p-= (quadWidth*(y+1+row-height));
                    }

                    if(x+col >= quadWidth){ // padding right
                        p-= ((x+col) - quadWidth +4)
                    }

                    r = imageData[ p++ ];
                    g = imageData[ p++ ];
                    b = imageData[ p++ ];

                    /* // calculate YUV values dynamically
                    YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                    UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                    VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                    */

                    // use lookup table (slightly faster)
                    YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
                    UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
                    VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;

                }

                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                x+=32;
                }
                y+=8;
            }

            ////////////////////////////////////////////////////////////////

            // Do the bit alignment of the EOI marker
            if ( bytepos >= 0 ) {
                var fillbits = [];
                fillbits[1] = bytepos+1;
                fillbits[0] = (1<<(bytepos+1))-1;
                writeBits(fillbits);
            }

            writeWord(0xFFD9); //EOI

            if(toRaw) {
                var len = byteout.length;
                var data = new Uint8Array(len);

                for (var i=0; i<len; i++ ) {
                    data[i] = byteout[i].charCodeAt();
                }

                //cleanup
                byteout = [];

                // benchmarking
                var duration = new Date().getTime() - time_start;
                console.log('Encoding time: '+ duration + 'ms');

                return data;
            }

            var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

            byteout = [];

            // benchmarking
            var duration = new Date().getTime() - time_start;
            console.log('Encoding time: '+ duration + 'ms');

            return jpegDataUri
    }

    function setQuality(quality){
        if (quality <= 0) {
            quality = 1;
        }
        if (quality > 100) {
            quality = 100;
        }

        if(currentQuality == quality) return // don't recalc if unchanged

        var sf = 0;
        if (quality < 50) {
            sf = Math.floor(5000 / quality);
        } else {
            sf = Math.floor(200 - quality*2);
        }

        initQuantTables(sf);
        currentQuality = quality;
        console.log('Quality set to: '+quality +'%');
    }

    function init(){
        var time_start = new Date().getTime();
        if(!quality) quality = 50;
        // Create tables
        initCharLookupTable()
        initHuffmanTbl();
        initCategoryNumber();
        initRGBYUVTable();

        setQuality(quality);
        var duration = new Date().getTime() - time_start;
        console.log('Initialization '+ duration + 'ms');
    }
    init();
};
