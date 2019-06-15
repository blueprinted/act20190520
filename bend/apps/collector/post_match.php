<?php

if (!isset($_POST)) {
    apimessage(88, '未识别的请求');
}

$uid = isset($_SESSION['uid']) ? $_SESSION['uid'] : 0;
if ($uid < 1) {
    apimessage(1, '您提交的资料已经失效请重新提交');
}

$tableConf = load_config('tables');
if (!isset($tableConf[tname('user')])) {
    if (false === generate_table_conf('user', true)) {
        apimessage(110, '生成表的字段类型配置失败');
    }
    $tableConf = load_config('tables', true);;
}

// 检查是否存在
$user = array();
$sql = "SELECT * FROM ".tname('user')." WHERE uid=?";
$query = $MDB->stmt_query($sql, "i", $uid);
if (!$user = $MDB->fetch_array($query)) {
    $user = array();
}

if (empty($user)) {
    apimessage(2, '用户不存在');
}

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


if (!isset($selector_config['age_grade'][$match_age])) {
    apimessage(3, '选择的年龄范围有误');
}
if (!isset($selector_config['height_grade'][$match_height])) {
    apimessage(4, '选择的身高范围有误');
}
if (!isset($selector_config['annual_income'][$match_annual_income])) {
    apimessage(5, '选择的年收入范围有误');
}
if (!isset($selector_config['yanzhi_grade'][$match_yanzhi_grade])) {
    apimessage(6, '选择的颜值分数范围有误');
}

$newarr = array(
    'match_age' => $match_age,
    'match_height' => $match_height,
    'match_province' => $match_province,
    'match_city' => $match_city,
    'match_county' => $match_county,
    'match_annual_income' => $match_annual_income,
    'match_yanzhi_grade' => $match_yanzhi_grade,
    'mtime' => time(),
);

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

// 开启事物
$MDB->query("START TRANSACTION");

if (false === call_user_func_array(array($MDB, 'stmt_query'), $args)) {
    $MDB->query("ROLLBACK");
    apimessage(7, '保存资料失败');
}
// 提交
$MDB->query("COMMIT");

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
    $maleList = array(1,2,3);
    $femaleList = array(4,5,6);
    $diffNums = ACT_MATCH_USER_NUMS - count($match_uids);
    // 需要补足到数量
    $cup = array();
    if ($user['gender'] == 1) {
        $cup = $femaleList;
    } else {
        $cup = $maleList;
    }
    foreach ($cup as $idx => $val) {
        if (!isset($match_uids[$val]) && count($match_uids) < ACT_MATCH_USER_NUMS) {
            $match_uids[$val] = $val;
        }
    }
}

$match_users = array();

// 写入或更新数据到匹配关系表
$nowtime = time();
$regions = array();
$matchPrimaryIds = array();
$likes = array();
foreach ($match_uids as $idx => $match_uid) {
    $sql = "SELECT * FROM " . tname('user_match') . " WHERE master_uid='{$user['uid']}' AND match_uid='{$match_uid}'";
    $query = $MDB->query($sql);
    if ($matchData = $MDB->fetch_array($query)) {
        $matchPrimaryIds[$matchData['id']] = $matchData['id'];
        $sql = "UPDATE " . tname('user_match') . " SET mtime='{$nowtime}' WHERE id='{$matchData['id']}'";
        if (!$MDB->query($sql)) {
            apimessage(8, '匹配异性失败');
        }
        $likes[$match_uid] = intval($matchData['liked']);
    } else {
        // 需要写入
        $sql = "INSERT INTO " . tname('user_match') . "(master_uid,match_uid,ctime,mtime) VALUES ('{$user['uid']}', '{$match_uid}', '{$nowtime}', '0')";
        if (!$MDB->query($sql)) {
            apimessage(9, '匹配异性失败');
        }
        $insertId = $MDB->insert_id();
        $matchPrimaryIds[$insertId] = $insertId;
        $likes[$match_uid] = 0;
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
        $temp['liked'] = $likes[$match_uid];
        $match_users[] = $temp;
    }
}
// 多余的要删除
$sql = "SELECT COUNT(id) AS cnt FROM " . tname('user_match') . " WHERE master_uid={$user['uid']}";
$matchedNums = $MDB->result($MDB->query($sql), 0, 0);
if ($matchedNums > ACT_MATCH_USER_NUMS) {
    $sql = "DELETE FROM " . tname('user_match') . " WHERE master_uid='{$user['uid']}' AND ctime<'{$nowtime}' AND mtime<'{$nowtime}'";
    if (!$MDB->query($sql)) {
        apimessage(10, '匹配异性失败');
    }
}

apimessage(0, '提交成功', $match_users);
