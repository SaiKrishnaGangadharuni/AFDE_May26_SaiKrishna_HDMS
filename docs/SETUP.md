# HDMS Setup Guide

Step-by-step walkthrough for a fresh machine.

## Prerequisites

| Tool | Min version | Check |
|---|---|---|
| Python | 3.10 | `python --version` |
| Node.js | 18 | `node --version` |
| npm | 9 | `npm --version` |
| git | any recent | `git --version` |

## Step 1 — Clone

```bash
git clone <your-repo-url> AFDE_May26_SaiKrishna_HDMS
cd AFDE_May26_SaiKrishna_HDMS
```

## Step 2 — Backend

### 2a. Virtual environment

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate
```

### 2b. Install Python packages

```bash
pip install -r ../requirements.txt
```

### 2c. Seed the database

```bash
python seed.py
```

Expected output ends with `✓ Seed complete! 15 tickets across 7 categories.`

A new file `hdms.db` (~30 KB) will appear in `backend/`.

### 2d. Start the API server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit **http://localhost:8000/docs** — the Swagger UI should list all 7 endpoints.

## Step 3 — Frontend

In a **new** terminal:

```bash
cd frontend
npm install         # or `npm.cmd install` on Windows if execution policy blocks .ps1
npm run dev         # or `npm.cmd run dev`
```

You'll see `VITE ready` and `Local: http://localhost:5173/`.

## Step 4 — Verify

1. Dashboard shows 15 tickets total, breakdowns by status and priority, 5 recent tickets
2. Click **All Tickets** — table shows all 15 entries
3. Click **Create Ticket** — fill in the form, submit — appears in list and on dashboard
4. Click **Search & Filter** — try `status=Open` or `category=VPN Issue`
5. Click a ticket → **Edit** → change status to Resolved + add notes → Save

## Common issues

### `python` not recognised
Reinstall Python with "Add Python to PATH" checked, or use `py` instead of `python`.

### `uvicorn` not found after install
Make sure venv is active (`(venv)` in prompt). Alternative: `python -m uvicorn main:app --reload --port 8000`.

### Port already in use
Use a different port:
```bash
uvicorn main:app --reload --port 8001
```
Then edit `frontend/vite.config.js` and update the proxy target.

### npm execution policy on Windows
Use `npm.cmd` instead of `npm`. Or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in PowerShell.

### `disk I/O error` from SQLite
Move the project to a regular local folder (not OneDrive/iCloud), or set:
```
DATABASE_URL=sqlite:///C:/temp/hdms.db
```

### CORS errors in the browser
Stop backend, edit `backend/main.py`, add your origin to `allow_origins`, restart.

### Frontend blank page
1. Check browser console (F12) for errors
2. Confirm backend is reachable at http://localhost:8000/docs

## Building Frontend for Production

```bash
cd frontend
npm run build
```

Output in `frontend/dist/` — serve with nginx, vercel, S3, or any static host.

## Switching to PostgreSQL

1. Install PostgreSQL, create database: `createdb hdms`
2. Install driver: `pip install psycopg2-binary`
3. Set: `DATABASE_URL=postgresql://user:pass@localhost:5432/hdms`
4. Run `python seed.py`
