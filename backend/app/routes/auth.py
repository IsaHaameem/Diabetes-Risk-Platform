from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.database import get_db
from app.utils.auth import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": user.email}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    db.execute(text("INSERT INTO users (email, hashed_password) VALUES (:email, :pwd)"), 
               {"email": user.email, "pwd": hashed_pwd})
    db.commit()
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.execute(text("SELECT id, hashed_password FROM users WHERE email = :email"), {"email": user.email}).fetchone()
    if not db_user or not verify_password(user.password, db_user[1]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(db_user[0])})
    return {"access_token": access_token, "token_type": "bearer"}