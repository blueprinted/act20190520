<?php

/**
 * 生成地区的js文件
 */

require dirname(__FILE__) . '/../common.php';


$resu = get_area_data(0, 2, $list);
//print_r($list);

$jsfile = APP_DATA . "/region.js";
if (defined("JSON_UNESCAPED_UNICODE")) {
    $jsstring = "var regions = " . json_encode($list, JSON_UNESCAPED_UNICODE) . ";";
} else {
    $jsstring = "var regions = " . json_encode($list) . ";";
}

if (false === file_put_contents($jsfile, $jsstring)) {
    format_echo("generate " . basename($jsfile) . " file fail");
    exit;
}
format_echo("generate " . basename($jsfile) . " file succ");

function get_area_data ($parentid = 0, $maxlevel = 4, &$parentList) {
    global $MDB;
    $sql = "SELECT * FROM " . tname('area') . " WHERE parent_id={$parentid} ORDER BY listorder ASC";
    $query = $MDB->query($sql);
    $idx = 0;
    while($area = $MDB->fetch_array($query)) {
        $parentList[$idx] = array(
            'id' => intval($area['id']),
            'name' => $area['name'],
            'short_name' => $area['short_name'],
            'level' => intval($area['level']),
            'children' => array(),
        );
        if (in_array(intval($area['id']), array(110000, 120000, 310000, 500000), true) && $area['level'] < $maxlevel + 1) {
            get_area_data($area['id'], $maxlevel + 1, $parentList[$idx]['children']);
        } elseif ($area['level'] < $maxlevel) {
            get_area_data($area['id'], $maxlevel, $parentList[$idx]['children']);
        }
        $idx++;
    }
    return true;
}

