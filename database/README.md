# HDMS Database

Single-table database for the Helpdesk Ticket Management System (Phase 1).

## Files

- **`schema.sql`** — DDL for the `tickets` table plus indexes and CHECK constraints
- **`sample-data.sql`** — 10 starter rows
- **`er-diagram.md`** — Diagram + field reference

## Tech

Default: **SQLite 3** — file-based, zero setup. The runtime DB lives at `backend/hdms.db` after first launch.

## Quick start

```bash
cd backend
python seed.py
```

This drops, recreates, and populates the database with 15 realistic sample tickets across all 7 categories and 4 priority levels.

Alternative — raw SQL:

```bash
sqlite3 backend/hdms.db < database/schema.sql
sqlite3 backend/hdms.db < database/sample-data.sql
```

## Switching to PostgreSQL

1. Install PostgreSQL and create a database: `createdb hdms`
2. Install the driver: `pip install psycopg2-binary`
3. Set: `DATABASE_URL=postgresql://user:pass@localhost:5432/hdms`
4. Run `python backend/seed.py` — SQLAlchemy handles the rest.
