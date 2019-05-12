<?php

if (!isset($_POST)) {
    apimessage(88, '未识别的请求');
}

$nickname = getVar('nickname');
$age = intval(getVar('age'));
$gender = intval(getVar('gender'));
$email = getVar('email');
$height = intval(getVar('height'));
$zhiye = getVar('zhiye');
$hometown = getVar('hometown');
$school = getVar('school');
$annual_income = intval(getVar('annual_income')); // 档次
$phone_number = getVar('phone_number');
$weixin = getVar('weixin');
$yanzhi = intval(getVar('yanzhi'));

// 择偶条件
$match_age = getVar('match_age'); // 年龄区间
$match_height = getVar('match_height'); // 身高区间
$match_hometown = getVar('match_hometown'); // 家乡
$match_annual_income = getVar('match_annual_income'); // 年收入等级
$match_yanzhi_grade = getVar('match_yanzhi_grade'); // 颜值等级

if (strlen($nickname) < 1) {
    apimessage(1, '没有填写昵称');
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
if (strlen($hometown) < 1) {
    apimessage(1, '没有填写家乡');
}
if (strlen($school) < 1) {
    apimessage(1, '没有填写学校');
}
if ($annual_income < 1) {
    apimessage(1, '没有选择年收入范围');
}
if (strlen($phone_number) < 1) {
    apimessage(1, '没有填写手机号码');
}
if (!preg_match('/^(+?\d{2})?\s?\d{11}$/i', $phone_number)) {
    apimessage(1, '手机号码不正确');
}

$user = array();
$match_list = array();

$sql = "SELECT * FROM act20190520_user WHERE phone_number=?";
$query = $MDB->stmt_query($sql, "s", $phone_number);
if (!$user = $MDB->fetch_array($query)) {
    $user = array();
}

if (empty($user)) {
    $ctime = time();
    $mtime = 0;

    $newarr = array(
        'nickname' => $nickname,
        'age' => $age,
        'gender' => $gender,
        'email' => $email,
        'height' => $height,
        'zhiye' => $zhiye,
        'hometown' => $hometown,
        'school' => $school,
        'annual_income' => $annual_income,
        'phone_number' => $phone_number,
        'weixin' => $weixin,
        'yanzhi' => $yanzhi,
        'match_age' => $match_age,
        'match_height' => $match_height,
        'match_hometown' => $match_hometown,
        'match_annual_income' => $match_annual_income,
        'match_yanzhi_grade' => $match_yanzhi_grade,
        'regip' => $regip,
        'ctime' => $ctime,
        'mtime' => $mtime,
    );

    $tableConf = load_config('tables');
    if (!isset($tableConf[tname('user')])) {
        if (false === generate_table_conf('user', true)) {
            apimessage(110, '生成表的字段类型配置失败');
        }
        $tableConf = load_config('tables', true);;
    }

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

    $sql = "INSERT INTO ".tname('user')."(".implode(',', $fields)." VALUES(".implode(',', $placeholds).")";

    $args = array();
    $args[] = $sql;
    $args[] = implode('', $types);
    $args = array_merge($args, $values);

    // 开启事物
    $MDB->query("START TRANSACTION");

    if (false === call_user_func_array(array($MDB, 'stmt_query'), $args)) {
        $MDB->query("ROLLBACK");
        apimessage(33, '保存资料失败');
    }
    $newarr['uid'] = $MDB->insert_id();

    $user = $newarr;

    // 保存成功 为其匹配异性资料
    $sql = "SELECT uid FROM " . tname('user') . " WHERE ";
    if ($user['match_age']) {

    }

    $MDB->query("COMMIT");
}

// 查找其已经匹配到的异性资料
$sql = "SELECT * FROM " . tname('user_match') . " WHERE master_uid=?";
$query = $MDB->stmt_query($sql, "i", $user['uid']);
while ($match = $MDB->fetch_array($query)) {
    $match_list[$match['match_uid']] = $match['match_uid'];
    $sql = "SELECT nickname,photo_url FROM ".tname('user')." WHERE uid=?";
    $qu = $MDB->stmt_query($sql, "i", $match['match_uid']);
    if ($tmp = $MDB->fetch_array($qu)) {
        $match_list[] = $tmp;
    }
}

apimessage(0, 'succ', $match_list);