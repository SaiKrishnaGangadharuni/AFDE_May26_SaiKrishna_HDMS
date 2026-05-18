"""SQLAlchemy ORM model for the Ticket entity.

Mirrors spec section 14 (Tickets Table) field-for-field:
  ticket_id, employee_name, department, issue_category,
  description, priority, status, resolution_notes, created_at
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime

from database import Base


# Allowed values per spec sections 7, 8, 9.
TICKET_CATEGORIES = [
    "VPN Issue",
    "Password Reset",
    "Software Installation",
    "Laptop Issue",
    "Email Access",
    "Network Connectivity",
    "Hardware Request",
]
TICKET_PRIORITIES = ["Low", "Medium", "High", "Critical"]
TICKET_STATUSES   = ["Open", "In Progress", "Resolved", "Closed"]


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_name    = Column(String(120), nullable=False, index=True)
    department       = Column(String(120), nullable=False, index=True)
    issue_category   = Column(String(120), nullable=False, index=True)
    description      = Column(Text, nullable=False)
    priority         = Column(String(20),  nullable=False, default="Medium", index=True)
    status           = Column(String(20),  nullable=False, default="Open",   index=True)
    resolution_notes = Column(Text)
    created_at       = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

    def __repr__(self) -> str:
        return f"<Ticket id={self.ticket_id} status={self.status!r} priority={self.priority!r}>"
