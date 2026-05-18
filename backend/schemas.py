"""Pydantic schemas for request validation and response serialization."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator

from models import TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES


class TicketBase(BaseModel):
    employee_name:  str  = Field(min_length=2, max_length=120)
    department:     str  = Field(min_length=1, max_length=120)
    issue_category: str  = Field(min_length=1, max_length=120)
    description:    str  = Field(min_length=3)
    priority:       str  = Field(default="Medium")

    @field_validator("priority")
    @classmethod
    def _check_priority(cls, v: str) -> str:
        if v not in TICKET_PRIORITIES:
            raise ValueError(f"priority must be one of {TICKET_PRIORITIES}")
        return v

    @field_validator("issue_category")
    @classmethod
    def _check_category(cls, v: str) -> str:
        # Spec gives sample categories — we validate against the list to keep data clean.
        if v not in TICKET_CATEGORIES:
            raise ValueError(f"issue_category must be one of {TICKET_CATEGORIES}")
        return v


class TicketCreate(TicketBase):
    """Payload for POST /tickets."""
    pass


class TicketUpdate(BaseModel):
    """Payload for PUT /tickets/{id} — every field optional for partial updates."""
    employee_name:    Optional[str] = Field(default=None, min_length=2, max_length=120)
    department:       Optional[str] = Field(default=None, min_length=1, max_length=120)
    issue_category:   Optional[str] = None
    description:      Optional[str] = Field(default=None, min_length=3)
    priority:         Optional[str] = None
    status:           Optional[str] = None
    resolution_notes: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def _check_priority(cls, v):
        if v is not None and v not in TICKET_PRIORITIES:
            raise ValueError(f"priority must be one of {TICKET_PRIORITIES}")
        return v

    @field_validator("issue_category")
    @classmethod
    def _check_category(cls, v):
        if v is not None and v not in TICKET_CATEGORIES:
            raise ValueError(f"issue_category must be one of {TICKET_CATEGORIES}")
        return v

    @field_validator("status")
    @classmethod
    def _check_status(cls, v):
        if v is not None and v not in TICKET_STATUSES:
            raise ValueError(f"status must be one of {TICKET_STATUSES}")
        return v


class TicketOut(TicketBase):
    ticket_id:        int
    status:           str
    resolution_notes: Optional[str] = None
    created_at:       datetime

    model_config = ConfigDict(from_attributes=True)


class TicketSummary(BaseModel):
    """Lightweight payload used by the Dashboard page."""
    total: int
    by_status:   dict[str, int]
    by_priority: dict[str, int]
    by_category: dict[str, int]
    recent: list[TicketOut]
