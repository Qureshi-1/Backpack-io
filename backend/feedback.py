from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from models import User, Feedback
from dependencies import get_current_user, get_current_admin, get_db

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

class FeedbackCreate(BaseModel):
    type: str # "bug", "feature", "improvement", "general"
    message: str
    rating: Optional[int] = None

class FeedbackUpdateStatus(BaseModel):
    status: str
    admin_comment: Optional[str] = None

@router.post("")
def submit_feedback(req: FeedbackCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    feedback = Feedback(
        user_id=user.id,
        user_email=user.email,
        type=req.type,
        message=req.message,
        rating=req.rating
    )
    db.add(feedback)
    db.commit()
    return {"status": "success"}

@router.get("")
def get_all_feedback(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    return feedbacks

@router.put("/{id}/status")
def update_feedback_status(id: int, req: FeedbackUpdateStatus, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    f = db.query(Feedback).filter(Feedback.id == id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Feedback not found")
    f.status = req.status
    if req.admin_comment is not None:
        f.admin_comment = req.admin_comment
    db.commit()
    return {"status": "success"}
