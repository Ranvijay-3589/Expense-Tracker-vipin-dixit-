# Expense Tracker

Single-user web app to quickly add and review daily expenses.

## Features
- Add expense (`date`, `category`, `amount`, `note`)
- View expenses by selected date
- Delete expense
- Category-wise daily totals with grand total

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL (SQLite fallback for local/dev)
- Frontend: React, Axios, TailwindCSS, Vite

## Backend Setup
1. Create `.env` from `.env.example`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Frontend Setup
1. Create `frontend/.env` from `frontend/.env.example`.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run frontend:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/expenses`
- `GET /api/expenses?date=YYYY-MM-DD`
- `DELETE /api/expenses/{id}`
- `GET /api/summary?date=YYYY-MM-DD`

## Run Tests
```bash
pytest
```
