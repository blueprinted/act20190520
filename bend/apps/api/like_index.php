<?php

if (!isset($_POST)) {
    apimessage(88, '未识别的请求');
}

$uid = isset($_SESSION['uid']) ? $_SESSION['uid'] : 0;
if ($uid < 1) {
    apimessage(1, '您提交的资料已经失效请重新提交');
}

$match_uid = intval(getVar('match_uid'));

$sql = "SELECT * FROM " . tname('user_match') . " WHERE master_uid=? AND match_uid=?";
$query = $MDB->stmt_query($sql, "ii", $uid, $match_uid);
if (!$match_user = $MDB->fetch_array($query)) {
    apimessage(2, '点赞的目标不存在');
}

$liked = 0;
if ($match_user['liked']) {
    $liked = 0;
} else {
    $liked = 1;
}

$sql = "UPDATE " .  tname('user_match') . " SET liked={$liked} WHERE id={$match_user['id']}";
if (!$MDB->query($sql)) {
    apimessage(3, '点赞失败');
}
apimessage(0, 'succ', $liked);
