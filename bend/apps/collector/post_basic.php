<?php

if (!isset($_POST) || !$_POST['dosubmit']) {
    apimessage(88, '未识别的请求');
}

$nickname = getVar('nickname');
$gender = intval(getVar('gender'));
$age = intval(getVar('age'));
$email = getVar('email');
$height = intval(getVar('height'));
$zhiye = getVar('zhiye');
$school = getVar('school');
$province = intval(getVar('province'));
$city = intval(getVar('city'));
$county = intval(getVar('county'));
$work_province = intval(getVar('work_province'));
$work_city = intval(getVar('work_city'));
$work_county = intval(getVar('work_county'));
$annual_income = intval(getVar('annual_income')); // 档次
$phone_number = getVar('phone_number');
$sms_code = getVar('sms_code');
$weixin = getVar('weixin');
$yanzhi = intval(getVar('yanzhi')); //等级
$ques1 = strtoupper(getVar('ques1'));
$ques2 = strtoupper(getVar('ques2'));
$ques3 = strtoupper(getVar('ques3'));
$ques4 = strtoupper(getVar('ques4'));
$hdimg = getvar('hdimg');

// 载入配置数据
$selector_config = load_data('selector_config');
$question = load_data('question');

if (strlen($nickname) < 1) {
    apimessage(1, '没有填写昵称');
}
if ($gender != 1 && $gender != 2) {
    apimessage(1, '没有选择性别或选择的性别不正确');
}
if ($age < 1 || $age > 120) {
    apimessage(1, '填写的年龄不正确');
}
if ($height < 50 || $height > 280) {
    apimessage(1, '身高不正确');
}
if (strlen($zhiye) < 1) {
    apimessage(1, '没有填写职业');
}
if ($province < 1) {
    apimessage(1, '没有选择家乡所在的省');
}
if ($city < 1) {
    apimessage(1, '没有选择家乡所在的市');
}
if (in_array($province, array(110000,120000,310000,500000), true) && $county < 1) {
    apimessage(1, '请将家乡所在地选择完整');
}
if ($work_province < 1) {
    apimessage(1, '没有选择工作地所在的省');
}
if ($work_city < 1) {
    apimessage(1, '没有选择工作地所在的市');
}
if (in_array($province, array(110000,120000,310000,500000), true) && $work_county < 1) {
    apimessage(1, '请将工作地选择完成');
}
if (strlen($school) < 1) {
    apimessage(1, '没有填写学校');
}
if ($annual_income < 1) {
    apimessage(1, '没有选择年收入范围');
}
if (strlen($ques1) < 1) {
    apimessage(1, '选择题(1)没有选择');
}
if (!in_array($ques1, array('A', 'B'), true)) {
    apimessage(1, '选择题(1)选择的选项不存在');
}
if (strlen($ques2) < 1) {
    apimessage(1, '选择题(2)没有选择');
}
if (!in_array($ques2, array('A', 'B'), true)) {
    apimessage(1, '选择题(2)选择的选项不存在');
}
if (strlen($ques3) < 1) {
    apimessage(1, '选择题(3)没有选择');
}
if (!in_array($ques3, array('A', 'B'), true)) {
    apimessage(1, '选择题(3)选择的选项不存在');
}
if (strlen($ques4) < 1) {
    apimessage(1, '选择题(4)没有选择');
}
if (!in_array($ques4, array('A', 'B'), true)) {
    apimessage(1, '选择题(4)选择的选项不存在');
}
if (!isset($selector_config['annual_income'][$annual_income])) {
    apimessage(1, '年收入范围有误');
}
if (strlen($phone_number) < 1) {
    apimessage(1, '没有填写手机号码');
}
if (!preg_match('/^(\+?\d{2})?\s?\d{11}$/i', $phone_number)) {
    apimessage(1, '手机号码不正确');
}

if (strlen($sms_code) < 1) {
    apimessage(1, '短信验证码没有填写');
}
// 校验短信验证码
if (!isset($_SESSION['verify_code'])) {
    apimessage(1, '短信验证码已失效请重新获取');
}
// 检查手机号是不是接收验证码的手机号码
if ($phone_number !== $_SESSION['verify_number']) {
    apimessage(1, '手机号异常');
}
if ($sms_code !== $_SESSION['verify_code']) {
    apimessage(1, '短信验证码不正确');
}

$base64Pattern = "/^(data:image\/(jpg|jpeg|png);base64,)/i";
if (strlen($hdimg) < 1 || !preg_match($base64Pattern, $hdimg, $mathes)) {
    apimessage(1, '没有上传图片');
}
$fileext = $mathes[2];
$filedir = uploadUtil::get_target_dir(APP_DATA, 'upload/uploadImages');
$filename = uploadUtil::get_target_filename($fileext, false, 8);
$fileFullPath = "{$filedir}/{$filename}";
if (!mkdir_recursive(dirname($fileFullPath))) {
    apimessage(8, "接收图片失败(mk)");//
}
if(false === file_put_contents($fileFullPath, base64_decode(preg_replace($base64Pattern, '', $hdimg)))) {
    apimessage(9, "接收图片失败(mv)");//转移临时文件失败
}
$photo_url = str_replace(APP_DATA."/", '', $fileFullPath);

$regip = get_clientip(true);

$newarr = array(
    'nickname' => $nickname,
    'age' => $age,
    'gender' => $gender,
    'email' => $email,
    'height' => $height,
    'zhiye' => $zhiye,
    'province' => $province,
    'city' => $city,
    'county' => $county,
    'work_province' => $work_province,
    'work_city' => $work_city,
    'work_county' => $work_county,
    'school' => $school,
    'annual_income' => $annual_income,
    'phone_number' => $phone_number,
    'weixin' => $weixin,
    'yanzhi' => $yanzhi,
    'yanzhi_grade' => $yanzhi,
    'photo_url' => $photo_url,
    'answer1' => $ques1,
    'answer2' => $ques2,
    'answer3' => $ques3,
    'answer4' => $ques4,
    'regip' => $regip,
);

$tableConf = load_config('tables');
if (!isset($tableConf[tname('user')])) {
    if (false === generate_table_conf('user', true)) {
        apimessage(110, '生成表的字段类型配置失败');
    }
    $tableConf = load_config('tables', true);;
}

// 检查是否存在
$user = array();
$sql = "SELECT * FROM ".tname('user')." WHERE phone_number=?";
$query = $MDB->stmt_query($sql, "s", $phone_number);
if (!$user = $MDB->fetch_array($query)) {
    $user = array();
}

if (empty($user)) {
    $newarr['ctime'] = time();
    $fields = $values = $types = $placeholds = array();
    foreach ($tableConf[tname('user')] as $field => $type) {
        if (isset($newarr[$field])) {
            $fields[] = $field;
            $placeholds[] = "?";
            $types[] = $type;
            $values[] = $newarr[$field];
        }
    }
    if (empty($fields)) {
        apimessage(110, '没有提交资料数据');
    }

    $sql = "INSERT INTO ".tname('user')."(".implode(',', $fields).") VALUES(".implode(',', $placeholds).")";

    $args = array();
    $args[] = $sql;
    $args[] = implode('', $types);
    $args = array_merge($args, $values);
} else {
    $newarr['mtime'] = time();
    $fields = $values = $types = array();
    foreach ($tableConf[tname('user')] as $field => $type) {
        if (isset($newarr[$field])) {
            $fields[] = "{$field}=?";
            $types[] = $type;
            $values[] = $newarr[$field];
        }
    }
    if (empty($fields)) {
        apimessage(110, '没有提交资料数据');
    }

    $sql = "UPDATE ".tname('user')." SET " . implode(',', $fields) . " WHERE uid=?";
    $types[] = "i";
    $values[] = intval($user['uid']);

    $args = array();
    $args[] = $sql;
    $args[] = implode('', $types);
    $args = array_merge($args, $values);
}
//print_r($args);exit;
// 开启事物
$MDB->query("START TRANSACTION");

if (false === call_user_func_array(array($MDB, 'stmt_query'), $args)) {
    $MDB->query("ROLLBACK");
    apimessage(33, '保存资料失败');
}
if (empty($user)) {
    $newarr['uid'] = $MDB->insert_id();
    $user = $newarr;
}

unset($_SESSION['verify_number'], $_SESSION['verify_code']);

// 成功了则提交
$MDB->query("COMMIT");

$_SESSION['uid'] = intval($user['uid']);

apimessage(0, '提交成功');