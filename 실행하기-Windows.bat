@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

title SchoolFlow
echo ============================================
echo   SchoolFlow - 학교업무 웹앱
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js가 설치되어 있지 않습니다.
  echo https://nodejs.org 에서 Node.js 22 이상을 설치한 뒤 다시 실행해 주세요.
  echo.
  pause
  exit /b 1
)

for /f %%V in ('node -p "process.versions.node.split('.')[0]"') do set "NODE_MAJOR=%%V"
if %NODE_MAJOR% LSS 22 (
  echo 현재 Node.js 버전이 너무 낮습니다.
  echo https://nodejs.org 에서 Node.js 22 이상으로 업데이트해 주세요.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo 처음 실행을 준비하고 있습니다. 잠시 기다려 주세요...
  call npm install
  if errorlevel 1 (
    echo.
    echo 필요한 파일을 설치하지 못했습니다. 인터넷 연결을 확인해 주세요.
    pause
    exit /b 1
  )
)

if not exist "vendor\rhwp-studio\node_modules\" (
  echo 한글 편집기를 준비하고 있습니다. 잠시 기다려 주세요...
  call npm --prefix vendor\rhwp-studio install
  if errorlevel 1 (
    echo.
    echo 한글 편집기를 설치하지 못했습니다. 인터넷 연결을 확인해 주세요.
    pause
    exit /b 1
  )
)

echo.
echo 이 컴퓨터: http://localhost:3000
echo 같은 네트워크에서는 ipconfig에 표시되는 IPv4 주소의 3000번 포트로 접속하세요.
echo 이 창을 닫으면 프로그램도 종료됩니다.
echo 종료하려면 Ctrl+C를 누르세요.
echo.

start "rHWP Studio" /b cmd /c "npm --prefix vendor\rhwp-studio run dev -- --host 0.0.0.0"
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"
call npm run dev -- --hostname 0.0.0.0

if errorlevel 1 (
  echo.
  echo 프로그램이 예기치 않게 종료되었습니다.
  pause
)
