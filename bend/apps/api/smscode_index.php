<?php
/**
 * 获取手机验证码
 */

use libs\SmsSingleSender;
use libs\SmsMultiSender;
use libs\SmsSenderUtil;

if (!isset($_POST['dosubmit']) || !$_POST['dosubmit']) {
    apimessage(9, '未识别的请求');
}

$config = array(
    'appid' => '1400034244',
    'appkey'=> 'ac75b35bfadd5cb19cc98dfcb1d7fe40',
);

$phone = getVar('phone');
if (strlen($phone) != 11) {
    apimessage(1, '手机号应为11位数');
}
$pattern = "/^((13[0-9])|(14[1]|[4-9])|(15([0-3]|[5-9]))|(16[2]|[5-7])|(17[0-3]|[5-8])|(18[0-9])|(19[1|8|9]))\d{8}$/";
if (!preg_match($pattern, $phone)) {
    apimessage(2, '手机号不正确');
}

$verify_code = random(6, true);

$singleSender = new SmsSingleSender($config['appid'], $config['appkey']);
// 普通单发
$result = $singleSender->send(0, "86", $phone, "【柯小菲】您的注册验证码为{$verify_code}", "", "");
$rsp = json_decode($result, true);
if($rsp['result'] == 0){
    $_SESSION['verify_code'] = "{$verify_code}";
    $_SESSION['verify_number'] = "{$phone}";
    apimessage(0, '短信发送成功', $rsp);
}else{
    apimessage(3, '短信发送失败', $rsp);
}
