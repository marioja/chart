@echo off
setlocal
set folder=%~dp0mlab
mkdir "%folder%" 2>nul
set logfile=%folder%\ndt7-client.log
set csvfile=%folder%\ndt7-client.csv
<nul set /p=%date% %time% >>"%logfile%"
"%~dp0ndt7-client" -format json -quiet >>"%logfile%"
powershell -file "%~dp0read-ndt7.ps1"
"%~dp0dbxcli-windows-amd64.exe" put "%logfile%" "/MFJ Shared/ndt7-client.log"
"%~dp0dbxcli-windows-amd64.exe" put "%csvfile%" "/MFJ Shared/ndt7-client.csv"
copy "%csvfile%" "c:\inetpub\wwwroot_public\chart"