@echo off
title Online Food Ordering System - Server
echo ========================================================
echo   Starting Online Food Ordering System (OFOS)
echo   Opening: http://localhost:3000
echo ========================================================
timeout /t 2 /nobreak > nul
start http://localhost:3000
node server.js
pause
