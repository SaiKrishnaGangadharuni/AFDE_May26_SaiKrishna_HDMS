-- =============================================================================
-- HDMS — Helpdesk Ticket Management System
-- Database Schema (SQLite dialect; PostgreSQL-compatible with minor edits)
-- =============================================================================
-- Run on a fresh SQLite database:
--     sqlite3 hdms.db < database/schema.sql
-- =============================================================================

PRAGMA foreign_keys = ON;

-- ------------------------------ TICKETS --------------------------------------
-- Spec section 14 (Tickets Table) — fields match exactly.
CREATE TABLE tickets (
    ticket_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name    VARCHAR(120) NOT NULL,
    department       VARCHAR(120) NOT NULL,
    issue_category   VARCHAR(120) NOT NULL,
    description      TEXT         NOT NULL,
    priority         VARCHAR(20)  NOT NULL DEFAULT 'Medium'
                       CHECK (priority IN ('Low','Medium','High','Critical')),
    status           VARCHAR(20)  NOT NULL DEFAULT 'Open'
                       CHECK (status IN ('Open','In Progress','Resolved','Closed')),
    resolution_notes TEXT,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_employee   ON tickets(employee_name);
CREATE INDEX idx_tickets_department ON tickets(department);
CREATE INDEX idx_tickets_category   ON tickets(issue_category);
CREATE INDEX idx_tickets_priority   ON tickets(priority);
CREATE INDEX idx_tickets_status     ON tickets(status);
CREATE INDEX idx_tickets_created    ON tickets(created_at);

-- =============================================================================
-- End of schema.
-- =============================================================================
