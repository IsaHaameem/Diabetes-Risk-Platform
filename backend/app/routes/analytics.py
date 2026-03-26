from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.database import get_db
from app.utils.auth import get_current_user_id

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
def get_user_analytics(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        # Aggregate stats using pure SQL for performance
        stats = db.execute(
            text("""
                SELECT 
                    COUNT(*) as total_assessments,
                    AVG(probability) as avg_probability,
                    SUM(CASE WHEN risk_level = 'High' THEN 1 ELSE 0 END) as high_risk_count,
                    SUM(CASE WHEN risk_level = 'Medium' THEN 1 ELSE 0 END) as medium_risk_count,
                    SUM(CASE WHEN risk_level = 'Low' THEN 1 ELSE 0 END) as low_risk_count
                FROM prediction_history 
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).fetchone()

        total = stats[0] or 0
        avg_prob = (stats[1] or 0) * 100
        high = int(stats[2] or 0)
        medium = int(stats[3] or 0)
        low = int(stats[4] or 0)
        
        high_risk_percentage = (high / total * 100) if total > 0 else 0

        return {
            "total_assessments": total,
            "average_risk_probability": round(avg_prob, 1),
            "high_risk_percentage": round(high_risk_percentage, 1),
            "risk_distribution": [
                {"name": "Low Risk", "value": low, "color": "#22c55e"},
                {"name": "Medium Risk", "value": medium, "color": "#eab308"},
                {"name": "High Risk", "value": high, "color": "#ef4444"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")