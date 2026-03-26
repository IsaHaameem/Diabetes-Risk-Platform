# 🧬 Diabetes Risk Intelligence Platform

![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791.svg?logo=postgresql)
![ML](https://img.shields.io/badge/Machine%20Learning-XGBoost%20%7C%20SHAP-orange)

---

## 🚀 Live Demo

- 🌐 **Frontend:** diabetes-risk-platform.vercel.app  
- ⚙️ **Backend API:** https://diabetes-backend-sjd4.onrender.com 

---

## 🎯 Overview

The **Diabetes Risk Intelligence Platform** is a full-stack AI-powered healthcare decision-support system designed to:

- Predict diabetes risk using machine learning  
- Explain predictions using SHAP (Explainable AI)  
- Track patient history and analytics  
- Provide AI-powered medical insights  

Unlike basic ML projects, this system is:

- ✅ Fully deployed  
- ✅ Explainable (XAI)  
- ✅ Stateful (Database + History)  
- ✅ Scalable (API + Frontend)  

---

## 🔥 Features

### 🧠 Machine Learning Prediction
- Models trained:
  - Logistic Regression  
  - Random Forest  
  - XGBoost (**selected model**)  
- Outputs:
  - Risk probability  
  - Risk classification (Low / Medium / High)

---

### 📊 Explainable AI (SHAP)
- Shows feature contribution per patient  
- Explains **why** prediction was made  
- Visualized using charts  

---

### 📁 Patient History Tracking
- Stores predictions in PostgreSQL  
- Displays past assessments  
- Enables longitudinal analysis  

---

### 📊 Analytics Dashboard
- Total assessments  
- Average risk  
- High-risk percentage  
- Risk distribution charts  

---

### 📄 PDF Report Generation
- Downloadable clinical-style reports  
- Includes:
  - Prediction  
  - Feature contributions  
  - Recommendations  

---

### 📤 Batch Prediction
- Upload CSV files  
- Predict multiple patients  
- Download results  

---

### 🤖 AI Assistant
- Powered by OpenAI API  
- Answers:
  - “Why is risk high?”  
  - “What does BMI mean?”  

---

### 🔐 Authentication System
- JWT-based authentication  
- Secure login/signup  
- Multi-user support  

---

## 🏗️ Tech Stack

### 🖥️ Frontend
- React + TypeScript + Vite  
- TailwindCSS  
- Recharts  
- Axios  
- React Router  
- **Deployed on Vercel**

---

### ⚙️ Backend
- FastAPI  
- Scikit-learn  
- XGBoost  
- SHAP  
- SQLAlchemy  
- Pydantic  
- **Deployed on Render**

---

### 🗄️ Database
- PostgreSQL (Supabase)

---

## 🧠 System Architecture
Frontend (React)
↓
Backend (FastAPI)
↓
ML Model (XGBoost + SHAP)
↓
PostgreSQL (Supabase)

---

## 📸 Screenshots

> *(Add your screenshots here for better presentation)*

| Dashboard | SHAP Explanation |
|----------|----------------|
| ![](https://via.placeholder.com/400x250) | ![](https://via.placeholder.com/400x250) |

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/Diabetes-Risk-Platform.git
cd Diabetes-Risk-Platform

2️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create .env file:

DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_key

Run backend:

uvicorn app.main:app --reload

3️⃣ Frontend Setup
cd frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:8000

Run frontend:

npm run dev
🚀 Deployment
Backend (Render)
Web Service (Free tier)
Uses PostgreSQL via Supabase (connection pooling)
Environment variables required:
DATABASE_URL
SECRET_KEY
OPENAI_API_KEY
Frontend (Vercel)
Root directory: frontend
Environment variable:
VITE_API_URL=https://your-backend-url
'''
⚠️ Important Notes
Use Supabase connection pooling (port 6543) for deployment
Ensure CORS is enabled in backend
Do not expose .env files
📜 License

MIT License

⚠️ Disclaimer

This project is for educational purposes only.
It is not a substitute for professional medical advice.

👨‍💻 Author

Isa Hameem

GitHub: https://github.com/IsaHaameem
LinkedIn: https://linkedin.com/in/muhammad-isa-haameem-ba420834a
