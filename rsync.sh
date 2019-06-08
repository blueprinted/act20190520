#!/bin/sh

basepath=$(cd `dirname $0`; pwd)
user=`whoami`

rsync -avzl --timeout=5 --exclude=*.svn --exclude=*.git --exclude=*.gitignore --exclude=.DS_Store -e "ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem" ${basepath}/dist/*  root@129.28.120.42:/search/www/public/act20190520/
