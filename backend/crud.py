"""Reusable database operations on the Ticket entity.

Keeping data-access here makes the router file thin and easy to test.
"""
from typing import Optional
from datetime import datetime

from sqlalchemy import or_, func
from sqlalchemy.orm import Session

from models import Ticket
from schemas import TicketCreate, TicketUpdate


def get_ticket(db: Session, ticket_id: int) -> Optional[Ticket]:
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def list_tickets(
    db: Session,
    q: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = 1,
    page_size: int = 100,
) -> list[Ticket]:
    qry = db.query(Ticket)
    if q:
        like = f"%{q}%"
        qry = qry.filter(or_(
            Ticket.employee_name.ilike(like),
            Ticket.department.ilike(like),
            Ticket.description.ilike(like),
            Ticket.resolution_notes.ilike(like),
        ))
    if status:
        qry = qry.filter(Ticket.status == status)
    if category:
        qry = qry.filter(Ticket.issue_category == category)
    if priority:
        qry = qry.filter(Ticket.priority == priority)
    return (
        qry.order_by(Ticket.created_at.desc())
           .offset((page - 1) * page_size)
           .limit(page_size)
           .all()
    )


def create_ticket(db: Session, payload: TicketCreate) -> Ticket:
    t = Ticket(
        employee_name=payload.employee_name.strip(),
        department=payload.department.strip(),
        issue_category=payload.issue_category,
        description=payload.description.strip(),
        priority=payload.priority,
        status="Open",
        created_at=datetime.utcnow(),
    )
    db.add(t); db.commit(); db.refresh(t)
    return t


def update_ticket(db: Session, ticket_id: int, payload: TicketUpdate) -> Optional[Ticket]:
    t = get_ticket(db, ticket_id)
    if not t:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        if isinstance(value, str):
            value = value.strip()
        setattr(t, field, value)
    db.commit(); db.refresh(t)
    return t


def delete_ticket(db: Session, ticket_id: int) -> bool:
    t = get_ticket(db, ticket_id)
    if not t:
        return False
    db.delete(t); db.commit()
    return True


def get_summary(db: Session, recent_limit: int = 5) -> dict:
    """Stats for the Dashboard page (Section 11.1)."""
    total = db.query(Ticket).count()

    def group_by(col):
        rows = db.query(col, func.count(Ticket.ticket_id)).group_by(col).all()
        return {k: v for k, v in rows}

    by_status   = group_by(Ticket.status)
    by_priority = group_by(Ticket.priority)
    by_category = group_by(Ticket.issue_category)
    recent = db.query(Ticket).order_by(Ticket.created_at.desc()).limit(recent_limit).all()
    return {
        "total": total,
        "by_status": by_status,
        "by_priority": by_priority,
        "by_category": by_category,
        "recent": recent,
    }
