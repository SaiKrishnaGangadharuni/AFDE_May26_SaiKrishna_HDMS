# Helpdesk Ticket Management System (HDMS)

> **Capstone Phase 1** — Centralised web-based application for creating, tracking, updating, and searching internal IT support tickets.

---

## 1. Project Overview

HDMS digitises the support lifecycle that today is typically handled through emails, spreadsheets, and chat messages. Employees raise tickets with category, priority, and description; support administrators update status and add resolution notes; everyone can search and filter the historical ticket repository.

The architecture is intentionally scalable so Phase 2 can layer on:
- Data Engineering pipelines
- Analytics dashboards
- AI-powered semantic search
- RAG-based enterprise support assistants

## 2. Features Implemented (Phase 1)

Each numbered item maps to a specific functional requirement in the project specification.

| # | Feature | Spec Reference |
|---|---|---|
| 1 | Create support tickets (5 fields) | Section 6.1 |
| 2 | View all tickets + ticket details + creation timestamp | Section 6.2 |
| 3 | Update ticket status, modify details, add resolution notes | Section 6.3 |
| 4 | Delete tickets | Section 6.4 |
| 5 | Keyword search + category & status filtering | Section 6.5 |
| 6 | 5 frontend pages (Dashboard, Create, List, Detail, Search) | Section 11.1 |
| 7 | 6 REST endpoints + CORS middleware | Section 12, Table 2 |
| 8 | Form validation, exception handling | Section 11.2, Section 16 |

## 3. Technology Stack (Section 19)

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) · React Router · Tailwind CSS · Axios |
| Backend | FastAPI · SQLAlchemy 2 · Pydantic v2 |
| Database | SQLite (default) — PostgreSQL ready |
| Tooling | Python 3.10+ · Node 18+ · npm · Postman · GitHub |

## 4. Repository Structure

Matches the layout suggested in spec section 15:

```
AFDE_May26_SaiKrishna_HDMS/
├── backend/
│   ├── main.py            # FastAPI app + CORS + /search endpoint
│   ├── database.py        # SQLAlchemy engine + session
│   ├── models.py          # Ticket ORM model + enum lists
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── crud.py            # Reusable DB operations
│   ├── routers/
│   │   └── tickets.py     # /tickets endpoints
│   ├── services/          # (reserved for future business logic)
│   ├── seed.py            # Populate DB with sample tickets
│   ├── .env.example
│   └── hdms.db            # SQLite file (after first seed/run)
├── frontend/
│   ├── src/
│   │   ├── components/    # Layout, Badges (status, priority)
│   │   ├── pages/         # Dashboard, TicketList, TicketNew, TicketDetail, TicketEdit, Search
│   │   ├── services/      # api.js (axios client)
│   │   ├── App.jsx        # Router
│   │   └── main.jsx       # React bootstrap
│   ├── index.html
│   ├── vite.config.js     # Proxies /tickets and /search to backend
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── database/
│   ├── schema.sql         # DDL with CHECK constraints
│   ├── sample-data.sql
│   ├── er-diagram.md
│   └── README.md
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── TESTING_GUIDE.md
├── screenshots/
├── README.md
├── requirements.txt
└── .gitignore
```

## 5. Setup Instructions

### 5.1 Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

pip install -r ../requirements.txt
python seed.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API live at:
- **Swagger UI:** http://localhost:8000/docs
- **Redoc:** http://localhost:8000/redoc

### 5.2 Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Vite proxies API calls to the backend at port 8000.

## 6. API Reference

| Method | Path | Description |
|---|---|---|
| GET    | `/tickets`             | List all tickets (with optional filters) |
| POST   | `/tickets`             | Create new ticket |
| GET    | `/tickets/{id}`        | Get ticket by ID |
| PUT    | `/tickets/{id}`        | Update ticket |
| DELETE | `/tickets/{id}`        | Delete ticket |
| GET    | `/tickets/summary`     | Dashboard counts (UI helper) |
| GET    | `/tickets/lookups`     | Valid categories / priorities / statuses |
| GET    | `/search`              | Search and filter |
| GET    | `/`, `/health`         | Health probes |

Full reference with request/response examples: [`docs/API.md`](docs/API.md)

## 7. Database

See [`database/er-diagram.md`](database/er-diagram.md) for the single-table schema. Pure DDL is in [`database/schema.sql`](database/schema.sql).

## 8. Screenshots

Place in `screenshots/`. Suggested set:

1. `01_dashboard.png` — Dashboard with summary cards
2. `02_create.png` — Create Ticket form
3. `03_list.png` — All Tickets table
4. `04_detail.png` — Ticket Detail with resolution
5. `05_edit.png` — Edit Ticket page
6. `06_search.png` — Search & Filter results
7. `07_swagger_ui.png` — Swagger UI
8. `08_swagger_post.png` — Swagger POST /tickets
9. `09_swagger_search.png` — Swagger /search
10. `10_postman.png` — Postman testing

## 9. Testing

Step-by-step manual test plan in [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md).

Quick curl smoke test:

```bash
curl http://localhost:8000/tickets
curl -X POST http://localhost:8000/tickets \
  -H "Content-Type: application/json" \
  -d '{"employee_name":"Test","department":"QA","issue_category":"VPN Issue","description":"Cant connect","priority":"High"}'
curl "http://localhost:8000/search?status=Open&category=VPN%20Issue"
```

## 10. Phase 1 Deliverables (Section 17)

- [x] Source code — React frontend + FastAPI backend
- [x] Database — schema.sql, sample-data.sql, seeded SQLite
- [x] Documentation — README, API, Setup, Testing guides
- [x] Sample data — 15 tickets via `seed.py`
- [ ] Screenshots — capture after running locally

## 11. Out of Scope (Section 5)

Explicitly deferred to future phases:
- Authentication / authorization
- Notifications / email
- AI / ML / semantic search
- Analytics dashboards (Dashboard here shows simple counts only — no charts)
- Cloud deployment

## 12. Plagiarism Statement

Original work created for the AFDE May 2026 capstone Phase 1 submission. No code copied from another participant's repository or third-party project. All open-source dependencies are used under their respective licenses (MIT/BSD/Apache 2.0).
