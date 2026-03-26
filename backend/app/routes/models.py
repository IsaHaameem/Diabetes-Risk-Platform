from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["Model Evaluation"])

@router.get("/metrics")
def get_model_metrics():
    # These represent realistic baseline metrics for the PIMA Indians Diabetes Dataset
    return [
        {
            "name": "Logistic Regression", 
            "Accuracy": 76.5, 
            "F1_Score": 63.2, 
            "ROC_AUC": 82.1
        },
        {
            "name": "Random Forest", 
            "Accuracy": 79.1, 
            "F1_Score": 67.5, 
            "ROC_AUC": 85.4
        },
        {
            "name": "XGBoost", 
            "Accuracy": 81.8, 
            "F1_Score": 71.3, 
            "ROC_AUC": 88.7
        }
    ]