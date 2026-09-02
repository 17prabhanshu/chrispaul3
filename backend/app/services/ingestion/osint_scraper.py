import uuid
import datetime
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.domain import NormalizedEvent, Actor, Content, Provenance
from app.api.routes import ingest_event
import random

def run_osint_scrape():
    # Mocking a lightweight RSS/Reddit scrape that pulls surface web chatter
    # about specific vendors or products, submitting them to the Evidence Engine
    # for cross-platform linking.
    db = SessionLocal()
    
    mock_intel = [
        {"vendor": "KryptykOG", "platform": "reddit", "text": "Is KryptykOG still active? Need new 12-month Hulu codes.", "type": "forum"},
        {"vendor": "cyberzen", "platform": "telegram", "text": "Cyberzen VPN tutorial is actually solid. Highly recommend.", "type": "chat"},
        {"vendor": "CheapPayTV", "platform": "twitter", "text": "Someone named CheapPayTV is selling Sky UK boxes. Seems sketch.", "type": "social"}
    ]
    
    try:
        count = 0
        for item in mock_intel:
            # We add some randomness to timestamp
            event = NormalizedEvent(
                event_id=f"OSINT-{uuid.uuid4().hex[:8]}",
                source=item["platform"],
                platform_type=item["type"],
                platform_id=item["platform"],
                timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 48)),
                actor=Actor(raw_id="anonymous", display_name="anonymous"),
                content=Content(text=item["text"]),
                provenance=Provenance(source_uri=f"https://{item['platform']}.com/search", dataset="live_osint_scrape")
            )
            
            try:
                ingest_event(event, db)
                db.commit()
                count += 1
            except Exception as e:
                db.rollback()
                print(f"Error ingesting OSINT: {e}")
                
        return {"status": "success", "message": "OSINT Scrape Complete", "ingested": count}
    finally:
        db.close()

if __name__ == "__main__":
    print(run_osint_scrape())
