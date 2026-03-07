from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import User, Feedback
from dependencies import get_current_user, get_db

router = APIRouter(prefix="/api/user", tags=["user"])

class SettingsUpdate(BaseModel):
    target_backend_url: str

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "api_key": user.api_key,
        "plan": user.plan,
        "target_backend_url": user.target_backend_url,
        "created_at": user.created_at,
        "is_admin": user.is_admin
    }

@router.get("/settings")
def get_settings(user: User = Depends(get_current_user)):
    return {"target_backend_url": user.target_backend_url}

@router.put("/settings")
def update_settings(data: SettingsUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.target_backend_url = data.target_backend_url
    db.commit()
    return {"status": "success", "target_backend_url": user.target_backend_url}

@router.get("/feedback")
def get_user_feedback(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).filter(Feedback.user_id == user.id).order_by(Feedback.created_at.desc()).all()
    return feedbacks
