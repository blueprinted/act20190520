function pageInit() {
    pageAdptor();
}

function iRegion(area, options) {
    this.defaults = {
        wrapEleSelector: '#area-wrap',
        initSelectedId: 0,
        selectorAttr: [
            {id: 'province', name:'province'},
            {id: 'city', name:'city'},
            {id: 'country', name:'country'}
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
            tmpString = '<select'+arrtId + attrName +' level="'+area[0].level+'">';
            tmpString += '<option value="0">请选择</option>';
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
            tmpString = '<select'+arrtId + attrName +' level="'+area[0].level+'">';
            tmpString += '<option value="0">请选择</option>';
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

var hometown, workplace, jsToaster;
$(function () {

    localStorage.userName = "";
    pageInit();
    //图片预加载
	var imgList=[
		"./static/i/bg.jpg",
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
    })
    
    //关闭弹层
    $("#Errormask").on("click", function () {
        $(this).hide()
    })
    //点击开始测试按钮
    $("#btn_start").on("click", function (e) {
    	$("#indexWrap").hide();    	
		$("#indexWrap").hide();
    	$('#indexWrap').addClass('displaynone')
    	$('#getinfoWrap').show();
    })
	//点击提交按钮
	$("#btn_mysub").on("click", function (e) {
        // 检查数据是否填写完毕
        if ($.trim($('#nickname').val()).length < 1) {
            jsToaster.show('请填写姓名');
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
        if (($('select#province').size() > 0 && parseInt($('select#province').val()) < 1)
            || ($('select#city').size() > 0 && parseInt($('select#city').val()) < 1)
            || ($('select#country').size() > 0 && parseInt($('select#country').val()) < 1)
        ) {
            jsToaster.show('请选择家乡所在地');
            return false;
        }
        if (($('select#work_province').size() > 0 && parseInt($('select#work_province').val()) < 1)
            || ($('select#work_city').size() > 0 && parseInt($('select#work_city').val()) < 1)
            || ($('select#work_country').size() > 0 && parseInt($('select#work_country').val()) < 1)
        ) {
            jsToaster.show('请选择工作地区');
            return false;
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
        
        
		$('#getinfoWrap').hide();
		$("#indexOtherWrap").show();   
	})
	//点击提交按钮
	$("#btn_subAll").on("click", function (e) {
		$("#indexOtherWrap").hide();
		$("#resultLoading").show(); 
		   
	})
    
    //避免双击时图片弹起
    $("#resultImg,#adWrap").on("click", function (e) {
        e.preventDefault();
    })

    $("#textbox").blur(function(){window.scrollTo(0,0)})

    $(".nomove").on("touchmove", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false)

    jsToaster = new jsToast();
    var options = {
        wrapEleSelector: '#hometown-wrap',
        initSelectedId: 0,
        selectorAttr: [
            {id: 'province', name:'province'},
            {id: 'city', name:'city'},
            {id: 'country', name:'country'}
        ]
    }
    hometown = new iRegion(regions, options);

    var options = {
        wrapEleSelector: '#workplace-wrap',
        initSelectedId: 110100,
        selectorAttr: [
            {id: 'work_province', name:'work_province'},
            {id: 'work_city', name:'work_city'},
            {id: 'work_country', name:'work_country'}
        ]
    }
    workplace = new iRegion(regions, options);

    $('#uploadbox input[type="file"]').change(function(e){
        var self = this;
        $(self).attr('imgfileLoaded', 'false');
        if (this.files.length < 1) {
            $(self).parent().children('img').remove();
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).parent().find("div.imgwaiter").remove();
            $(self).parent().removeClass("btn_upSuccBox");
            $(self).parent().removeClass("loading");
            window.jsToaster.show('您没有选择任何图片');
            return false;
        }
        var file = this.files[0];
        if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
            $(self).parent().children('img').remove();
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).val('');
            $(self).parent().find("div.imgwaiter").remove();
            $(self).parent().removeClass("btn_upSuccBox");
            $(self).parent().removeClass("loading");
            window.jsToaster.show('请上传png/jpg/jpeg类型的图片文件');
            return false;
        }
        if (file.size > 10*1024*1024) {
            $(self).parent().children('img').remove();
            $(self).parent().children('input[type="hidden"]').remove();
            $(self).val('');
            $(self).parent().find("div.imgwaiter").remove();
            $(self).parent().removeClass("btn_upSuccBox");
            $(self).parent().removeClass("loading");
            window.jsToaster.show('图片文件大小不能超过'+formatsize(10*1024*1024));
            return false;
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            $(self).parent().children('img').remove();
            $(self).parent().children('input[type="hidden"]').remove();
            if($(self).parent().find("div.imgwaiter").length){
                $(self).parent().find("div.imgwaiter").remove();
                $(self).parent().removeClass("btn_upSuccBox");
            }
            $(self).parent().addClass("loading").append('<div class="imgwaiter innercenter" style="width:'+210+'px;height:'+210+'px;">载入中,请稍等..</div>');
            var result = this.result;
            setTimeout(function() {
                //$('<img src="'+result+'" filesize="'+file.size+'" onload="javascript:$(this).parent().removeClass(\'loading\').addClass(\'btn_upSuccBox\');imgResize(this);" />').appendTo($(self).parent());
                var tplId = parseInt($('#mergeform input[type="hidden"][name="imgtplId"]').val());
                imageLoader(result, file.size, $(self).parent()[0], tplId);
            },50);
        }, false);
        reader.readAsDataURL(file);
    });
});
