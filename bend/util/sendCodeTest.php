<?php

require dirname(__FILE__) . '/common.php';

use libs\SmsSingleSender;
use libs\SmsMultiSender;
use libs\SmsSenderUtil;

$config = array(
    'appid' => '1400034244',
    'appkey'=> 'ac75b35bfadd5cb19cc98dfcb1d7fe40',
);

$verify_code = random(6, true);
$phone = '13811280234';
exit;

$singleSender = new SmsSingleSender($config['appid'], $config['appkey']);
// 普通单发
$result = $singleSender->send(0, "86", $phone, "【柯小菲】您的注册验证码为{$verify_code}", "", "");
$rsp = json_decode($result, true);
if($rsp['result'] == 0){
    $_SESSION['verify_code'] = $verify_code;
    $_SESSION['verify_number'] = $phone;
    apimessage(0, 'succ', $rsp);
}else{
    apimessage(1, 'fail', $rsp);
}