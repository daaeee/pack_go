@echo off
echo Creating ZIP archive of packgo3 project...
cd /d "%~dp0\.."
powershell -Command "Compress-Archive -Path 'packgo3' -DestinationPath 'packgo3.zip' -Force"
if exist packgo3.zip (
    echo Archive created successfully: packgo3.zip
) else (
    echo Failed to create archive
)
pause

