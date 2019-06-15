"use strict";

function pageInit() {}

function iRegion(area, options) {
    this.defaults = {
        wrapEleSelector: '#area-wrap',
        initSelectedId: 0,
        defaultSelectText: '请选择',
        selectorAttr: [
            {id: 'province', name:'province'},
            {id: 'city', name:'city'},
            {id: 'county', name:'county'}
        ],
        changedCallback: function () { }
    };
    this.options = $.extend(this.defaults, options || {}),/* initial params */
    this.wrapper = $(this.options.wrapEleSelector);
    this.area = typeof area == 'undefined' ? [] : area;
    this.init();
}
iRegion.prototype = {
    init: function () {
        this.render(this.options.initSelectedId);
    },
    find: function (idval) {
        var resu = [];
        var seek = function (tree, idval, path) {
            for (var i=0; i<tree.length; i++) {
                if (tree[i].id == idval) {
                    path.push(i);
                    resu = path;
                    break;
                } else {
                    var tmppath = [];
                    for (var k=0; k<path.length; k++) {
                        tmppath.push(path[k]);
                    }
                    tmppath.push(i);
                    seek(tree[i].children, idval, tmppath);
                }
            }
        }
        seek(this.area, idval, []);
        return resu;
    },
    render: function (idval) {
        var self = this;
        var htmlString = '';
        var path;
        if (idval > 0) {
            path = this.find(idval);
        } else {
            path = [-1];
        }
        var area = this.area;
        var i = 0;
        var idx = path[0];
        var tmpString;
        var arrtId;
        var attrName;
        while (area.length > 0) {
            arrtId = this.options.selectorAttr[i] ? (' id="'+this.options.selectorAttr[i].id+'"') : '';
            attrName = this.options.selectorAttr[i] ? (' name="'+this.options.selectorAttr[i].name+'"') : '';
            tmpString = '<select'+arrtId + attrName +' level="'+area[0].level+'" class="control-select">';
            tmpString += '<option value="0">'+self.defaults.defaultSelectText+'</option>';
            for (var j=0; j<area.length; j++) {
                tmpString += '<option value="'+area[j].id+'"' + (j == idx ? ' selected="selected"' : '') + '>'+(area[j].level<2?area[j].short_name:area[j].name)+'</option>';
            }
            tmpString += '</select>';
            htmlString += tmpString;
            //console.log(area);
            area = area[idx<0?0:idx].children;
            i++;
            if (i < path.length) {
                idx = path[i];
            } else {
                break;
            }
        }
        if (area.length > 0 && path[0] >= 0) {
            arrtId = this.options.selectorAttr[i] ? (' id="'+this.options.selectorAttr[i].id+'"') : '';
            attrName = this.options.selectorAttr[i] ? (' name="'+this.options.selectorAttr[i].name+'"') : '';
            tmpString = '<select'+arrtId + attrName +' level="'+area[0].level+'" class="control-select">';
            tmpString += '<option value="0">'+self.defaults.defaultSelectText+'</option>';
            for (var j=0; j<area.length; j++) {
                tmpString += '<option value="'+area[j].id+'">'+(area[j].level<2?area[j].short_name:area[j].name)+'</option>';
            }
            tmpString += '</select>';
            htmlString += tmpString;
        }

        $(this.wrapper).children().remove();
        $(this.wrapper).append(htmlString);
        $(this.wrapper).children().change(function(){
            var val = parseInt($(this).val());
            val = isNaN(val) ? 0 : val;
            var level;
            if (val < 1) {
                level = parseInt($(this).attr('level'));
                $(this).siblings().each(function(){
                    if (parseInt($(this).attr('level')) > level) {
                        $(this).val(0).hide();
                    }
                });
            } else {
                self.render(val);
            }
        });
    }
}

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

function _resizeCanvas(canvas, width, height) {
    canvas.style.width = canvas.width = width;
    canvas.style.height = canvas.height = height;
    canvas.getContext('2d').clearRect(0, 0, width, height);
}
function imageLoader(src, filesize, parentEle) {
    var image = new Image();
    image.onload = function() {
        var srcWidth = image.width;
        var srcHeight = image.height;
        var maxWidth = 2048;
        var maxHeight = 2048;
        var maxFilesize = 10 * 1024 * 1024;
        var realWidth = srcWidth;
        var realHeight = srcHeight;
        var scale = 1;
        if (srcWidth > maxWidth || srcHeight > maxHeight) {
            scale = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        }
        if (filesize > maxFilesize) {
            scale = Math.min(Math.sqrt(maxFilesize/filesize), scale);
        }
        if (scale < 1) {
            realWidth = parseInt(scale * srcWidth);
            realHeight = parseInt(scale * srcHeight);
        }
        /**
         * orientation值 旋转角度
                    1	 0°
                    3	 180°
                    6	 逆时针90°
                    8	 顺时针90°
        */
        EXIF.getData(image, function() {
            var Orientation = EXIF.getTag(this, "Orientation"); //integer
            if (!isIOS()) {
                if (Orientation) {
                    $(image).addClass('orientation'+Orientation);
                }
            }
            var canvas = $('#drawer');
            _resizeCanvas($(canvas)[0], realWidth, realHeight);
            if (Orientation == 3) {
                $(canvas)[0].getContext('2d').translate(realWidth/2, realHeight/2);
                $(canvas)[0].getContext('2d').rotate(Math.PI);
                $(canvas)[0].getContext('2d').translate(-1*realWidth/2, realHeight/2);
            } else if (Orientation == 6) {
                $(canvas)[0].getContext('2d').translate(realWidth/2, realHeight/2);
                $(canvas)[0].getContext('2d').rotate(Math.PI/2);
                $(canvas)[0].getContext('2d').translate(-1*realWidth/2, -1*realHeight/2);
            } else if (Orientation == 8) {
                $(canvas)[0].getContext('2d').translate(realWidth/2, realHeight/2)
                $(canvas)[0].getContext('2d').rotate(-1*Math.PI/2);
                $(canvas)[0].getContext('2d').translate(-1*realWidth/2, -1*realHeight/2)
            }
            $(canvas)[0].getContext('2d').drawImage(image, 0, 0, srcWidth, srcHeight, 0, 0, realWidth, realHeight);
            /* jpeg 压缩 start
            var imgData = $(canvas)[0].getContext('2d').getImageData(0, 0, realWidth, realHeight);
            var encoder = new JPEGEncoder();
            var dataURI = encoder.encode(imgData, 100);
            jpeg 压缩 end */
            var dataURI = $(canvas)[0].toDataURL();
            $(parentEle).children('.imgwaiter').html('');
            $(image).attr({filesize0:filesize,filesize:dataURI.length}).appendTo($(parentEle).children('.imgwaiter'));
            $(image).parent().parent().find('input[type="hidden"]').remove();
            $(image).parent().parent().append('<input type="hidden" name="hdimg" value="'+dataURI+'"/>');
            $(parentEle).removeClass('img-loading').addClass('img-loaded');
            $(image).parent().parent().append('<input type="hidden" name="orientation" value="'+(Orientation?Orientation:1)+'"/>');
            $(image).click(function(){$(this).parent().parent().children('input[type="file"]').trigger('click')});
            setTimeout(function(){$(image).parent().parent().children('input[type="file"]').attr('imgfileLoaded', 'true');}, 0);
        });
    }
    image.src = src;
}
function random(a, b) {
    return parseInt(Math.random()*(Math.abs(a-b)+1) + Math.min(a, b));
}
var clocker = new jsClocker({
	starttime: 0,
	endtime: 60,
	recall: function(){
		$('#smsCodeBtn').html('重新获取');
	},
	update: function(td, total){$('#smsCodeBtn').html('可在'+td+'秒后重发')},
	autoRun: false
});
/*通用ajax提交处理*/
function ajaxprocess(options) {
	var defaults = {
		type: 'get',
		url: '',
		data: '',
		dataType: 'json',
		success: function(resp) {
			alert(resp.message);
			if(resp.status==1) {
				setTimeout(function(){window.location.reload()},1250);
			}
		},
		error: function() {
			alert('请求失败[ajax error]');
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
var form_check_basicform = function () {
    // 检查数据是否填写完毕
    if ($.trim($('#nickname').val()).length < 1) {
        jsToaster.show('请填写昵称');
        return false;
    }
    if ($('input[name="gender"]:checked').size() < 1) {
        jsToaster.show('请填选择性别');
        return false;
    }
    if ($.trim($('#age').val()).length < 1) {
        jsToaster.show('请填写年龄');
        return false;
    }
    if ($.trim($('#height').val()).length < 1) {
        jsToaster.show('请填写身高');
        return false;
    }
    if ($.trim($('#zhiye').val()).length < 1) {
        jsToaster.show('请填写职业');
        return false;
    }
    if ($.trim($('#school').val()).length < 1) {
        jsToaster.show('请填写学校');
        return false;
    }
    if (($('select#province').size() < 1 || parseInt($('select#province').val()) < 1)
        || ($('select#city').size() < 1 || parseInt($('select#city').val()) < 1)
        || ($('select#county').size() < 1 || parseInt($('select#county').val()) < 1)
    ) {
        if ($('select#province').size() > 0 && parseInt($('select#province').val()) > 0) {
            var provinceId = parseInt($('select#province').val());
            if (provinceId == 110000 || provinceId == 120000 || provinceId == 310000 || provinceId == 500000) {
                if ($('select#county').size() < 1 || parseInt($('select#county').val()) < 1) {
                    jsToaster.show('请将家乡所在地选择完整');
                    return false;
                }
            } else {
                if ($('select#city').size() < 1 || parseInt($('select#city').val()) < 1) {
                    jsToaster.show('请将家乡所在地选择完整');
                    return false;
                }
            }
        } else {
            jsToaster.show('请选择家乡所在地');
            return false;
        }
    }
    if (($('select#work_province').size() < 1 || parseInt($('select#work_province').val()) < 1)
        || ($('select#work_city').size() < 1 || parseInt($('select#work_city').val()) < 1)
        || ($('select#work_county').size() < 1 || parseInt($('select#work_county').val()) < 1)
    ) {
        if ($('select#work_province').size() > 0 && parseInt($('select#work_province').val()) > 0) {
            var provinceId = parseInt($('select#work_province').val());
            if (provinceId == 110000 || provinceId == 120000 || provinceId == 310000 || provinceId == 500000) {
                if ($('select#work_county').size() < 1 || parseInt($('select#work_county').val()) < 1) {
                    jsToaster.show('请将工作工作地区选择完整');
                    return false;
                }
            } else {
                if ($('select#work_city').size() < 1 || parseInt($('select#work_city').val()) < 1) {
                    jsToaster.show('请将工作工作地区选择完整');
                    return false;
                }
            }
        } else {
            jsToaster.show('请选择工作地区');
            return false;
        }
    }
    if ($('input[name="annual_income"]:checked').size() < 1) {
        jsToaster.show('请选择年收入');
        return false;
    }
    if ($('input[name="ques1"]:checked').size() < 1) {
        jsToaster.show('选择题(1)未完成');
        return false;
    }
    if ($('input[name="ques2"]:checked').size() < 1) {
        jsToaster.show('选择题(2)未完成');
        return false;
    }
    if ($('input[name="ques3"]:checked').size() < 1) {
        jsToaster.show('选择题(3)未完成');
        return false;
    }
    if ($('input[name="ques4"]:checked').size() < 1) {
        jsToaster.show('选择题(4)未完成');
        return false;
    }
    if ($('input[name="yanzhi"]:checked').size() < 1) {
        jsToaster.show('请为自己的颜值打分');
        return false;
    }
    if ($.trim($('#weixin').val()).length < 1) {
        jsToaster.show('请填写微信号');
        return false;
    }
    if ($.trim($('#phone_number').val()).length < 1) {
        jsToaster.show('请填写手机号');
        return false;
    }
    return true;
}
var ajaxform_handle_basicform = {
    timeout: 30000,
    dataType: 'json',
    confirm: {
        noConfirm: true,
        title: '确定要提交吗？',
        cancelFunc: function(){}
    },
    formCheck: function() {return form_check_basicform()},
    beforeSerialize: function(form, options){},
    beforeSubmit: function(arr, form, options){
        $('#btn_mysub').html('资料提交中，请稍等..');
    },
    success: function(resp, jqXHR, textStatus){
        jsToaster.show(resp.msg);
        if (resp.code == 0) {
            $('#getinfoWrap').hide();
            $("#indexOtherWrap").show();
        }
    },
    error: function(jqXHR, textStatus, errorThrown){
        jsToaster.show("提交失败 [" + textStatus + (errorThrown ? (' ' + errorThrown) : '') + "]");
    },
    complete: function(jqXHR, textStatus){
        $('#btn_mysub').html('下一步');
    }
};
var form_check_matchform = function () {
    // 检查数据是否填写完毕
    if ($('input[name="match_age"]:checked').size() < 1) {
        jsToaster.show('请填选择年龄范围');
        return false;
    }
    if ($('input[name="match_height"]:checked').size() < 1) {
        jsToaster.show('请填选择身高范围');
        return false;
    }
    if ($('input[name="match_annual_income"]:checked').size() < 1) {
        jsToaster.show('请填选择年收入范围');
        return false;
    }
    if ($('input[name="match_yanzhi_grade"]:checked').size() < 1) {
        jsToaster.show('请填选择颜值分数范围');
        return false;
    }
    return true;
}
var ajaxform_handle_matchform = {
    timeout: 5000,
    dataType: 'json',
    confirm: {
        noConfirm: true,
        title: '确定要提交吗？',
        cancelFunc: function(){}
    },
    formCheck: function() {return form_check_matchform()},
    beforeSerialize: function(form, options){},
    beforeSubmit: function(arr, form, options){
    },
    success: function(resp, jqXHR, textStatus){
        if (resp.code == 0) {
            $("#indexOtherWrap").hide();
            $("#resultLoading").show();
            setTimeout(function(){
                // resp = {"code":0,"msg":"提交成功","data":[{"uid":"4","nickname":"赵灵儿","age":"18","height":"172","zhiye":"神仙","province":"110000","city":"110100","county":"110101","photo_url":"upload/uploadImages/liuyifei.jpeg","province_cn":"北京","city_cn":"北京市","county_cn":"东城区"},{"uid":"5","nickname":"花千骨","age":"18","height":"168","zhiye":"神仙","province":"110000","city":"110100","county":"110101","photo_url":"upload/uploadImages/zhaoliying.jpeg","province_cn":"北京","city_cn":"北京市","county_cn":"东城区"},{"uid":"6","nickname":"陆雪琪","age":"18","height":"168","zhiye":"神仙","province":"110000","city":"110100","county":"110101","photo_url":"upload/uploadImages/yangzi.jpeg","province_cn":"北京","city_cn":"北京市","county_cn":"东城区"}]};
                $('.tuijianList').html(function(){
                    var userList = resp.data;
                    var _html = '';
                    for (var i=0; i<userList.length; i++) {
                        var user = userList[i];
                        var jiguan = user.province_cn + (user.city_cn.length > 0 ? ' ' : '') + user.city_cn + (user.county_cn.length > 0 ? ' ' : '') + user.county_cn;
                        var liked = user.liked ? ' class="like"' : '';
                        _html += '<li idx="'+i+'" uid="'+user.uid+'"'+liked+'>';
                        _html += '<div class="avaImg"><img src="bend/data/'+user.photo_url+'"></div>';
                        _html += '<div class="liinfo"></div>';
                        _html += '<div class="rowdiv"><label class="">昵称：</label><label>'+user.nickname+'</label></div>';
                        _html += '<div class="rowdiv"><label class="">年龄：</label><label>'+user.age+'</label></div>';
                        _html += '<div class="rowdiv"><label class="">身高：</label><label>'+user.height+'</label></div>';
                        _html += '<div class="rowdiv"><label class="">职业：</label><label>'+user.zhiye+'</label></div>';
                        _html += '<div class="rowdiv"><label class="">籍贯：</label><label>'+jiguan+'</label></div>';
                        _html += '</div>';
                        _html += '<span class="like-icon"></span>';
                        _html += '</li>';
                    }
                    return _html;
                });
                $('.tuijianList').children().hide().filter('[idx="0"]').show();
                $("#resultLoading").hide();
                $("#resultWrap").show();
            }, random(750, 1250));
        } else {
            jsToaster.show(resp.msg);
        }
    },
    error: function(jqXHR, textStatus, errorThrown){
        jsToaster.show("提交失败 [" + textStatus + (errorThrown ? (' ' + errorThrown) : '') + "]");
    },
    complete: function(jqXHR, textStatus){}
};
function next_user () {
    var length = $('.tuijianList').children().size();
    var idx = -1;
    $('.tuijianList').children().each(function(){
        $('.tuijianList').children().each(function(){
            if ($(this).is(':visible')) {
                idx = parseInt($(this).attr('idx'));
                return false;
            }
        });
    });
    if (idx < length - 1) {
        idx++;
    } else {
        idx = 0;
    }
    $('.tuijianList').children().hide();
    $('.tuijianList').children().eq(idx).show();
}
function like() {
    var uid = -1;
    $('.tuijianList').children().each(function(){
        $('.tuijianList').children().each(function(){
            if ($(this).is(':visible')) {
                uid = parseInt($(this).attr('uid'));
                return false;
            }
        });
    });
    if (uid < 1) {
        jsToaster.show("目标埠存在");
        return false;
    }
    ajaxprocess({
        type: 'post',
        url: 'bend/?mod=api&controller=like&acion=index',
        data: 'dosubmit=true&match_uid='+uid,
        dataType: 'json',
        success: function(resp) {
            if(resp.code != 0) {
                jsToaster.show(resp.msg);
            } else {
                if (resp.data) {
                    $('.tuijianList').children().filter('[uid="'+uid+'"]').addClass('like');
                } else {
                    $('.tuijianList').children().filter('[uid="'+uid+'"]').removeClass('like');
                }
                if (resp.data) {
                    setTimeout(function(){
                        $("#resultWrap").hide();
                        $('#adWRap').show();
                    }, 500);
                }
            }
        },
        error: function() {
            jsToaster.show("请求发送手机验证码失败[ajax error]");
        },
        complete: function() {
            $('#smsCodeBtn').removeAttr('ajaxing');
            if(status == 'timeout') {
                $('textarea[name="response"]').append("请求发送手机验证码超时[ajax timeout]\r\n").scrollTo($('textarea[name="response"]')[0].scrollHeight,100);/*请求超时*/
            }
        }
    });
}
var hometown, workplace, matchplace,jsToaster,mySwiper,hammertime;
$(function () {
    /*
    mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        loop: false // 循环模式选项
    });
    */
	var imgList=[
		"./static/i/bg.jpg"
	];
    for (var q = 0; q < imgList.length; q++) {
        var myParent = document.getElementById("preloadImg");
        var myImage = document.createElement("img");
        myImage.src = imgList[q];
        myParent.appendChild(myImage);
    }
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {  // 按下enter
            e.preventDefault()
            //要做的事
        }
    };
    //点击引言，跳过
    $("#introductionWrap").on("click", function () {
        $("#introductionWrap").hide();
        $("#indexWrap").show();
    });
    //关闭弹层
    $("#Errormask").on("click", function () {
        $(this).hide()
    });
    //点击开始测试按钮
    $("#btn_start").on("click", function (e) {
    	$("#indexWrap").hide();    	
		$("#indexWrap").hide();
    	$('#indexWrap').addClass('displaynone')
    	$('#getinfoWrap').show();
    });
    //避免双击时图片弹起
    $("#resultImg,#adWrap").on("click", function (e) {
        e.preventDefault();
    });
    $('#smsCodeBtn').click(function(){
        var phone = $.trim($('#phone_number').val());
        if (phone.length < 1) {
            jsToaster.show("请先填写手机号码");
            return false;
        }
		if(!clocker.doned()) {
			return false;
		}
		if($(this).attr('ajaxing')) {
			return false;
		}
        $(this).attr('ajaxing',true);
		ajaxprocess({
			type: 'post',
			url: 'bend/?mod=api&controller=smscode&acion=index',
			data: 'dosubmit=true&phone='+phone,
			dataType: 'json',
			success: function(resp) {
                jsToaster.show(resp.msg);
				if(resp.code != 0) {
				} else {
					clocker.stop();
					clocker.run();
				}
			},
			error: function() {
                jsToaster.show("请求发送手机验证码失败[ajax error]");
			},
			complete: function() {
				$('#smsCodeBtn').removeAttr('ajaxing');
				if(status == 'timeout') {
					$('textarea[name="response"]').append("请求发送手机验证码超时[ajax timeout]\r\n").scrollTo($('textarea[name="response"]')[0].scrollHeight,100);/*请求超时*/
				}
			}
		});
	});

    $("#textbox").blur(function(){window.scrollTo(0,0)});

    $(".nomove").on("touchmove", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

    jsToaster = new jsToast();
    var options = {
        wrapEleSelector: '#hometown-wrap',
        initSelectedId: 0,
        selectorAttr: [
            {id: 'province', name:'province'},
            {id: 'city', name:'city'},
            {id: 'county', name:'county'}
        ]
    }
    hometown = new iRegion(regions, options);

    var options = {
        wrapEleSelector: '#workplace-wrap',
        initSelectedId: 110100,
        selectorAttr: [
            {id: 'work_province', name:'work_province'},
            {id: 'work_city', name:'work_city'},
            {id: 'work_county', name:'work_county'}
        ]
    }
    workplace = new iRegion(regions, options);

    var options = {
        wrapEleSelector: '#home-match-wrap',
        defaultSelectText: '不限',
        initSelectedId: 0,
        selectorAttr: [
            {id: 'match_province', name:'match_province'},
            {id: 'match_city', name:'match_city'},
            {id: 'match_county', name:'match_county'}
        ]
    }
    matchplace = new iRegion(regions, options);

    $('#uploadbox input[type="file"]').change(function(e){
        var self = this;
        $(self).attr('imgfileLoaded', 'false');
        if (this.files.length < 1) {
            $(self).parent().children('.imgwaiter').html('+');
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).parent().removeClass("img-loading img-loaded");
            window.jsToaster.show('您没有选择任何图片');
            return false;
        }
        var file = this.files[0];
        if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
            $(self).parent().children('.imgwaiter').html('+');
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).val('');
            $(self).parent().removeClass("img-loading img-loaded");
            window.jsToaster.show('请上传png/jpg/jpeg类型的图片文件');
            return false;
        }
        if (file.size > 10*1024*1024) {
            $(self).parent().children('.imgwaiter').html('+');
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).val('');
            $(self).parent().removeClass("img-loading img-loaded");
            window.jsToaster.show('图片文件大小不能超过'+formatsize(10*1024*1024));
            return false;
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            $(self).parent().children('.imgwaiter').html('+');
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).parent().addClass("img-loading");
            var result = this.result;
            $(self).parent().children('.imgwaiter').html(function(){
                return $(this).attr('load-txt');
            });
            setTimeout(function() {
                imageLoader(result, file.size, $(self).parent()[0]);
            }, 50);
        }, false);
        reader.readAsDataURL(file);
    });

    var range_age_sliders = {
        'min': [18, 1],
        '36%': [30, 1],
        '72%': [40, 1],
        'max': [50, 1]
    };
    var pipsSlider1 = document.getElementById('year-slider-pips');
    noUiSlider.create(pipsSlider1, {
        tooltips: true,
        range: range_age_sliders,
        format: {
            to: function (value) {
                return parseInt(value);
            },
            from: function (value) {
                return parseInt(value);
            }
        },
        start: [25],
        pips: {mode: 'range', density: 0}
    });
    pipsSlider1.noUiSlider.on('update', function (values, handle) {
        $('#age').val(values[handle]);
    });

    var range_height_sliders = {
        'min': [150, 1],
        '15%': [160, 1],
        '35%': [170, 1],
        '60%': [180, 1],
        '75%': [190, 1],
        '90%': [210, 1],
        'max': [240, 1]
    };
    var pipsSlider2 = document.getElementById('height-slider-pips');
    noUiSlider.create(pipsSlider2, {
        tooltips: true,
        range: range_height_sliders,
        format: {
            to: function (value) {
                return parseInt(value);
            },
            from: function (value) {
                return parseInt(value);
            }
        },
        start: [165],
        pips: {mode: 'range', density: 0}
    });
    pipsSlider2.noUiSlider.on('update', function (values, handle) {
        $('#height').val(values[handle]);
    });
    var manager = new Hammer.Manager(document.querySelector('#adWRap'));
    manager.add(new Hammer.Swipe({event:'swipe',pointers:1,threshold:20}));
    manager.on('swipe', function(e) {
        // e.offsetDirection 2:swipe left 4: swipe right 8: swipe top 16: swipe down
        // console.log(e.deltaX, e.offsetDirection);
        if (e.offsetDirection == 4) {
            setTimeout(function() {
                $("#resultWrap").show();
                $('#adWRap').hide(); 
            }, 250);
        }
    });
});
