from fastapi import APIRouter, Depends, HTTPException, Security
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.schema import get_db, EntityNode
from app.models.domain import NormalizedEvent, Actor, Content, Provenance
import uuid
from datetime import datetime

class InterceptRequest(BaseModel):
    text: str

def add_intercept_route(router):
    @router.post("/pipeline/ingest/intercept")
    def api_ingest_intercept(req: InterceptRequest, db: Session = Depends(get_db)):
        from app.api.routes import ingest_event
        event = NormalizedEvent(
            event_id=f"INT-{uuid.uuid4().hex[:8]}",
            source="Live_Intercept",
            timestamp=datetime.utcnow(),
            actor=Actor(raw_id="Unknown_Target", display_name="Unknown"),
            content=Content(text=req.text, language="en"),
            provenance=Provenance(source_uri="intercept://manual", dataset="live_op")
        )
        try:
            result = ingest_event(event, db)
            db.commit()
            return {"status": "success", "result": result, "stream": [{"source": "LIVE INTERCEPT", "preview": req.text}]}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
