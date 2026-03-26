from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse, StreamingResponse
from app.schemas.predict import PatientDataInput, PredictionOutput
from app.utils.pdf_generator import create_patient_report
from app.utils.database import get_db
from app.utils.auth import get_current_user_id
from sqlalchemy.orm import Session
from sqlalchemy import text
import joblib
import numpy as np
import pandas as pd
import os
import io
import json
import sys

ML_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml")
sys.path.append(ML_DIR)
from ml.shap_explainer import get_shap_values, generate_recommendations

router = APIRouter()

try:
    model = joblib.load(os.path.join(ML_DIR, 'model.pkl'))
    scaler = joblib.load(os.path.join(ML_DIR, 'scaler.pkl'))
except Exception:
    model = None
    scaler = None

def get_risk_level(probability: float) -> str:
    prob_percentage = probability * 100
    if prob_percentage <= 30: return "Low"
    elif prob_percentage <= 70: return "Medium"
    else: return "High"

@router.post("/predict", response_model=PredictionOutput)
async def predict_risk(
    data: PatientDataInput, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id) # Protects route & gets user
):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    input_data = np.array([[data.Pregnancies, data.Glucose, data.BloodPressure, 
                            data.SkinThickness, data.Insulin, data.BMI, 
                            data.DiabetesPedigreeFunction, data.Age]])
    try:
        scaled_data = scaler.transform(input_data)
        probability = float(model.predict_proba(scaled_data)[0][1])
        prediction = int(model.predict(scaled_data)[0])
        risk_level = get_risk_level(probability)
        
        shap_vals = get_shap_values(model, scaled_data)
        recs = generate_recommendations(data.dict())
        
        # --- THE SYSTEM LOOP: Persist to Database ---
        db.execute(
            text("""
                INSERT INTO prediction_history (user_id, patient_data, prediction, probability, risk_level)
                VALUES (:user_id, :patient_data, :prediction, :probability, :risk_level)
            """),
            {
                "user_id": user_id,
                "patient_data": json.dumps(data.dict()),
                "prediction": prediction,
                "probability": probability,
                "risk_level": risk_level
            }
        )
        db.commit()
        # ------------------------------------------

        return PredictionOutput(
            prediction=prediction,
            probability=probability,
            risk_level=risk_level,
            shap_values=shap_vals,
            recommendations=recs
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

# (Keep your existing /batch-predict and /generate-report endpoints here below)
# ... [rest of the predict.py file remains unchanged] ...


# =========================
# 🔥 MAIN PREDICTION ROUTE
# =========================
@router.post("/predict", response_model=PredictionOutput)
async def predict_risk(
    data: PatientDataInput,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    input_data = np.array([[
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DiabetesPedigreeFunction,
        data.Age
    ]])

    try:
        # Prediction
        scaled_data = scaler.transform(input_data)
        probability = float(model.predict_proba(scaled_data)[0][1])
        prediction = int(model.predict(scaled_data)[0])

        # SHAP + Recommendations
        shap_vals = get_shap_values(model, scaled_data)
        recs = generate_recommendations(data.dict())

        # 🔥 SAVE TO DATABASE
        db.execute(
            text("""
                INSERT INTO prediction_history 
                (user_id, patient_data, prediction, probability, risk_level)
                VALUES (:user_id, :patient_data, :prediction, :probability, :risk_level)
            """),
            {
                "user_id": user_id,
                "patient_data": data.json(),
                "prediction": prediction,
                "probability": probability,
                "risk_level": get_risk_level(probability)
            }
        )
        db.commit()

        return PredictionOutput(
            prediction=prediction,
            probability=probability,
            risk_level=get_risk_level(probability),
            shap_values=shap_vals,
            recommendations=recs
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


# =========================
# 📊 BATCH CSV PREDICTION
# =========================
@router.post("/batch-predict")
async def batch_predict(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    try:
        df = pd.read_csv(file.file)

        expected_cols = [
            "Pregnancies", "Glucose", "BloodPressure",
            "SkinThickness", "Insulin", "BMI",
            "DiabetesPedigreeFunction", "Age"
        ]

        if not all(col in df.columns for col in expected_cols):
            raise HTTPException(status_code=400, detail="CSV missing required columns.")

        X = df[expected_cols]
        X_scaled = scaler.transform(X)

        probs = model.predict_proba(X_scaled)[:, 1]

        df['Probability'] = probs
        df['Risk_Level'] = [get_risk_level(p) for p in probs]

        stream = io.StringIO()
        df.to_csv(stream, index=False)

        response = StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/csv"
        )

        response.headers["Content-Disposition"] = "attachment; filename=batch_predictions.csv"
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# 📄 PDF REPORT
# =========================
@router.post("/generate-report")
async def generate_report(data: dict):
    try:
        pdf_path = create_patient_report(
            data['patient_data'],
            data['result']
        )

        return FileResponse(
            path=pdf_path,
            filename="patient_risk_report.pdf",
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")