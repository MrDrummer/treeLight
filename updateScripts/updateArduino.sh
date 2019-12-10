#!/bin/bash
echo =================
echo Deleting the Arduino directory!
[ -d "/home/$USER/treeLight/controller/" ] && rm -r /home/$USER/treeLight/controller/

mkdir -p /home/$USER/treeLight/controller/

cd /mnt/b/treeLight/controller
echo =================
echo Copying the new directory from B:!

cp -r /mnt/b/treeLight/controller/. /home/$USER/treeLight/controller/

echo =================
echo Password needed to upload files
scp -r /home/$USER/treeLight/controller/. pi@10.100.100.214:/home/pi/Documents/treeLight/controller

echo =================
echo Password needed to re-deploy to the arduino
ssh pi@10.100.100.214 "bash -s" < /home/$USER/treeLight/scripts/updateArduinoScript.sh
# ssh pi@10.100.100.214 pm2 delete 0 && pm2 start /home/$USER/treeLight/controller/index.js --name="piSocket"
