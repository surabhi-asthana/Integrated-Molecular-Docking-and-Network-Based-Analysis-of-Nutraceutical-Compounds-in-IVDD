# DiscNet: Integrated Molecular Docking and Network-Based Analysis of Nutraceutical Compounds in IVDD

A web platform for exploring molecular docking results, ADMET properties, protein targets and pathways of nutraceutical compounds in intervertebral disc degeneration (IVDD).

- **Frontend:** React + Vite (runs on http://localhost:5173)
- **Backend:** Flask + Google Gemini (runs on http://localhost:5000), powers the "DiscNet AI" assistant

## Project structure

```
.
├── backend/
│   ├── app.py               # Flask API
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # YOU create this (not in git), holds your API key
├── public/                  # PDB structures, images
├── src/                     # React source code
├── package.json             # Node dependencies
├── setup.sh                 # One-command setup (macOS / Linux)
├── setup.bat                # One-command setup (Windows)
└── README.md
```

## Prerequisites

Install these first (the setup scripts cannot install them for you):

| Tool    | Version                          | Check with       |
|---------|----------------------------------|------------------|
| Node.js | 20.19+ or 22.12+ (includes npm)  | `node -v`        |
| Python  | 3.9 or newer                     | `python --version` (Windows) / `python3 --version` (Mac/Linux) |
| Git     | any recent version               | `git --version`  |

You also need a **Gemini API key** from https://aistudio.google.com/apikey

## Quick install (recommended)

### Windows

Open Command Prompt or PowerShell in the project folder and run:

```
setup.bat
```

### macOS / Linux

```
chmod +x setup.sh
./setup.sh
```

The script will:
1. Run `npm install` (frontend packages)
2. Create a Python virtual environment at `backend/venv`
3. Install the packages from `backend/requirements.txt`
4. Create a placeholder `backend/.env` file (if one does not exist)

## Create the `.env` file (API key)

The `.env` file is **not included in the repository** because it contains a secret. You must create it yourself.

Create a file named exactly `.env` inside the `backend/` folder (next to `app.py`) with this single line:

```
GEMINI_API_KEY=your_real_key_here
```

(The setup scripts create this file with a placeholder if it is missing. Just open it and replace the placeholder with your real key.)

The backend will not start without it. Never commit this file (it is already listed in `.gitignore`).

## Manual install (if you prefer not to use the scripts)

### Windows

```
npm install

python -m venv backend\venv
backend\venv\Scripts\activate
pip install -r backend\requirements.txt
echo GEMINI_API_KEY=your_real_key_here> backend\.env
```

### macOS / Linux

```
npm install

python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
echo "GEMINI_API_KEY=your_real_key_here" > backend/.env
```

## Running the project

You need **two terminals**, both opened in the project root.

**Terminal 1: backend**

Windows:
```
backend\venv\Scripts\activate
python backend\app.py
```

macOS / Linux:
```
source backend/venv/bin/activate
python backend/app.py
```

**Terminal 2: frontend**

```
npm run dev
```

Then open the URL shown in the terminal (normally http://localhost:5173).

## Other commands

| Command           | Purpose                          |
|-------------------|----------------------------------|
| `npm run build`   | Create a production build        |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | Run ESLint                       |

## Troubleshooting

- **`npm install` shows "Unsupported engine" warnings or fails:** your Node.js is too old. Install Node 20.19+ or 22.12+.
- **`python` or `python3` not found:** install Python and, on Windows, tick "Add Python to PATH" in the installer.
- **PowerShell blocks `activate`:** run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use Command Prompt instead.
- **`GEMINI_API_KEY not found in .env file`:** make sure the file is named exactly `.env` (not `.env.txt`) and is inside the `backend/` folder.
- **AI chat does not respond:** confirm the backend terminal is running and shows no errors, and that your API key is valid.
- **Port already in use:** close the other program using port 5000 or 5173, or change the port.
