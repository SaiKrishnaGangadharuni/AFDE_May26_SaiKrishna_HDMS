# HDMS API Reference

Base URL: `http://localhost:8000`

No authentication is required in Phase 1 (per spec section 5).

Interactive Swagger UI: **http://localhost:8000/docs**

---

## POST /tickets
Create a new support ticket.

**Request body:**
```json
{
  "employee_name": "Sai Krishna",
  "department": "Engineering",
  "issue_category": "VPN Issue",
  "description": "Cannot connect to corporate VPN since morning.",
  "priority": "High"
}
```

Validation:
- `employee_name`: 2-120 characters
- `department`: 1-120 characters
- `issue_category`: must be one of the 7 categories (spec section 7)
- `description`: at least 3 characters
- `priority`: one of `Low`, `Medium`, `High`, `Critical`
- `status` defaults to `Open` (cannot be set on create)

**Response `201`:**
```json
{
  "ticket_id": 16,
  "employee_name": "Sai Krishna",
  "department": "Engineering",
  "issue_category": "VPN Issue",
  "description": "Cannot connect to corporate VPN since morning.",
  "priority": "High",
  "status": "Open",
  "resolution_notes": null,
  "created_at": "2026-05-15T11:23:54.737897"
}
```

---

## GET /tickets
List tickets (newest first).

Query params (all optional, all combine):
- `q` — keyword search across employee/department/description/resolution
- `status` — exact match (Open / In Progress / Resolved / Closed)
- `category` — exact match against the 7 categories
- `priority` — exact match (Low / Medium / High / Critical)
- `page`, `page_size` — pagination, defaults 1 / 100, max 500

**Response `200`:** Array of ticket objects.

---

## GET /tickets/{id}
Get a single ticket.
- `200` Ticket object
- `404` `{"detail": "Ticket not found"}`

---

## PUT /tickets/{id}
Partial or full update. Per spec section 6.3 — covers status update, detail modification, and resolution notes.

**Request body (all fields optional):**
```json
{
  "status": "Resolved",
  "resolution_notes": "Reinstalled VPN client. User confirmed connection."
}
```

`200` updated ticket · `404` if not found · `422` if validation fails.

---

## DELETE /tickets/{id}
Permanently remove a ticket.
- `204` on success
- `404` `{"detail": "Ticket not found"}`

---

## GET /search
Top-level search endpoint per spec section 12 (Table 2). Same filters as `GET /tickets` (no pagination — returns up to 500 results).

```bash
curl "http://localhost:8000/search?q=outlook&status=Resolved"
```

---

## GET /tickets/summary
Dashboard counts (UI helper, not in spec but lightweight aggregation).
```json
{
  "total": 15,
  "by_status":   { "Open": 3, "In Progress": 4, "Resolved": 5, "Closed": 3 },
  "by_priority": { "Low": 3, "Medium": 6, "High": 5, "Critical": 1 },
  "by_category": { "VPN Issue": 2, ... },
  "recent": [ /* up to 5 newest tickets */ ]
}
```

## GET /tickets/lookups
Returns the allowed enum values — useful for populating dropdowns in forms.
```json
{
  "categories": ["VPN Issue", "Password Reset", ...],
  "priorities": ["Low", "Medium", "High", "Critical"],
  "statuses":   ["Open", "In Progress", "Resolved", "Closed"]
}
```

---

## GET /  and  GET /health
Health probes.

---

## Error format

```json
{ "detail": "Human-readable message" }
```

Pydantic validation errors return a structured 422 with a detail array.

## Quick test sequence (curl)

```bash
BASE=http://localhost:8000

# 1. Create
ID=$(curl -s -X POST $BASE/tickets -H "Content-Type: application/json" \
  -d '{"employee_name":"Demo","department":"QA","issue_category":"VPN Issue","description":"Demo ticket","priority":"High"}' \
  | python -c "import sys,json;print(json.load(sys.stdin)['ticket_id'])")
echo "Created #$ID"

# 2. Get it
curl $BASE/tickets/$ID

# 3. Update status + add notes
curl -X PUT $BASE/tickets/$ID -H "Content-Type: application/json" \
  -d '{"status":"Resolved","resolution_notes":"Fixed by reinstalling client."}'

# 4. Search
curl "$BASE/search?q=Demo"
curl "$BASE/search?status=Resolved&category=VPN%20Issue"

# 5. Summary
curl $BASE/tickets/summary

# 6. Delete
curl -X DELETE $BASE/tickets/$ID -w "Status: %{http_code}\n"
```
