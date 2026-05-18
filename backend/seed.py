"""Populate the database with realistic sample tickets so the evaluator can
explore listing, search, and filter immediately.

Run from the backend/ folder:
    python seed.py
"""
import random
from datetime import datetime, timedelta

from database import Base, engine, SessionLocal
from models import Ticket


SAMPLES = [
    # (employee_name, department, category, description, priority, status, resolution_notes, days_ago)
    ("Aarav Sharma",     "Engineering",     "VPN Issue",
        "Unable to connect to corporate VPN since this morning. Getting timeout error.",
        "High", "In Progress", None, 0),
    ("Bhavna Iyer",      "Finance",         "Password Reset",
        "Forgot password for ERP system, need urgent reset before quarter close.",
        "Critical", "Resolved",
        "Password reset and shared via secure channel. User confirmed login.", 1),
    ("Chetan Reddy",     "HR",              "Software Installation",
        "Need MS Visio installed for organisation chart updates.",
        "Low", "Open", None, 0),
    ("Divya Menon",      "Engineering",     "Laptop Issue",
        "Laptop battery drains within 30 minutes when unplugged. Less than a year old.",
        "Medium", "In Progress", None, 2),
    ("Esha Kapoor",      "Marketing",       "Email Access",
        "Outlook keeps prompting for password every few minutes. Restarted Outlook already.",
        "High", "Resolved",
        "Reset Outlook profile and re-cached credentials. Confirmed working.", 3),
    ("Farhan Sheikh",    "Sales",           "Network Connectivity",
        "WiFi disconnects intermittently in the conference room. Affects client calls.",
        "High", "Open", None, 1),
    ("Gayatri Joshi",    "Operations",      "Hardware Request",
        "Request for an additional 27-inch monitor for dual-screen setup.",
        "Low", "Closed",
        "Approved by manager and delivered to desk. Closed.", 7),
    ("Harshit Verma",    "Engineering",     "VPN Issue",
        "VPN drops after 30 minutes of inactivity. Loses connection mid-meeting.",
        "Medium", "In Progress", None, 2),
    ("Ishita Nair",      "Finance",         "Software Installation",
        "Need Tableau Desktop installed for monthly reporting.",
        "Medium", "Resolved",
        "Tableau installed and licensed. User trained on access.", 4),
    ("Jaideep Khanna",   "HR",              "Laptop Issue",
        "Spacebar key stuck on keyboard, types double spaces randomly.",
        "Low", "Closed",
        "Replaced laptop. Old one sent for repair.", 8),
    ("Kavya Pillai",     "Engineering",     "Email Access",
        "Cannot receive emails from external clients on @gmail.com domain.",
        "Medium", "Open", None, 0),
    ("Lokesh Mehta",     "Marketing",       "Hardware Request",
        "Need wireless presenter for upcoming conference.",
        "Medium", "Closed",
        "Wireless presenter procured and shipped.", 9),
    ("Maya Sundaram",    "Sales",           "Password Reset",
        "Locked out of Salesforce after too many wrong attempts.",
        "High", "Resolved",
        "Account unlocked. MFA re-enrolled.", 5),
    ("Nikhil Patel",     "Operations",      "Network Connectivity",
        "Internet speed extremely slow at 4th floor west wing.",
        "Medium", "In Progress", None, 3),
    ("Priya Chandran",   "Engineering",     "Software Installation",
        "Docker Desktop fails to start, throws WSL2 backend error.",
        "High", "Resolved",
        "Enabled WSL2 + reinstalled Docker Desktop. Working now.", 6),
]


def seed():
    print("Dropping & recreating schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print(f"Inserting {len(SAMPLES)} tickets...")
        for (name, dept, cat, desc, pri, st, notes, days_ago) in SAMPLES:
            ts = datetime.utcnow() - timedelta(
                days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59)
            )
            db.add(Ticket(
                employee_name=name, department=dept, issue_category=cat,
                description=desc, priority=pri, status=st,
                resolution_notes=notes, created_at=ts,
            ))
        db.commit()
        print(f"\n✓ Seed complete! {len(SAMPLES)} tickets across "
              f"{len(set(s[2] for s in SAMPLES))} categories.")
        print("\nStart the API with:")
        print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        print("\nThen open http://localhost:8000/docs")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
