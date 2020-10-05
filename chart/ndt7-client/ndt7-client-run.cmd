@echo off
setlocal
set folder=%~dp0mlab
call "%~dp0ndt7-client-run-int.cmd" >> "%folder%\ndt7-client-run.log" 2>>&1
call "%~dp0ookla-client-run-int.cmd" >> "%folder%\ookla-client-run.log" 2>>&1
