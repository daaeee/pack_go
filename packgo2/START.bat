@echo off
echo ========================================
echo   Pack&Go - Запуск проекта
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Запуск backend сервера...
echo.
start "Pack&Go Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Открытие frontend в браузере...
echo.
start "" "%~dp0index.html"

echo.
echo ========================================
echo   Проект запущен!
echo ========================================
echo.
echo Backend сервер: http://localhost:3000
echo Frontend: открыт в браузере
echo.
echo Для остановки закройте окно "Pack&Go Backend Server"
echo.
pause

