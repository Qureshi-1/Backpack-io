import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from models import User, ApiKey
from dependencies import get_db
from config import SECRET_KEY, ALGORITHM, TOKEN_EXPIRE_MINUTES, ADMIN_EMAIL

router = APIRouter(prefix="/api/auth", tags=["auth"])

class AuthReq(BaseModel):
    email: str
    password: str

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(req: AuthReq, db: Session = Depends(get_db)):
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    if db.query(User).filter(User.email == req.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = User(
        email=req.email.lower(),
        hashed_password=get_password_hash(req.password),
        is_admin=(req.email.lower() == ADMIN_EMAIL)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create default API key
    new_key = ApiKey(user_id=user.id, name="Default Gateway")
    db.add(new_key)
    db.commit()
    
    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"token": token, "api_key": new_key.key, "email": user.email}

@router.post("/login")
def login(req: AuthReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    # Get first API key
    api_key = user.api_keys[0].key if user.api_keys else None
    
    return {"token": token, "api_key": api_key, "email": user.email}
