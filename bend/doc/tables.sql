
---
--- 用户信息表
---
CREATE TABLE `act20190520_user` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `nickname` varchar(32) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `age` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '用户年龄',
  `gender` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户性别 0:unknown 1:male 2:female',
  `email` varchar(64) NOT NULL DEFAULT '' COMMENT '用户邮箱',
  `height` smallint(3) unsigned NOT NULL DEFAULT '0' COMMENT '身高,单位cm',
  `zhiye` varchar(255) NOT NULL DEFAULT '' COMMENT '职业',
  `hometown` varchar(255) NOT NULL DEFAULT '' COMMENT '家乡',
  `school` varchar(255) NOT NULL DEFAULT '' COMMENT '学校',
  `annual_income` varchar(255) NOT NULL DEFAULT '' COMMENT '年收入档次',
  `phone_number` varchar(16) NOT NULL DEFAULT '' COMMENT '手机号',
  `weixin` varchar(64) NOT NULL DEFAULT '' COMMENT '微信号',
  `yanzhi` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '颜值',
  `yanzhi_grade` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '颜值档次',
  `photo_url` varchar(255) NOT NULL DEFAULT '' COMMENT '照片地址',
  `match_age` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的年龄档次',
  `match_height` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的身高档次',
  `match_hometown` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的家乡范围',
  `match_annual_income` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的年收入档次',
  `match_yanzhi_grade` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的颜值区间',
  `regip` varchar(16) NOT NULL DEFAULT '' COMMENT '注册ip',
  `ctime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `mtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`uid`),
  KEY `nickname` (`nickname`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `ctime` (`ctime`,`mtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

---
--- 用户匹配表
---
CREATE TABLE `act20190520_user_match` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `master_uid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主uid',
  `match_uid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '匹配到的uid',
  `ctime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '匹配时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_key` (`master_uid`,`match_uid`),
  KEY `ctime` (`ctime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
