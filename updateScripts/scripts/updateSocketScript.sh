#!/bin/bash
pm2=/home/pi/.config/yarn/global/node_modules/pm2/bin/pm2
cd /home/pi/Documents/treeLight/server/
echo =================
echo Installing packages!
yarn --production

echo =================
echo Starting the server!
"$pm2" restart 0 ||
  ("$pm2" delete 0 &&
  "$pm2" start /home/pi/Documents/treeLight/server/lib/index.js --name="piSocket") ||
"$pm2" start /home/pi/Documents/treeLight/server/lib/index.js --name="piSocket"