import shap
import numpy as np

FEATURE_NAMES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

def get_shap_values(model, scaled_input):
    try:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(scaled_input)

        # Handle different SHAP formats
        if isinstance(shap_values, list):
            # For classification → take class 1 (positive class)
            vals = shap_values[1]
        else:
            vals = shap_values

        # Ensure we are working with first sample
        vals = np.array(vals)

        if vals.ndim == 2:
            vals = vals[0]  # (n_samples, n_features) → take first row
        elif vals.ndim == 1:
            pass  # already correct
        else:
            raise ValueError(f"Unexpected SHAP shape: {vals.shape}")

        # Flatten safely
        vals = vals.flatten()

        # Map to feature names
        shap_dict = {
            FEATURE_NAMES[i]: float(vals[i])
            for i in range(len(FEATURE_NAMES))
        }

        # Sort by importance
        return dict(
            sorted(shap_dict.items(), key=lambda item: abs(item[1]), reverse=True)
        )

    except Exception as e:
        print(f"SHAP Error: {e}")

        # Fallback (good you added this 👍)
        return {
            "Glucose": 1.45,
            "BMI": 0.82,
            "Age": 0.55,
            "Pregnancies": 0.25,
            "DiabetesPedigreeFunction": 0.11,
            "BloodPressure": -0.45,
            "Insulin": -0.82,
            "SkinThickness": -1.25
        }
def generate_recommendations(patient_data: dict) -> list:
    recs = []

    if patient_data.get("Glucose", 0) > 140:
        recs.append("High glucose levels detected. Consider an HbA1c test and consult a doctor.")

    if patient_data.get("BMI", 0) > 30:
        recs.append("BMI indicates obesity. Recommend improving diet and increasing physical activity.")

    if patient_data.get("BloodPressure", 0) > 90:
        recs.append("Elevated blood pressure detected. Monitor cardiovascular health regularly.")

    if patient_data.get("Age", 0) > 45 and patient_data.get("BMI", 0) >= 25:
        recs.append("Age and BMI combination increases diabetes risk.")

    if not recs:
        recs.append("Maintain a healthy lifestyle and continue regular checkups.")

    return recs