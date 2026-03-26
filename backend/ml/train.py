import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score

def load_and_preprocess_data():
    # URL for PIMA Indians Diabetes dataset
    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
    df = pd.read_csv(url, names=columns)

    # In PIMA dataset, 0 means missing for these specific columns
    features_with_zeroes = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    df[features_with_zeroes] = df[features_with_zeroes].replace(0, np.nan)

    # Simple imputation: Fill missing with median
    df.fillna(df.median(), inplace=True)

    X = df.drop('Outcome', axis=1)
    y = df['Outcome']

    return X, y

def train_and_evaluate():
    print("Loading and preprocessing data...")
    X, y = load_and_preprocess_data()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Define models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }

    best_model = None
    best_name = ""
    best_accuracy = 0

    print("\nTraining models...")
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_proba = model.predict_proba(X_test_scaled)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc = roc_auc_score(y_test, y_proba)

        print(f"--- {name} ---")
        print(f"Accuracy: {acc:.4f} | F1: {f1:.4f} | ROC-AUC: {roc:.4f}")

        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_name = name

    print(f"\nBest Model: {best_name} with Accuracy: {best_accuracy:.4f}")

    # Save the best model and scaler
    script_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(best_model, os.path.join(script_dir, 'model.pkl'))
    joblib.dump(scaler, os.path.join(script_dir, 'scaler.pkl'))
    print("Model and scaler saved successfully to backend/ml/")

if __name__ == "__main__":
    train_and_evaluate()