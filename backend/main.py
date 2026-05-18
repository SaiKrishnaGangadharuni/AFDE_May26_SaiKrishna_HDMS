"""FastAPI application entrypoint for the Helpdesk Ticket Management System.

Run locally with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

API documentation auto-generated at:
    GET /docs   (Swagger UI)
    GET /redoc  (Redoc UI)
"""
from typing import Optional, List

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from database import Base, engine, get_db
from routers import tickets as tickets_router
from schemas import TicketOut


# Create tables on first run.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Helpdesk Ticket Management System",
    version="1.0.0",
    description=(
        "Phase 1 capstone — REST API for creating, tracking, updating, "
        "and searching internal IT support tickets."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# CORS — Vite dev server runs on 5173 by default.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(tickets_router.router)


# ---------------------------------------------------------------------------
# Top-level /search endpoint (spec section 12, Table 2).
# Mirrors GET /tickets with the same filters.
# ---------------------------------------------------------------------------
@app.get("/search", response_model=List[TicketOut], tags=["Search"],
         summary="Search and filter tickets")
def search_tickets(
    q: Optional[str] = Query(default=None, description="Keyword search across name, department, description, resolution"),
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.list_tickets(db, q=q, status=status, category=category, priority=priority,
                             page=1, page_size=500)


# ---------------------------------------------------------------------------
# Health endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"], summary="Service info")
def root():
    return {
        "service": "Helpdesk Ticket Management System",
        "code": "HDMS",
        "version": "1.0.0",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"], summary="Liveness probe")
def health():
    return {"status": "healthy"}
