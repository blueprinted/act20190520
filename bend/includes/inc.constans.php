<?php

define('APP_AUTHKEY', 'act20190520~!');
define('COOKIE_DOMAIN', isset($_SERVER['HTTP_HOST']) ? (preg_match('/\d{1,3}(\.\d{1,3}){3}/', $_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : ".{$_SERVER['HTTP_HOST']}") : '');
define('COOKIE_PREFIX', 'act20190520_');
define('TIME_SHOW_FORMAT', 'Y/m/d H:i:s');
define('TABLE_PREFIX', 'act20190520_');

define("ACT_MATCH_USER_NUMS", 3);
