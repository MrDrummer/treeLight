#!/bin/bash
echo =================
echo Compiling
~/arduino-cli compile -b arduino:avr:mega /home/pi/Documents/treeLight/controller

echo =================
echo Uploading
~/arduino-cli upload -p /dev/ttyACM1 -b arduino:avr:mega /home/pi/Documents/treeLight/controller -t -v

