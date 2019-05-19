<?php

if (!isset($_POST)) {
    apimessage(88, '未识别的请求');
}

$nickname = getVar('nickname');
$gender = intval(getVar('gender'));
$age = intval(getVar('age'));
$email = getVar('email');
$height = intval(getVar('height'));
$zhiye = getVar('zhiye');
$province = getVar('province');
$city = getVar('city');
$county = getVar('county');
$work_province = getVar('work_province');
$work_city = getVar('work_city');
$work_county = getVar('work_county');
$annual_income = intval(getVar('annual_income')); // 档次
$phone_number = getVar('phone_number');
$weixin = getVar('weixin');
$yanzhi = intval(getVar('yanzhi')); //等级
$ques1 = getVar('ques1');
$ques2 = getVar('ques2');
$ques3 = getVar('ques3');
$ques4 = getVar('ques4');
$photo_url = getVar('photo_url');

// 择偶条件
$match_age = intval(getVar('match_age')); // 年龄区间
$match_height = intval(getVar('match_height')); // 身高区间
$match_province = intval(getVar('match_province')); // 家乡省
$match_city = intval(getVar('match_city')); // 家乡市
$match_county = intval(getVar('match_county')); // 家乡县
$match_annual_income = intval(getVar('match_annual_income')); // 年收入等级
$match_yanzhi_grade = intval(getVar('match_yanzhi_grade')); // 颜值等级

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
if (strlen($hometown) < 1) {
    apimessage(1, '没有填写家乡');
}
if (strlen($school) < 1) {
    apimessage(1, '没有填写学校');
}
if ($annual_income < 1) {
    apimessage(1, '没有选择年收入范围');
}
if (!isset($selector_config['annual_income'][$annual_income])) {
    apimessage(1, '年收入范围有误');
}
if (strlen($phone_number) < 1) {
    apimessage(1, '没有填写手机号码');
}
if (!preg_match('/^(+?\d{2})?\s?\d{11}$/i', $phone_number)) {
    apimessage(1, '手机号码不正确');
}

// 校验匹配资料
if ($match_age < 1) {
    apimessage(1, '没选择择偶要求的年龄');
}
if (!isset($selector_config['age_grade'][$match_age])) {
    apimessage(1, '择偶要求年龄不正确');
}

if ($match_height < 1) {
    apimessage(1, '没选择择偶要求的年龄');
}
if (!isset($selector_config['height_grade'][$match_height])) {
    apimessage(1, '择偶要求年龄不正确');
}

if ($match_annual_income < 1) {
    apimessage(1, '没选择择偶要求的收入范围');
}
if (!isset($selector_config['annual_income'][$match_annual_income])) {
    apimessage(1, '择偶要求收入范围不正确');
}

if ($match_yanzhi_grade < 1) {
    apimessage(1, '没选择择偶要求的颜值范围');
}
if (!isset($selector_config['yanzhi_grade'][$match_yanzhi_grade])) {
    apimessage(1, '择偶要求颜值范围不正确');
}

$user = array();
$match_list = array();

$sql = "SELECT * FROM ".tname('user')." WHERE phone_number=?";
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
        'photo_url' => $photo_url,
        'answer1' => $answer1,
        'answer2' => $answer2,
        'answer3' => $answer3,
        'answer4' => $answer4,
        'match_age' => $match_age,
        'match_height' => $match_height,
        'match_province' => $match_province,
        'match_city' => $match_city,
        'match_county' => $match_county,
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

    // 检查是否存在
    $user = array();
    $sql = "SELECT * FROM ".tname('user')." WHERE phone_number=? LIMIT 1";
    $query = $MDB->stmt_query($sql, "s", $phone_number);
    if (!$user = $MDB->fetch_array($query)) {
        $user = array();
    }

    // 开启事物
    $MDB->query("START TRANSACTION");

    if (empty($user)) {
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
    } else {
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

    if (false === call_user_func_array(array($MDB, 'stmt_query'), $args)) {
        $MDB->query("ROLLBACK");
        apimessage(33, '保存资料失败');
    }
    if (empty($user)) {
        $newarr['uid'] = $MDB->insert_id();
        $user = $newarr;
    }

    // 查询一遍用户资料
    $sql = "SELECT * FROM " . tname('user') . " WHERE uid=?";
    $query = $MDB->query($sql, "i", $user['uid']);
    $user = $MDB->fetch_array($query);

    // 保存成功 为其匹配异性资料
    $wheresql = "1";
    $sql = "SELECT uid FROM " . tname('user') . " WHERE ";
    if ($user['gender'] == 1) {
        $wheresql .= " AND gender=2";
    } else {
        $wheresql .= " AND gender=1";
    }
    if ($user['match_age']) {
        if ($user['match_age'] == 1) {
            $wheresql .= " AND age>=18 AND age<=22";
        } elseif ($user['match_age'] == 2) {
            $wheresql .= " AND age>22 AND age<=25";
        } elseif ($user['match_age'] == 3) {
            $wheresql .= " AND age>25 AND age<=30";
        } elseif ($user['match_age'] == 4) {
            $wheresql .= " AND age>30 AND age<=35";
        } elseif ($user['match_age'] == 5) {
            $wheresql .= " AND age>35 AND age<=40";
        } elseif ($user['match_age'] == 6) {
            $wheresql .= " AND age>40 AND age<=45";
        } elseif ($user['match_age'] == 7) {
            $wheresql .= " AND age>45";
        }
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
