#!/bin/bash
echo =================
echo Deleting the Subsystem Server directory!
[ -d "/home/$USER/treeLight/server/" ] && rm -r /home/$USER/treeLight/server/

mkdir -p /home/$USER/treeLight/server/lib/

cd /mnt/b/treeLight/server
echo =================
echo Copying the new directory from B:!

cp -r /mnt/b/treeLight/server/lib/. /home/$USER/treeLight/server/lib/
cp /mnt/b/treeLight/server/package.json /home/$USER/treeLight/server/

# echo =================
# echo Password needed to delete existing files from the pi
# ssh pi@10.100.100.214 rm -r /home/pi/Documents/treeLight/server/lib

echo =================
echo Password needed to upload files
scp -r /home/$USER/treeLight/server/. pi@10.100.100.214:/home/pi/Documents/treeLight/server/

echo =================
echo Password needed to restart server
ssh pi@10.100.100.214 "bash -s" < /home/$USER/treeLight/scripts/updateSocketScript.sh
