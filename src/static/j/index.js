function pageInit() {
    pageAdptor();
    
}
pageInit();

//腾讯云统计
function txClickStat(key) {
    try {
        MtaH5.clickStat(key);
    } catch (e) {}
}

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
        try {
            MtaH5.clickStat("introductiongo");
        } catch (e) { }
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
        txClickStat('btn_start');
    })
	//点击提交按钮
	$("#btn_mysub").on("click", function (e) {
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
    if(isPC()){
    	$('.resultTip').text('右键保存图片');
    }else{
    	$('.resultTip').text('长按保存图片');
    }
    $("#rightBottom").on("click", function (e) {
        e.preventDefault();
        $("#adWrap").removeClass("displaynone");
        $("#resultWrap").hide();
        
        try {
            MtaH5.clickStat("adLink");
        } catch (e) { }
//      clearInterval(interval);
        interval = setInterval(function(){
            nextFrame();
        }, 40);
    })
	var height = 480;
	frameIndex = 1;//picture index
	frameNum = 16;
	var gifMap = {
		1:25,
		2:1,
		3:1,
		4:25,
		5:1,
		6:1,
		7:1,
		8:1,
		9:1,
		10:1,
		11:25,
		12:1,
		13:5,
		14:25,
		15:2,
		16:75,
	}
	var showTimes = gifMap[1];
	function nextFrame()
	{
		//控制文案显示隐藏
	    if (frameIndex <= 4) {
	    	$('.username2,.username3,.usermeans').hide();
	    	$('.username1').show();
	    	if (frameIndex == 1) {
	    		$('.gifbox').css('background-position', '0 0');
	    	}
	    } else {
	    	$('.username1').hide();
	    	$('.username2,.username3').show();
	    	if (frameIndex == frameNum) {
	    		$('.usermeans').show();
	    	}
	    }
	    
	    var position = frameIndex * height;
	    if (showTimes > 0) {
	    	showTimes--;
	    } else {  //next picture
	    	if (frameIndex >= frameNum) {
	    		frameIndex = 0;
//	    		clearInterval(interval);//播放结束
	    	}
	    	frameIndex++;
	    	$('.gifbox').css('background-position', '0 -' + position + 'px');
	    	showTimes = gifMap[frameIndex];
	    }
	    
	}
    $("#btn_back").on("click", function (e) {
        e.preventDefault();
        $("#mainWrap").removeClass("body_bg1");
        $("#resultWrap").show();
        $("#adWrap").addClass("displaynone");
        //停止动画
        if (interval) {
            clearInterval(interval);
            $('.gifbox').css('background-position', '0 0');
            frameIndex = 1;
        }
        try {
            MtaH5.clickStat("btn_back");
        } catch (e) { }

    })
})

$("#textbox").blur(function(){window.scrollTo(0,0)})



$(".nomove").on("touchmove", function (e) {
    e.preventDefault();
    e.stopPropagation();
}, false);
