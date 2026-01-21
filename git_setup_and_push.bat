@echo off
echo ========================================
echo   GitHub Setup for Skin Saviour
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>&1
if errorlevel 1 (
    echo Git is not installed or not in PATH.
    echo.
    echo Please:
    echo 1. Download Git from: https://git-scm.com/download/win
    echo 2. Install it with default settings
    echo 3. Restart this terminal and run this script again
    echo.
    pause
    exit /b 1
)

echo Git version:
git --version
echo.

REM Check if already initialized
if exist .git (
    echo Git repository already exists.
    echo.
) else (
    echo Initializing Git repository...
    git init
    echo.
)

REM Configure Git (replace with your details)
echo Please enter your GitHub username:
set /p GITHUB_USER="Username: "
echo.
echo Please enter your email:
set /p GITHUB_EMAIL="Email: "
echo.

git config user.name "%GITHUB_USER%"
git config user.email "%GITHUB_EMAIL%"

echo.
echo Adding files to Git...
git add .
echo.

echo Committing files...
git commit -m "Initial commit: Skin Saviour - AI-powered skin cancer detection app"
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. Go to https://github.com/new
echo 2. Create a new repository named: SkinSaviour
echo 3. Do NOT initialize with README or .gitignore
echo 4. Copy the repository URL
echo.
echo Then run these commands:
echo    git remote add origin https://github.com/%GITHUB_USER%/SkinSaviour.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo You may need to authenticate using a Personal Access Token
echo Create one at: https://github.com/settings/tokens
echo ========================================
pause
