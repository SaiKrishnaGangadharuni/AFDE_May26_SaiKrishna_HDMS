# End-to-End Testing Guide

Total time: ~10 minutes.

## Phase 0 — Prerequisites

```bash
python --version    # 3.10+
node --version      # 18+
npm --version       # 9+
```

---

## Phase 1 — Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r ../requirements.txt
python seed.py
```

Expected: `✓ Seed complete! 15 tickets across 7 categories.`

---

## Phase 2 — Start Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify:
- http://localhost:8000/         → JSON `"service": "Helpdesk Ticket Management System"`
- http://localhost:8000/docs     → Swagger UI with all 7 endpoints

📸 Screenshot: `07_swagger_ui.png`

---

## Phase 3 — Test API in Swagger

### 3a. List
- `GET /tickets` → Try it out → Execute
- Expect 200 with 15 entries

### 3b. Create
- `POST /tickets` → Try it out → use:
  ```json
  {
    "employee_name": "Test User",
    "department": "QA",
    "issue_category": "VPN Issue",
    "description": "Testing via Swagger",
    "priority": "High"
  }
  ```
- Expect 201 with new ticket_id

📸 Screenshot: `08_swagger_post.png`

### 3c. Update (status + resolution)
- `PUT /tickets/{id}` → use:
  ```json
  { "status": "Resolved", "resolution_notes": "Tested via Swagger" }
  ```
- Expect 200 with updated values

### 3d. Search
- `GET /search` → set `q=VPN` → Execute
- Then `status=Resolved` → Execute

📸 Screenshot: `09_swagger_search.png`

### 3e. Summary
- `GET /tickets/summary` → see by_status / by_priority counts

### 3f. Delete
- `DELETE /tickets/{id}` → 204

---

## Phase 4 — Frontend Setup

In a **new** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## Phase 5 — UI Walkthrough

### 5a. Dashboard
- 4 stat cards (Total / Open+In Progress / Resolved+Closed / Critical)
- "By Status" and "By Priority" breakdown lists
- "Recent Tickets" list

📸 Screenshot: `01_dashboard.png`

### 5b. Create Ticket
- Click **Create Ticket** in navbar
- Fill: Name, Department, pick a Category, write description, pick Priority
- Submit → redirected to detail page of new ticket

📸 Screenshot: `02_create.png`

### 5c. All Tickets
- Click **All Tickets**
- Table with all entries, ID column shows `#N`

📸 Screenshot: `03_list.png`

### 5d. Ticket Detail
- Click "View →" on any row
- See description, status badges, priority badge, creation time

📸 Screenshot: `04_detail.png`

### 5e. Edit
- From detail, click **Edit**
- Change Status to `Resolved`, add Resolution Notes
- Save → redirects to detail, green resolution box appears

📸 Screenshot: `05_edit.png`

### 5f. Delete
- From detail, click **Delete** → confirm
- Redirects to list, ticket is gone

### 5g. Search & Filter
- Click **Search & Filter**
- Type `VPN` in keyword → Search → matching tickets
- Clear, then set Status = `Open` → Search
- Clear, then set Category = `Software Installation` → Search

📸 Screenshot: `06_search.png`

---

## Phase 6 — Validation Checks

In the Create form, try:

1. Empty employee name → form refuses to submit
2. Empty description → form refuses to submit
3. Without picking category → custom error shown

In Swagger, try:

1. `POST /tickets` with `priority: "Urgent"` → 422 validation error (not in enum)
2. `POST /tickets` with `issue_category: "Other"` → 422 (not in 7 sample categories)

---

## Phase 7 — Stop & Commit

Stop both servers with `Ctrl + C`.

Drop screenshots into `screenshots/` and commit:

```bash
cd ..
git add screenshots/
git commit -m "Add UI and API testing screenshots"
git push
```

---

## Done

If all checks pass, the HDMS submission is ready for evaluation.
