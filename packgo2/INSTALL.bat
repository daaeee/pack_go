@echo off
echo ========================================
echo   Pack&Go - Установка зависимостей
echo ========================================
echo.

cd /d "%~dp0\backend"

if not exist "package.json" (
    echo Ошибка: файл package.json не найден!
    echo Убедитесь, что вы находитесь в правильной папке проекта.
    pause
    exit /b 1
)

echo Установка зависимостей Node.js...
echo Это может занять несколько минут...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Установка завершена успешно!
    echo ========================================
    echo.
    echo Теперь вы можете запустить проект:
    echo   1. Запустите START.bat
    echo   2. Или выполните: cd backend && npm start
    echo.
) else (
    echo.
    echo ========================================
    echo   Ошибка при установке!
    echo ========================================
    echo.
    echo Убедитесь, что Node.js установлен:
    echo   https://nodejs.org/
    echo.
)

pause

