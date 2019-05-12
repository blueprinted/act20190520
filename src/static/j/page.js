'use strict';
var useCdnUrl = true;
var useLazyload = true;
;(function($){
$(function(){
    $.fn.longPress = function (fn) {
    　　var timer = null;
    　　var $this = this;
    　　for (var i = 0; i < $this.length; i++) {
        　　$this[i].addEventListener('touchstart', function (e) {
                e.stopPropagation();
        　　	timer = setTimeout(fn, 600);
        　　}, false);
        　　$this[i].addEventListener('touchend', function (e) {
                e.stopPropagation();
        　　	 clearTimeout(timer);
        　　}, false);
    　　}
    }
    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
});
})(jQuery);
/*server-sent event*/
function esource(options) {
	this.options = options || {};
	this.url;
	this.esObj;
	this.inited = !1;
	this.init();
}
esource.prototype = {
	init: function() {
		var defaults = {
			url: '',
			openCallback: function(event,esObj){},
			messageCallback: function(event,esObj){},
			errorCallback: function(event,esObj){},
			eventCallbackList: {},
			autorun: false,
		};
		this.options = $.extend(defaults, this.options);/* initial params */
		this.url = this.options.url;
		if(this.options.autorun) {
			this.run();
		}
		this.inited = !0;
		return !0;
	},
	bindListen: function() {
		var _this = this;
		this.esObj.addEventListener('open', function(e) {
			_this.options.openCallback(e,_this);
		},false);
		this.esObj.addEventListener('message', function(e) {
			_this.options.messageCallback(e,_this);
		},false);
		this.esObj.addEventListener('error', function(e) {
			_this.options.errorCallback(e,_this);
		},false);
		for(var event in this.options.eventCallbackList) {
			this.esObj.addEventListener(event, function(e) {
				_this.options.eventCallbackList[event](e,_this);
			},false);
		}
	},
	run: function() {
		if(this.esObj === null || typeof this.esObj !== 'object') {
			this.esObj = new EventSource(this.url);
			this.bindListen();
		}
		return !0;
	},
	unset: function() {
		this.close();
		this.esObj = null;
		this.inited = !1;
	},
	reset: function(options) {
		var options = options || {};
		this.unset();
		this.options = $.extend(this.options, options);
		this.url = this.options.url;
		if(this.options.autorun) {
			this.run();
		}
		this.inited = !0;
		return !0;
	},
	close: function() {
		if(typeof this.esObj) {
			this.esObj.close();
		}
		return !0;
	},
	info: function() {
		if(typeof console.log == 'function') {
			console.log(this.options,this.esObj);
		}
	}
}
function ajaxprocess(options) {
	var defaults = {
		type: 'get',
		url: '',
		data: '',
		dataType: 'json',
		success: function(resp) {
		},
		error: function() {
		},
		complete: function(){}
	};
	var options = $.extend(defaults, options);
	$.ajax({
		type: options.type,
		url: options.url,
		data: options.data,
		dataType: options.dataType,
		success: function(resp) {
			options.success(resp);
		},
		error: function() {
			options.error();
		},
		complete: function() {
			options.complete();
		}
	});
}
function hasFileAPISupport () {
    return !!(window.File && window.FileReader);
};
function initCateTab(cates, imgtpls, activeIdx) {
    var cates = cates || {};
    var imgtpls = imgtpls || {};
    var activeIdx = activeIdx || 0;
    $('#cateTabs').html(function(){
        var _htmlTags = '';
        var cid = 0, cate={};
        for (var i=0; i<catesOrder.length; i++) {
            cid = catesOrder[i];
            cate = cates[cid];
            if (!cate.id || $.isEmptyObject(cate)) {
            } else {
                _htmlTags += '<a href="javascript:void(0);" cateid="'+cate.id+'">'+cate.name_cn+'</a>';
            }
        }
        return _htmlTags;
    });
    $('#imgtplBox').html(function(){
        var _htmlTags = '';
        var cid = 0, cate={};
        for (var i=0; i<catesOrder.length; i++) {
            cid = catesOrder[i];
            cate = cates[cid];
            if (!cate.id || $.isEmptyObject(cate)) {
            } else {
                _htmlTags += '<ul class="listUl" linkcid="'+cate.id+'"></ul>';
            }
        }
        return _htmlTags;
    });
    $('#cateTabs').children().eq(activeIdx).addClass('on');
    $('#cateTabs').children().each(function(idx, ele){
        $(ele).click(function(e){
            $(this).addClass('on').siblings().removeClass('on');
            $('#imgtplBox').children().hide().eq(idx).show();
            $('#imgtplBox').scrollTop(-$('#imgtplBox').scrollTop());
            var activeCid = parseInt($('#cateTabs').children().eq(idx).attr('cateid'));
            var imgtplIds = cateImgMap[activeCid] || {};
            initImgtpl(imgtplIds, activeCid, 0);
            try{MtaH5.clickStat("tabclick_total")}catch(e){}
            try{MtaH5.clickStat("tabclick_id"+activeCid)}catch(e){}
        });
    });
    var activeCid = parseInt($('#cateTabs').children().eq(activeIdx).attr('cateid'));
    var imgtplIds = cateImgMap[activeCid] || {};
    initImgtpl(imgtplIds, activeCid, 0);
}
function initImgtpl(imgtplIds, cid, activeIdx) {
    var imgtplIds = imgtplIds || [];
    var cid = cid || 0;
    var activeIdx = typeof activeIdx == 'undefined' ? -1 : activeIdx;
    var selector = '#imgtplBox>.listUl[linkcid="'+cid+'"]';
    if ($(selector).size() > 0 && !$(selector).attr('inited')) {
        $(selector).html(function(){
            var _htmlTags = '';
            var length = imgtplIds.length;
            for(var idx = 0; idx < length; idx++) {
                var img = imgtpls[imgtplIds[idx]];
                if (!img.id || $.isEmptyObject(img)) {
                } else {
                    _htmlTags += '<li linkid="'+img.id+'">';
                    _htmlTags += '<div class="boxImg">';
                    var _imgSrc = '';
                    if (useCdnUrl) {
                        _imgSrc = img.picurl_small+jconfig.ver_string;
                    } else {
                        _imgSrc = 'data/'+img.path_small+jconfig.ver_string;
                    }
                    if (useLazyload) {
                        _htmlTags += '<img class="blurup lazyload" src="static/i/loading.gif" data-src="'+_imgSrc+'" />';
                    } else {
                        _htmlTags += '<img src="'+_imgSrc+'" onerror="this.src=\''+jconfig.noimg_src+'\';this.onerror=null;" />';
                    }
                    _htmlTags += '</div>';
                    _htmlTags += '</li>';
                }
            }
            return _htmlTags;
        });
        $(selector).attr('inited', true).children().click(function(){
            $(this).find('.boxImg>img').removeClass('blurup');
            $(this).addClass('on').siblings().removeClass('on');
            $(this).siblings().each(function(idx, ele){
                if ($(ele).find('.boxImg>img').hasClass('lazyloading')) {
                    $(ele).find('.boxImg>img').addClass('blurup');
                }
                if ($(ele).find('.boxImg>img').hasClass('lazyloaded')) {
                    $(ele).find('.boxImg>img').removeClass('blurup');
                }
            });
            var tplId = parseInt($(this).attr('linkid'));
            addImage2box(tplId);
            try{MtaH5.clickStat("templateclick_total")}catch(e){}
            try{MtaH5.clickStat("templateclick_id"+tplId)}catch(e){}
        });
    }
    if (activeIdx > -1) {
        $(selector).children().eq(activeIdx).find('.boxImg>img').removeClass('blurup');
        $(selector).children().eq(activeIdx).addClass('on').siblings().removeClass('on');
        addImage2box(parseInt($(selector).children().eq(activeIdx).attr('linkid')));
    }
}
function addImage2box(id) {
    var id = typeof id == 'undefined' ? 0 : id;
    if (imgtpls[id] && $('#imgPreivewBox').find('img[linkid="'+id+'"]').size() < 1) {
        $('#imgPreivewBox').children().remove();
        var _imgSrc = '';
        if (useCdnUrl) {
            _imgSrc = imgtpls[id].picurl_small+jconfig.ver_string;
        } else {
            _imgSrc = 'data/'+imgtpls[id].path_small+jconfig.ver_string;
        }
        $('#imgPreivewBox').html('<img linkid="'+id+'" src="'+_imgSrc+'" onerror="this.src=\''+jconfig.noimg_src+'\';this.onerror=null;" />');
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
function random(a, b) {
    return parseInt(Math.random()*(Math.abs(a-b)+1) + Math.min(a, b));
}
var ajaxTimeout = 3000;
function formpost_success(resp, jqXHR, textStatus) {
}
function formpost_error (jqXHR, textStatus, errorThrown) {
}
var ajaxform_handle_mergeform = {
    timeout: ajaxTimeout,
    formCheck: function() {
        return true;
    },
    beforeSerialize: function(form, options) {
    },
    beforeSubmit: function(arr, form, options){
    },
    success: function(resp, jqXHR, textStatus){
        formpost_success(resp, jqXHR, textStatus);
    },
    error: function(jqXHR, textStatus, errorThrown){
        formpost_error(jqXHR, textStatus, errorThrown);
    },
    complete: function(jqXHR, textStatus){}
};

/** 功能 格式化字节大小
 *  @param $size Integer 文件字节数
 *  @return String 如:10.1KB, 0.99MB, ...
 */
function formatsize(size)
{
    var prec=3;
    var size = Math.round(Math.abs(size));
    var units = [' B', 'KB', 'MB', 'GB', 'TB'];
    if (size==0) {
        return str_repeat(" ", $prec) + "0" + units[0];
    }
    var unit = Math.min(4, Math.floor(Math.log(size)/Math.log(2)/10));
    size = size * Math.pow(2, -10*unit);
    var digi = prec - 1 - Math.floor(Math.log(size)/Math.log(10));
    size = Math.round(size * Math.pow(10, digi)) * Math.pow(10, -1*digi);
    return size.toString() + units[unit];
}
function str_repeat(str, num){ 
    return new Array( num + 1 ).join( str ); 
} 
function eventSourceSupport() {
	return !(typeof EventSource == 'undefined');
}
var jsToaster = new jsToast({mode: 2, duration: 2.25});
var imgSupportBase64 = null;

;(function($){
$(function(){
});
})(jQuery);