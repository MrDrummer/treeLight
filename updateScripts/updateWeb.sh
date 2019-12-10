#!/bin/bash
echo =================
echo Deleting the Subsystem Public directory!
[ -d "/home/$USER/treeLight/public/" ] && rm -r /home/$USER/treeLight/public/

mkdir -p /home/$USER/treeLight/public/dist/

cd /mnt/b/treeLight/public
echo =================
echo Copying the new directory from B:!

cp -r /mnt/b/treeLight/public/dist/. /home/$USER/treeLight/public/dist/

echo =================
echo Password needed to upload files
scp -r /home/$USER/treeLight/public/dist/spa/. pi@10.100.100.214:/var/www/html

echo =================
echo Password needed to restart server
ssh pi@10.100.100.214 sudo /etc/init.d/lighttpd restart
