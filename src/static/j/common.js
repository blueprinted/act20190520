
/**
 * Created by xueyanjie on 2017/9/29.
 */

touchmove = false;
touchSupport=function(){return 'ontouchend' in document;}
function bindClick(selector, func, bubble) {
    if (!touchSupport()) {
        $(selector).on('click', function(){
            var self = $(this);
            func(self);
            if (!bubble) { return false; }
        });//鍝嶅簲浜嬩欢
    } else {
        $(selector).on('touchmove', function(){
            touchmove = true;
        }).on('touchend', function(){
            if (touchmove == true) { touchmove = false; return; }
            var self = $(this);
            func(self);//鍝嶅簲浜嬩欢
            if (!bubble) { return false; }
        });
    }
}


function bindClick(selector, func, params,bubble) {
    if (!touchSupport()) {
        $(selector).on('click', function(){
            var self = $(this);
            func(params,self);
            if (!bubble) { return false; }
        });//响应事件
    } else {
        $(selector).on('touchmove', function(){
            touchmove = true;
        }).on('touchend', function(){
            if (touchmove == true) { touchmove = false; return; }
            var self = $(this);
            func(params,self);//响应事件
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
    filllen = length - string.length % length;
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

function isLoaded(callback) {
    var callback = typeof callback == 'undefined' ? '' : callback;
    if(window.document.readyState == 'complete') {
        try{eval('callback()')} catch(e) {}
        return true;
    }
    setTimeout('isLoaded('+callback+')', 700);
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
//为了在模板后台跨域
if(window.location.host == "test.ac.sogou"){
    document.domain = "ac.sogou"
}




/**
 * Created by xueyanjie@sogou-inc.com on 2018/3/29.
 * F参数处理
 */

//----------------F参数相关------------------------

//获取url中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i'); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}
//向url中添加参数
function addUrlPara(name, value, currentUrl) {
    //var currentUrl = window.location.href.split('#')[0];
    currentUrl = currentUrl.split('#')[0];
    if (/\?/g.test(currentUrl)) {
        if (/name=[-\w]{4,25}/g.test(currentUrl)) {
            currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
        } else {
            currentUrl += "&" + name + "=" + value;
        }
    } else {
        currentUrl += "?" + name + "=" + value;
    }
    if (currentUrl.split('#')[1]) {
        currentUrl = currentUrl + '#' + currentUrl.split('#')[1];
    }
    return currentUrl;
}
//通用函数：处理F参数
function processParamF() {
    var val = getQueryString('f');
    if (!val) { return; }
    //获取页面所有的a标签并添加f参数
    $.each($('a'), function(index, elem) {
        var href = elem.href;
        if (href && href != '' && href != 'javascript:;') {
            href = addUrlPara('f', val, href);
            elem.href = href;
        }
    });
}

$(function(){
    processParamF();
});

  