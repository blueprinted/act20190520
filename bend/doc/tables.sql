
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
  `province` mediumint(8) NOT NULL DEFAULT '0' COMMENT '家乡省',
  `city` mediumint(8) NOT NULL DEFAULT '0' COMMENT '家乡市',
  `county` mediumint(8) NOT NULL DEFAULT '0' COMMENT '家乡县',
  `work_province` mediumint(8) NOT NULL DEFAULT '0' COMMENT '工作省',
  `work_city` mediumint(8) NOT NULL DEFAULT '0' COMMENT '工作市',
  `work_county` mediumint(8) NOT NULL DEFAULT '0' COMMENT '工作县',
  `school` varchar(255) NOT NULL DEFAULT '' COMMENT '学校',
  `annual_income` varchar(255) NOT NULL DEFAULT '' COMMENT '年收入档次',
  `phone_number` varchar(16) NOT NULL DEFAULT '' COMMENT '手机号',
  `weixin` varchar(64) NOT NULL DEFAULT '' COMMENT '微信号',
  `yanzhi` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '颜值',
  `yanzhi_grade` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '颜值档次',
  `photo_url` varchar(255) NOT NULL DEFAULT '' COMMENT '照片地址',
  `answer1` varchar(4) NOT NULL DEFAULT '' COMMENT '问题1的答案',
  `answer2` varchar(4) NOT NULL DEFAULT '' COMMENT '问题2的答案',
  `answer3` varchar(4) NOT NULL DEFAULT '' COMMENT '问题3的答案',
  `answer4` varchar(4) NOT NULL DEFAULT '' COMMENT '问题4的答案',
  `match_age` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的年龄档次',
  `match_height` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的身高档次',
  `match_province` mediumint(8) NOT NULL DEFAULT '0' COMMENT '择偶要求的省',
  `match_city` mediumint(8) NOT NULL DEFAULT '0' COMMENT '择偶要求的市',
  `match_county` mediumint(8) NOT NULL DEFAULT '0' COMMENT '择偶要求的县',
  `match_annual_income` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的年收入档次',
  `match_yanzhi_grade` varchar(255) NOT NULL DEFAULT '' COMMENT '择偶要求的颜值区间',
  `likenum` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '被点赞数',
  `regip` varchar(16) NOT NULL DEFAULT '' COMMENT '注册ip',
  `ctime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `mtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `nickname` (`nickname`),
  KEY `ctime` (`ctime`,`mtime`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
INSERT INTO `act20190520_user` VALUES (1,'李逍遥',26,1,'',182,'神仙',110000,110100,110101,110000,110100,110101,'天宫大学','0','13800000001','lixiaoyao',10,4,'upload/uploadImages/huge.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(2,'白子画',28,1,'',178,'神仙',110000,110100,110101,110000,110100,110101,'天宫大学','0','13800000002','baizihua',10,4,'upload/uploadImages/huojianhua.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(3,'明诚',27,1,'',180,'凡人',110000,110100,110101,110000,110100,110101,'地宫大学','0','13800000003','mingcheng',10,4,'upload/uploadImages/huojianhua.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(4,'赵灵儿',18,2,'',172,'神仙',110000,110100,110101,110000,110100,110101,'天宫大学','0','13800000004','zhaolinger',10,4,'upload/uploadImages/liuyifei.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(5,'花千骨',18,2,'',168,'神仙',110000,110100,110101,110000,110100,110101,'天宫大学','0','13800000005','huaqiangu',10,4,'upload/uploadImages/zhaoliying.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(6,'陆雪琪',18,2,'',168,'神仙',110000,110100,110101,110000,110100,110101,'天宫大学','0','13800000006','luxueqi',10,4,'upload/uploadImages/yangzi.jpeg','A','A','A','A','0','0',110000,110100,110101,'0','0',0,'0.0.0.0',1560274308,0),(7,'tuster',26,1,'',168,'工人',110000,110100,110105,110000,110100,110105,'北京','4','13811280234','weixin',2,2,'upload/uploadImages/201906/12/201906120159189367Cb2p49Z.png','B','B','A','B','5','6',110000,110100,110105,'5','4',0,'::1',1560275958,1560280665);

---
--- 用户匹配表
---
CREATE TABLE `act20190520_user_match` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `master_uid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主uid',
  `match_uid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '匹配到的uid',
  `liked` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否点赞',
  `ctime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '匹配时间',
  `mtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_key` (`master_uid`,`match_uid`),
  KEY `ctime` (`ctime`,`mtime`),
  KEY `mtime` (`mtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

---
--- 中国行政区域表
---
CREATE TABLE `act20190520_area` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父级id',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',
  `short_name` varchar(50) NOT NULL DEFAULT '' COMMENT '简称',
  `longitude` float NOT NULL DEFAULT '0' COMMENT '经度',
  `latitude` float NOT NULL DEFAULT '0' COMMENT '纬度',
  `level` int(1) NOT NULL DEFAULT '0' COMMENT '等级(1省/直辖市,2地级市,3区县,4镇/街道)',
  `listorder` int(3) NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '状态(0禁用/1启用)',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `short_name` (`short_name`)
) ENGINE=InnoDB AUTO_INCREMENT=659004503 DEFAULT CHARSET=utf8;
