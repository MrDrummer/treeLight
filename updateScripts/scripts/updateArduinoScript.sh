#!/bin/bash

echo =================
echo Compiling
~/arduino-cli compile -b arduino:avr:mega ~/Documents/treeLight/controller

echo =================
echo Uploading
~/arduino-cli upload -p /dev/ttyACM0 -b arduino:avr:mega ~/Documents/treeLight/controller -t
