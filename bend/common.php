<?php

define('APP_ROOT', dirname(__FILE__));
define('APP_DATA', APP_ROOT."/data");
define('APP_LOG', APP_ROOT."/log");
define('APP_CONFIG', APP_ROOT."/config");
define('APP_MODULE', APP_ROOT."/apps");
define('ENVIRONMENT', 'development'); // development / dev / test / product
define('APP_MSG_HEAD', "return '['.date('Y/m/d H:i:s').' '.date_default_timezone_get().'] ';");
define('APP_BR', strtolower(substr(PHP_SAPI, 0, 3)) == 'cli' ? PHP_EOL : "<br/>");
define('APP_API_DIR', APP_ROOT.'/../api');
define('APP_START_TIME', time());
define("__MSG_HEAD", "return '['.date('Y/m/d H:i:s').' '.date_default_timezone_get().'] ';");
define('USER_AGENT', 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36');

date_default_timezone_set('PRC');

if (ENVIRONMENT == 'product') {
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
    ini_set("display_errors", "On");
} else {
    error_reporting(E_ALL);
    ini_set("display_errors", "On");
}

require APP_ROOT . '/includes/inc.constans.php';
require APP_ROOT . '/includes/func.common.php';
require APP_ROOT . '/includes/config.db.php';
require APP_ROOT . '/includes/class.curlUtil.php';
require APP_ROOT . '/includes/class.mysqliUtil.php';
require APP_ROOT . '/includes/class.uploadUtil.php';
require APP_ROOT . '/includes/class.sessionHandle.php';
require APP_ROOT . '/includes/class.verify.php';
require APP_ROOT . '/includes/SmsSenderUtil.php';
require APP_ROOT . '/includes/SmsMultiSender.php';
require APP_ROOT . '/includes/SmsSingleSender.php';
require APP_ROOT . '/vendor/autoload.php';

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

function format_echo($msg)
{
    echo eval(APP_MSG_HEAD) . $msg . APP_BR;
}
/**
 * 用于注册register_shutdown_function的shutdown回调函数
 * 主要用于发送脚本运行情况，在线调试等信息
 */
function shutDownHandler()
{
    //处理脚本PHP错误
    $error = error_get_last();
    if (is_null($error)) {
        return false;
    }

    $errorTypeArr = array (
        E_ERROR              => 'E_ERROR',
        E_WARNING            => 'E_WARNING',
        E_PARSE              => 'E_PARSE',
        E_NOTICE             => 'E_NOTICE',
        E_CORE_ERROR         => 'E_CORE_ERROR',
        E_CORE_WARNING       => 'E_CORE_WARNING',
        E_COMPILE_ERROR      => 'E_COMPILE_ERROR',
        E_COMPILE_WARNING    => 'E_COMPILE_WARNING',
        E_USER_ERROR         => 'E_USER_ERROR',
        E_USER_WARNING       => 'E_USER_WARNING',
        E_USER_NOTICE        => 'E_USER_NOTICE',
        E_STRICT             => 'E_STRICT',
        E_RECOVERABLE_ERROR  => 'E_RECOVERABLE_ERROR',
        E_DEPRECATED         => 'E_DEPRECATED',
        E_USER_DEPRECATED    => 'E_USER_DEPRECATED',
    );
    if (empty($error) || !array_key_exists($error['type'], $errorTypeArr)) {
        // This error code is not included in error_reporting
        format_echo("This error code is not included in error_reporting:" . json_encode($error));
        return false;
    }
    $errorType = $errorTypeArr[$error['type']];
    $errstr = strip_tags($error['message']);
    $myerror = "$errstr <br>File：{$error['file']} <br>Line：{$error['line']}";
    $myerror = 'Type：<strong>['.$errorType.']</strong><br>' . $myerror;
    appendlog('php_error[' . $errorType . '] ' . $myerror, 'warning');
    return true;
}
//注册shutdown函数
register_shutdown_function('shutDownHandler');

$sessionHandle = new \sessionHandle();
session_set_save_handler(
    array(&$sessionHandle, "open"), 
    array(&$sessionHandle, "close"), 
    array(&$sessionHandle, "read"), 
    array(&$sessionHandle, "write"), 
    array(&$sessionHandle, "destroy"), 
    array(&$sessionHandle, "gc")
);
session_save_path(APP_DATA."/session");
session_start();

$MDB = \mysqliUtil::getInstance('master_act20190520');

/**
 * 记录日志
 */
function appendlog($logmsg, $logtype = 'warning') {
    $logtype = strtolower($logtype);
    $logDir = APP_LOG . "/" . date('Ym');
    mkdir_recursive($logDir, 0775);
    $logFile = date('Ymd') . '_run.log';
    $logger = new Logger('bookingPro');
    $logger->pushHandler(new StreamHandler("{$logDir}/{$logFile}", Logger::DEBUG));
    if ($logtype == 'debug') {
        $logger->debug($logmsg);
    } elseif ($logtype == 'info') {
        $logger->info($logmsg);
    } elseif ($logtype == 'notice') {
        $logger->notice($logmsg);
    } elseif ($logtype == 'warning') {
        $logger->warning($logmsg);
    } elseif ($logtype == 'error') {
        $logger->error($logmsg);
    } elseif ($logtype == 'critical') {
        $logger->critical($logmsg);
    } elseif ($logtype == 'alert') {
        $logger->alert($logmsg);
    } elseif ($logtype == 'emergency') {
        $logger->emergency($logmsg);
    } else {
        $logger->debug($logmsg);
    }
}

function get_curl_common_header()
{
    return array(
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding: gzip, deflate, br",
        "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,fr;q=0.6,de;q=0.5,ja;q=0.4",
        "Cache-Control: no-cache",
    );
}
