from pydantic import BaseModel, Field
from typing import Dict, List

class PatientDataInput(BaseModel):
    Pregnancies: int = Field(..., ge=0, le=20)
    Glucose: float = Field(..., ge=0, le=300)
    BloodPressure: float = Field(..., ge=0, le=200)
    SkinThickness: float = Field(..., ge=0, le=100)
    Insulin: float = Field(..., ge=0, le=900)
    BMI: float = Field(..., ge=0, le=70)
    DiabetesPedigreeFunction: float = Field(..., ge=0.0, le=3.0)
    Age: int = Field(..., ge=1, le=120)

class PredictionOutput(BaseModel):
    prediction: int
    probability: float
    risk_level: str
    shap_values: Dict[str, float]
    recommendations: List[str]