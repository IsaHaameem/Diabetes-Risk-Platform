from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.database import get_db
from app.utils.auth import get_current_user_id

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
def get_user_history(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        # Fetch descending so newest is first
        records = db.execute(
            text("""
                SELECT id, patient_data, prediction, probability, risk_level, created_at 
                FROM prediction_history 
                WHERE user_id = :user_id 
                ORDER BY created_at DESC
            """),
            {"user_id": user_id}
        ).fetchall()
        
        history = []
        for r in records:
            history.append({
                "id": r[0],
                "patient_data": r[1],
                "prediction": r[2],
                "probability": r[3],
                "risk_level": r[4],
                "created_at": r[5]
            })
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))