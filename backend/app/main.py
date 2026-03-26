from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, auth, chat, history, analytics, models

app = FastAPI(
    title="Diabetes Risk Intelligence API",
    description="Backend API for Diabetes Risk Intelligence Platform",
    version="1.0.0"
)

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, tags=["Prediction"])
# app.include_router(predict.router)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(analytics.router)
app.include_router(models.router)
@app.get("/")
async def root():
    return {"message": "Welcome to the Diabetes Risk Intelligence API. System is running."}