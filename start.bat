@echo off
title MailLens - Email Management for Marketing Agencies
echo ========================================================
echo        Starting MailLens Platform (Dual Server)
echo ========================================================
echo.

echo Starting Backend Server (Express + MongoDB)...
start "MailLens Backend (Port 5000)" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (React + Vite + Tailwind)...
start "MailLens Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Backend running at:  http://localhost:5000
echo   Frontend running at: http://localhost:5173
echo ========================================================
echo.
echo Launching your browser at http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173
pause
