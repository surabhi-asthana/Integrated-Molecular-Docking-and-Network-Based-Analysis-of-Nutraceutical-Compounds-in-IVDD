@echo off
cd /d "%~dp0"

echo ==^> Installing frontend dependencies...
call npm install || exit /b 1

echo ==^> Creating Python virtual environment (backend\venv)...
python -m venv backend\venv || exit /b 1
call backend\venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r backend\requirements.txt || exit /b 1

if not exist backend\.env (
  copy backend\.env.example backend\.env >nul
  echo ==^> Created backend\.env - add your GEMINI_API_KEY to it.
)

echo.
echo Done. To run:
echo   Backend : backend\venv\Scripts\activate ^&^& python backend\app.py
echo   Frontend: npm run dev
