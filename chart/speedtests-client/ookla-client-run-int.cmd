@echo off
setlocal
set folder=%~dp0ookla
mkdir "%folder%" 2>nul
set logfile=%folder%\ookla-client.log
set csvfile=%folder%\ookla-client.csv
set header="Date","ServerName","ServerId","Latency","Jitter","PacketLoss","Download","Upload","DownloadBytes","UploadBytes","ShareUrl"
if not exist "%csvfile%" echo %header% >"%csvfile%"
<nul set /p=""%date% %time%"," >>"%csvfile%"
"%~dp0speedtest" -f csv --progress=no >>"%csvfile%"
"%~dp0dbxcli-windows-amd64.exe" put "%csvfile%" "/MFJ Shared/ookla-client.csv"
copy "%csvfile%" "c:\inetpub\wwwroot_public\chart"