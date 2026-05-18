"""Ticket REST endpoints per spec section 12 (Table 2).

GET    /tickets        — list all
GET    /tickets/{id}   — get by ID
POST   /tickets        — create
PUT    /tickets/{id}   — update
DELETE /tickets/{id}   — delete
GET    /search         — search (defined in main.py at root level per spec)

Plus convenience endpoints used by the UI:
GET    /tickets/summary — dashboard stats
GET    /tickets/lookups — categories / priorities / statuses for dropdowns
"""
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session

import crud
from database import get_db
from models import TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES
from schemas import (
    TicketCreate, TicketUpdate, TicketOut, TicketSummary,
)


router = APIRouter(prefix="/tickets", tags=["Tickets"])


# Place specific paths BEFORE /{ticket_id} to avoid path collisions.
@router.get("/summary", response_model=TicketSummary,
            summary="Dashboard summary (totals, breakdowns, recent)")
def summary(db: Session = Depends(get_db)):
    data = crud.get_summary(db)
    return TicketSummary(
        total=data["total"],
        by_status=data["by_status"],
        by_priority=data["by_priority"],
        by_category=data["by_category"],
        recent=[TicketOut.model_validate(t) for t in data["recent"]],
    )


@router.get("/lookups", summary="Allowed categories, priorities, statuses")
def lookups():
    return {
        "categories": TICKET_CATEGORIES,
        "priorities": TICKET_PRIORITIES,
        "statuses":   TICKET_STATUSES,
    }


@router.get("", response_model=List[TicketOut], summary="List all tickets")
def list_tickets(
    q: Optional[str] = Query(default=None, description="Keyword search"),
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return crud.list_tickets(db, q=q, status=status, category=category, priority=priority,
                             page=page, page_size=page_size)


@router.post("", response_model=TicketOut, status_code=http_status.HTTP_201_CREATED,
             summary="Create a new ticket")
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, payload)


@router.get("/{ticket_id}", response_model=TicketOut, summary="Get ticket by ID")
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    t = crud.get_ticket(db, ticket_id)
    if not t:
        raise HTTPException(404, "Ticket not found")
    return t


@router.put("/{ticket_id}", response_model=TicketOut, summary="Update ticket")
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    t = crud.update_ticket(db, ticket_id, payload)
    if not t:
        raise HTTPException(404, "Ticket not found")
    return t


@router.delete("/{ticket_id}", status_code=http_status.HTTP_204_NO_CONTENT,
               summary="Delete ticket")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    if not crud.delete_ticket(db, ticket_id):
        raise HTTPException(404, "Ticket not found")
