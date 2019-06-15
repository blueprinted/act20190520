# act20190520

目录结构
.
├── bend
│   ├── apps
│   │   ├── api
│   │   ├── collector
│   │   └── index
│   ├── common.php
│   ├── composer.json
│   ├── composer.lock
│   ├── config
│   │   └── config_tables.php
│   ├── cron
│   │   └── generate_region.php
│   ├── data
│   │   ├── act20190520.sql
│   │   ├── data_question.php
│   │   ├── data_selector_config.php
│   │   ├── region.bak.js
│   │   ├── region.js
│   │   ├── session
│   │   └── upload
│   ├── doc
│   │   └── tables.sql
│   ├── includes
│   │   ├── SmsMultiSender.php
│   │   ├── SmsSenderUtil.php
│   │   ├── SmsSingleSender.php
│   │   ├── class.curlUtil.php
│   │   ├── class.mysqliUtil.php
│   │   ├── class.sessionHandle.php
│   │   ├── class.uploadUtil.php
│   │   ├── class.verify.php
│   │   ├── config.db.php
│   │   ├── func.common.php
│   │   ├── func.user.php
│   │   ├── inc.constans.php
│   │   └── verify
│   ├── index.php
│   ├── log
│   │   ├── 201905
│   │   ├── 201906
│   │   └── shutdown_handler
│   ├── util
│   │   ├── generateArea.php
│   │   └── sendCodeTest.php
│   └── vendor
│       ├── autoload.php
│       ├── composer
│       ├── monolog
│       └── psr
├── index.html
└── static

如下的目录要设置成 777 权限
bend/config
bend/data
bend/data/upload
bend/data/upload/uploadImages
bend/data/session
bend/log
bend/log/shutdown_handler

项目的session会话信息存放的目录
bend/data/session
建议
session.cookie_lifetime
session.gc_maxlifetime
这两个值配置大一点，比如 43200秒或86400秒
