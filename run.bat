@echo off
echo ========================================
echo   Skin Saviour - Starting Application
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo [1/3] Checking Python installation...
python --version
echo.

echo [2/3] Installing/Updating dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/3] Starting Skin Saviour application...
echo.
echo ========================================
echo   Application will start at:
echo   http://localhost:5000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause

