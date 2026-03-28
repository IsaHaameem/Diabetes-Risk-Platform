from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import predict, auth, chat, history, analytics, models

app = FastAPI(
    title="Diabetes Risk Intelligence API",
    description="Backend API for Diabetes Risk Intelligence Platform",
    version="1.0.0"
)

# ✅ Allowed frontend origins (IMPORTANT: no trailing slash)
origins = [
    "http://localhost:5173",  # local development
    "https://diabetes-risk-platform.vercel.app",  # production frontend
    # Optional: preview deployments (if needed)
    # "https://diabetes-risk-platform-git-main.vercel.app"
]

# ✅ CORS middleware (FIXED)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # ❗ NOT ["*"]
    allow_credentials=True,       # required for auth
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include API routes
app.include_router(auth.router, tags=["Auth"])
app.include_router(predict.router, tags=["Prediction"])
app.include_router(chat.router, tags=["Chat"])
app.include_router(history.router, tags=["History"])
app.include_router(analytics.router, tags=["Analytics"])
app.include_router(models.router, tags=["Models"])

# ✅ Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Diabetes Risk Intelligence API is running 🚀"
    }