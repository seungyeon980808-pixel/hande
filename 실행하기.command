#!/bin/zsh

set -e

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

clear
echo "============================================"
echo "  학교업무 한곳 - 문서 취합 프로토타입"
echo "============================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js가 설치되어 있지 않습니다."
  echo "https://nodejs.org 에서 Node.js 22 이상을 설치한 뒤 다시 실행해 주세요."
  echo ""
  read "?Enter 키를 누르면 종료합니다."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "처음 실행을 준비하고 있습니다. 잠시 기다려 주세요..."
  npm install
fi

echo ""
echo "프로그램 주소: http://localhost:3000"
echo "이 창을 닫으면 프로그램도 종료됩니다."
echo "종료하려면 Control + C를 누르세요."
echo ""

(sleep 2 && open "http://localhost:3000") &
npm run dev
