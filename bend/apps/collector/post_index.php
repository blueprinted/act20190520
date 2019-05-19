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
    'ctime' => 0,
    'mtime' => 0,
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

// 开启事物
$MDB->query("START TRANSACTION");

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

    $sql = "INSERT INTO ".tname('user')."(".implode(',', $fields)." VALUES(".implode(',', $placeholds).")";

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
    } else {
        $wheresql .= " AND age>45";
    }
}
if ($user['match_height']) {
    if ($user['match_height'] == 1) {
        $wheresql .= " AND height>=140 AND height<=150";
    } elseif ($user['match_height'] == 2) {
        $wheresql .= " AND height>150 AND height<=155";
    } elseif ($user['match_height'] == 3) {
        $wheresql .= " AND height>155 AND height<=165";
    } elseif ($user['match_height'] == 4) {
        $wheresql .= " AND height>165 AND height<=170";
    } elseif ($user['match_height'] == 5) {
        $wheresql .= " AND height>170 AND height<=175";
    } elseif ($user['match_height'] == 6) {
        $wheresql .= " AND height>175 AND height<=180";
    } elseif ($user['match_height'] == 7) {
        $wheresql .= " AND height>180 AND height<=190";
    } else {
        $wheresql .= " AND height>190";
    }
}
if ($user['match_province']) {
    $wheresql .= " AND province='{$user['match_province']}'";
}
if ($user['match_city']) {
    $wheresql .= " AND city='{$user['match_city']}'";
}
if ($user['match_county']) {
    $wheresql .= " AND county='{$user['match_county']}'";
}
if ($user['match_annual_income']) {
    $wheresql .= " AND annual_income='{$user['match_annual_income']}'";
}
if ($user['match_yanzhi_grade']) {
    $wheresql .= " AND yanzhi_grade='{$user['match_yanzhi_grade']}'";
}
$match_uids = array();
$sql = "SELECT uid FROM " . tname('user') . " WHERE {$wheresql} LIMIT " . ACT_MATCH_USER_NUMS;
$query = $MDB->query($sql);
while ($match_user = $MDB->fetch_array($query)) {
    $match_uids[$match_user['uid']] = $match_user['uid'];
}
if (count($match_uids) < ACT_MATCH_USER_NUMS) {
    $diffNums = ACT_MATCH_USER_NUMS - count($match_uids);
    // 需要补足到数量
}

$match_users = array();

// 写入或更新数据到匹配关系表
$nowtime = time();
$regions = array();
$matchPrimaryIds = array();
foreach ($match_uids as $idx => $match_uid) {
    $sql = "SELECT * FROM " . tname('user_match') . " WHERE master_uid='{$user['uid']}' AND match_uid='{$match_uid}'";
    $query = $MDB->query($sql);
    if ($matchData = $MDB->fetch_array($query)) {
        $matchPrimaryIds[$matchData['id']] = $matchData['id'];
        $sql = "UPDATE " . tname('user_match') . " SET mtime='{$nowtime}' WHERE id='{$matchData['id']}'";
        if (!$MDB->query($sql)) {
            $MDB->query("ROLLBACK");
            apimessage(34, '匹配异性失败');
        }
    } else {
        // 需要写入
        $sql = "INSERT INTO " . tname('user_match') . "(master_uid,match_uid,ctime,mtime) VALUES ('{$user['uid']}', '{$match_uid}', '{$nowtime}', '0')";
        if (!$MDB->query($sql)) {
            $MDB->query("ROLLBACK");
            apimessage(35, '匹配异性失败');
        }
        $insertId = $MDB->insert_id();
        $matchPrimaryIds[$insertId] = $insertId;
    }
    $sql = "SELECT uid,nickname,age,height,zhiye,province,city,county,photo_url FROM " . tname('user') . " WHERE uid='{$match_uid}'";
    $query = $MDB->query($sql);
    if ($temp = $MDB->fetch_array($query)) {
        $areaIds = array();
        if (!isset($regions[$temp['province']])) {
            $areaIds[] = $temp['province'];
        }
        if (!isset($regions[$temp['city']])) {
            $areaIds[] = $temp['city'];
        }
        if (!isset($regions[$temp['county']])) {
            $areaIds[] = $temp['county'];
        }
        if ($areaIds) {
            $sql = "SELECT id, name FROM " . tname('area') . " WHERE id IN (" . simplode($areaIds) . ")";
            $query = $MDB->query($sql);
            while ($region = $MDB->fetch_array($query)) {
                $regions[$region['id']] = $region;
            }
        }

        $temp['province_cn'] = $regions[$temp['province']]['name'];
        $temp['city_cn'] = $regions[$temp['city']]['name'];
        $temp['county_cn'] = $regions[$temp['county']]['name'];
        $match_users[] = $temp;
    }
}
// 多余的要删除
$sql = "SELECT COUNT(id) AS cnt FROM " . tname('user_match') . " WHERE master_uid={$user['uid']}";
$matchedNums = $MDB->result($MDB->query($sql), 0, 0);
if ($matchedNums > ACT_MATCH_USER_NUMS) {
    $sql = "DELECT FROM " . tname('user_match') . " WHERE ctime<'{$nowtime}' AND mtime<'{$nowtime}'";
    if (!$MDB->query($sql)) {
        $MDB->query("ROLLBACK");
        apimessage(36, '匹配异性失败');
    }
}

// 全部成功了则提交
$MDB->query("COMMIT");

apimessage(0, 'succ', $match_users);
