<?php

require __DIR__ . "/../common.php";

$startTiem = microtime_float();

$list = get_region(2, 0);

$jsfile = APP_DATA . "/region.js";
if (defined("JSON_UNESCAPED_UNICODE")) {
    $content = "var regions = " . json_encode($list, JSON_UNESCAPED_UNICODE) . ";";
} else {
    $content = "var regions = " . json_encode($list) . ";";
}
if (false === file_put_contents($jsfile, $content)) {
    $msg = "fail";
} else {
    $msg = "succ";
}
format_echo("{$msg} generate complete time used " . format_msec(microtime_float() - $startTiem));

/**
 * @param $max_level Integer 最大层级
 * @param $pid Integer 父ID
 */
function get_region($max_level = 0, $pid = 0) {
    $list = array();
    $db = \mysqliUtil::getInstance('master_act20190520');
    $sql = "SELECT * FROM act20190520_area WHERE parent_id={$pid}";
    if ($max_level > 0) {
        $sql .= " AND level<={$max_level}";
    }
    $sql .= " ORDER BY listorder ASC";
    $query = $db->query($sql);
    while ($area = $db->fetch_array($query)) {
        $area['id'] = intval($area['id']);
        $data = array(
            'id' => $area['id'],
            'name' => $area['name'],
            'short_name' => $area['short_name'],
            'level' => $area['level'],
            'children' => array(),
        );
        $tmp_level = $max_level;
        if (in_array($area['id'], array(110000,120000,310000,500000), true)) {
            $tmp_level = $max_level + 1;
        }
        $data['children'] = get_region($tmp_level, $area['id']);
        $list[] = $data;
    }
    return $list;
}