@ECHO OFF
wsl cp -r /mnt/b/treeLight/updateScripts/. ~/treeLight
GOTO:%~1 2>NUL
IF ERRORLEVEL 1 (
	ECHO Invalid argument: %1
	ECHO.
	ECHO Usage:  %~n0  number
	ECHO.
	ECHO Where:  Argument may be arduino, public, server or only
	GOTO:EOF
)

:public
  echo =================
  echo Updating the website!
  B:
  cd B:/treeLight/public
  quasar build & cd B:/treeLight & wsl ~/treeLight/updateWeb.sh

:server
  echo =================
  echo Updating the WebSocket server!
  B:
  cd B:/treeLight/server
  tsc & cd B:/treeLight & wsl ~/treeLight/updateSocket.sh

:arduino
  echo =================
  echo Updating the Arduino!
  B:
  cd B:/treeLight/controller
  cd B:/treeLight & wsl ~/treeLight/updateArduino.sh
