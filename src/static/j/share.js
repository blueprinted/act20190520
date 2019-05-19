/**
 * Created by xueyanjie on 2017/12/8.
 */

//分享到微博
function shareSina() {
    var conf = getShareConf('sina');
    // var share_txt = encodeURIComponent(conf.title);
   //如果是数组
   if ($.isArray(conf.desc)) {
    randomIndex = parseInt(Math.random() * conf.desc.length);
    var share_txt = conf.title[randomIndex]+""+conf.desc[randomIndex];
} else {
    var share_txt = conf.title+""+conf.desc;
}

    var img = conf.imgUrl;
    var domain = conf.link+ '?ADTAG=sina';
    //console.log(domain);
    
    window.open('http://v.t.sina.com.cn/share/share.php?appkey=3137803546&title='+share_txt+'&url='+encodeURIComponent(domain)+'&pic='+img+'&searchPic=false');
    try{MtaH5.clickStat('sharewb');}catch(e){}//点击统计
}

//分享到qq空间
function shareQzone(){
    var conf = getShareConf('qzone');
    var title, desc;
    if ($.isArray(conf.title)) {
        randomIndex = parseInt(Math.random() * conf.title.length);
        title = conf.title[randomIndex];
    } else {
        title = conf.title;
    }
    if ($.isArray(conf.desc)) {
        desc = conf.desc[randomIndex];
    } else {
        desc = conf.desc;
    }
    var img = conf.imgUrl;
    var domain = conf.link+ '?ADTAG=qzone';

    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(domain)+'&pics='+encodeURIComponent(img)+'&title='+encodeURIComponent(title)+'&summary='+encodeURIComponent(desc),'_blank');
    try{MtaH5.clickStat('shareqzone');}catch(e){}
}

function initMeta() {
    var conf = getShareConf('default');
    if ($.isArray(conf.title)) {
        randomIndex = parseInt(Math.random() * conf.title.length);
        title = conf.title[randomIndex];
    } else {
        title = conf.title;
    }
    if ($.isArray(conf.desc)) {
        desc = conf.desc[randomIndex];
    } else {
        desc = conf.desc;
    }

    var metaStr = '' +
        '<meta property="og:type" content="' + title + '" />' +
        '<meta property="og:title" content="' + title + '" />' +
        '<meta name="keywords" content="' + title + '" />' +
        '<meta itemprop="name" content="' + title + '"/>' +
        '<meta name="description" itemprop="description" content="' + desc + '" />' +
        '<meta desc="' + desc + '" />' +
        '<meta name="desc" content="' + desc + '" />' +

        '<meta summary="' + desc + '" />' +
        '<meta name="summary" content="' + desc + '" />' +
        '<meta content="' + desc + '" />' +
        '<meta itemprop="image" content="' + conf.imgUrl + '" />' +
        '<meta property="og:description" content="' + desc + '" />' +
        '<meta property="og:image" content="' + conf.imgUrl + '" />' +
        '<meta property="og:url" content="' + conf.link + '" />' +
        '<meta name="sharecontent" data-msg-img="' + conf.imgUrl + '" data-msg-title="' + title + '" data-msg-content="' + desc + '" />'
    $("head").append(metaStr);
}

function bindWxShare() {
    // console.log("bindWxShare");
    if (!isWeiXin() || window['wxconfig'] == undefined) { return; }
    try {
        var dataForShare = getShareConf('weixin');
        var title,desc;
        if ($.isArray(dataForShare.title)) {
            randomIndex = parseInt(Math.random() * dataForShare.title.length);
            title = dataForShare.title[randomIndex];
        } else {
            title = dataForShare.title;
        }
        if ($.isArray(dataForShare.desc)) {
            desc = dataForShare.desc[randomIndex];
        } else {
            desc = dataForShare.desc;
        }

        var link = dataForShare.link;
        var imgUrl = dataForShare.imgUrl;

        wx.onMenuShareTimeline({
            title: title,
            link: link + '?ADTAG=wechat_pyq',
            imgUrl: imgUrl,
            success: function (res) {
                try{MtaH5.clickStat('pyq_succ')}catch(e){}
            },
            cancel: function (res) {
                try{MtaH5.clickStat('pyq_cancel')}catch(e){}
            },
            fail: function (res) {
                try{MtaH5.clickStat('pyq_fail')}catch(e){}
            }
        });
        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            // link: link + '?ADTAG=wechat_friends',
            link: link,
            imgUrl: imgUrl,
            success: function (res) {
                try{MtaH5.clickStat('wxmsg_succ')}catch(e){}
            },
            cancel: function (res) {
                try{MtaH5.clickStat('wxmsg_cancel')}catch(e){}
            },
            fail: function (res) {
                try{MtaH5.clickStat('wx_msg_fail')}catch(e){}
            }
        });
        wx.onMenuShareQQ({
            title: title,
            desc: desc,
            link: link + '?ADTAG=wechat_qq',
            imgUrl: imgUrl,
            success: function (res) {
                try{MtaH5.clickStat('wx_qq_succ')}catch(e){}
            },
            cancel: function (res) {
                try{MtaH5.clickStat('wx_qq_cancel')}catch(e){}
            },
            fail: function (res) {
                try{MtaH5.clickStat('wx_qq_fail')}catch(e){}
            }
        });
        wx.onMenuShareWeibo({
            title: title,
            desc: desc,
            link: link + '?ADTAG=wechat_sina',
            imgUrl: imgUrl,
            success: function (res) {
                try{MtaH5.clickStat('wx_wb_succ')}catch(e){}
            },
            cancel: function (res) {
                try{MtaH5.clickStat('wx_wb_cancel')}catch(e){}
            },
            fail: function (res) {
                try{MtaH5.clickStat('wx_wb_fail')}catch(e){}
            }
        });
        wx.onMenuShareQZone({
            title: title,
            desc: desc,
            link: link + '?ADTAG=wechat_qzone',
            imgUrl: imgUrl,
            success: function (res) {
                try{MtaH5.clickStat('wx_qz_succ')}catch(e){}
            },
            cancel: function (res) {
                try{MtaH5.clickStat('wx_qz_cancel')}catch(e){}
            },
            fail: function (res) {
                try{MtaH5.clickStat('wx_qz_fail')}catch(e){}
            }
        });
    } catch(e){}

}



//根据类型读取分享配置信息
function getShareConf(type) {
    if (!shareConf) { return false; }
    shareInfoDefault = false;
    shareInfo = false;
    $.each(shareConf, function(i,elem) {
        if (elem.type == 'default') { shareInfoDefault = elem; }
        else if (elem.type == type) { shareInfo = elem; }
    });
    if (shareInfo == false) { shareInfo = shareInfoDefault; }
    return shareInfo;
}

function callback_init() {
    initMeta();//初始meta信息
    /*普通浏览器分享按钮点击相关事件绑定*/
    bindClick('#btn_share', function(){
        try {
            MtaH5.clickStat("weixin_share")
        } catch (error) {
            
        }
        var ref = getUrlArg('ref');
        if (isWeiXin() || ref == 'sogou_ios') {
            $("#mask").removeClass("displaynone");
            $('#popup_wx').show();
        } //显示微信弹层
        else {
            $("#mask").removeClass("displaynone");
            $('#popup_share').show();
        }//显示详细分享按钮
    }, false);
    bindClick('#btn_share_sina', shareSina, false);
    bindClick('#btn_share_qzon', shareQzone, false);
    bindClick('#popup_wx', function(){$('#popup_wx').hide();}, false);

    /*微信分享初始化*/
    if(isWeiXin()) {
        appendscript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', '', function(){
            appendscript('http://shouji.sogou.com/api/weixin/jssdk/wxconfig.php?rurl='+encodeURIComponent(document.location.href), '', function(){
                var wxconfig = window['wxconfig'] || '';
                if(wxconfig) {
                    wx.config({
                        appId: wxconfig.appId,
                        timestamp: wxconfig.timestamp,
                        nonceStr: wxconfig.nonceStr,
                        signature: wxconfig.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });
                    wx.ready(function () {
                        //initShare();
                        // console.log("in ready...");
                        bindWxShare();
                    });
                }
            });
        });
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
//页面加载初始化
$(function(){
    isLoaded(function(){
        var timestamp=new Date().getTime();
        $.getJSON('static/j/share_config.js?v='+timestamp, function(data) {
            shareConf = data.data;
            // console.log("callbackinit");
            callback_init();
        }); //读取分享配置
    });
});