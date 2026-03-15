from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from models import User, Feedback, ApiLog
from dependencies import get_current_admin, get_db
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["admin"])

class UserUpdate(BaseModel):
    email: str
    plan: str

@router.get("/stats")
def get_admin_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_requests = db.query(func.count(ApiLog.id)).scalar()
    recent_feedbacks = db.query(func.count(Feedback.id)).filter(Feedback.status == "pending").scalar()
    
    # Plan distribution
    plans = db.query(User.plan, func.count(User.id)).group_by(User.plan).all()
    plan_stats = {plan: count for plan, count in plans}
    
    return {
        "total_users": total_users,
        "total_requests": total_requests,
        "pending_feedbacks": recent_feedbacks,
        "plan_distribution": plan_stats
    }

@router.get("/users")
def list_users(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    return [{"id": u.id, "email": u.email, "plan": u.plan, "is_admin": u.is_admin, "created_at": u.created_at} for u in users]

@router.post("/update-plan")
def update_user_plan(data: UserUpdate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_user = db.query(User).filter(User.email == data.email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.plan = data.plan
    db.commit()
    return {"status": "success", "message": f"User {data.email} plan updated to {data.plan}"}

@router.get("/feedbacks")
def list_all_feedbacks(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    return feedbacks
