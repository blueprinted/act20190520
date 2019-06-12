#!/bin/sh

basepath=$(cd `dirname $0`; pwd)
user=`whoami`

##ssh -i /Users/endloop/Public/ShellAlias/bootkey.pem root@129.28.120.42 "rm -rf /search/www/public/act20190520/* && exit"
rsync -avzl --timeout=5 --exclude=.svn --exclude=.git --exclude=.gitignore --exclude=.DS_Store -e "ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem" ${basepath}/dist/  root@129.28.120.42:/search/www/public/act20190520/
ssh -i /Users/endloop/Public/ShellAlias/bootkey.pem root@129.28.120.42 "chown -R nobody:nobody /search/www/public/act20190520/bend/config && chown -R nobody:nobody /search/www/public/act20190520/bend/data && chown -R nobody:nobody /search/www/public/act20190520/bend/log && exit"
echo "rsync done"

