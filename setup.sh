#!/usr/bin/env bash
# One-shot setup: installs frontend (npm) and backend (pip) dependencies.
set -e
cd "$(dirname "$0")"

echo "==> Installing frontend dependencies..."
npm install

echo "==> Creating Python virtual environment (backend/venv)..."
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "==> Created backend/.env - add your GEMINI_API_KEY to it."
fi

echo
echo "Done. To run:"
echo "  Backend : source backend/venv/bin/activate && python backend/app.py"
echo "  Frontend: npm run dev"
