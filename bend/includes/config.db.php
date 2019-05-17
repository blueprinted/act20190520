<?php

//DB配置文件

global $_DBCFG;

$_DBCFG['master_act20190520'] = array(
	'host' => '127.0.0.1',
	'port' => '3306',
	'user' => 'root',
	'pass' => '19880117zcZC!',
	'dbname' => 'act20190520',
	'charset' => 'utf8',
);

if(ENVIRONMENT != 'product') {
	foreach($_DBCFG as $key => $value) {
		$_DBCFG[$key] = array(
			'host' => '127.0.0.1',
			'port' => '3306',
			'user' => 'root',
			'pass' => '19880117zcZC!',
			'dbname' => 'act20190520',
			'charset' => 'utf8',
		);
	}
}
