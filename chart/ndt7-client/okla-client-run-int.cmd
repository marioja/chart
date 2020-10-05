@echo off
setlocal
set folder=%~dp0okla
mkdir "%folder%" 2>nul
set logfile=%folder%\okla-client.log
set csvfile=%folder%\okla-client.csv
set header="Date","serverName","serverId","latency","jitter","packetLoss","download","upload","downloadBytes","uploadBytes","shareUrl"
if not exist "%csvfile%" echo %header% >"%csvfile%"
<nul set /p=%date% %time% >>"%logfile%"
"%~dp0speedtest" -f csv --progress=no >>"%csvfile%"
"%~dp0dbxcli-windows-amd64.exe" put "%csvfile%" "/MFJ Shared/ookla-client.csv"
copy "%csvfile%" "c:\inetpub\wwwroot_public\chart"