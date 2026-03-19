from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from models import User, Feedback, ApiLog
from dependencies import get_current_admin, get_db
from pydantic import BaseModel
from config import ADMIN_SECRET

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

# ─── Bootstrap Admin (one-time setup, secured by secret) ─────────────────────
@router.get("/bootstrap")
def bootstrap_admin(
    email: str = Query(...),
    secret: str = Query(...),
    db: Session = Depends(get_db)
):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")
    
    target_user = db.query(User).filter(User.email == email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail=f"No user found with email: {email}")
    
    target_user.is_admin = True
    db.commit()
    return {
        "status": "success",
        "message": f"✅ {email} is now an admin. Please refresh your dashboard."
    }


# ─── Delete User (admin tool for testing) ─────────────────────────────────────
class DeleteUserReq(BaseModel):
    email: str
    secret: str

@router.post("/delete-user")
def delete_user(
    data: DeleteUserReq,
    db: Session = Depends(get_db)
):
    if data.secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")
    
    target = db.query(User).filter(User.email == data.email.lower()).first()
    if not target:
        return {"status": "not_found", "message": f"No user found with email: {data.email}"}
    
    # Delete dependencies
    from models import ApiKey, ApiLog, Feedback
    db.query(ApiLog).filter(ApiLog.user_id == target.id).delete()
    db.query(ApiKey).filter(ApiKey.user_id == target.id).delete()
    db.query(Feedback).filter(Feedback.user_id == target.id).delete()
    db.delete(target)
    db.commit()
    return {"status": "deleted", "message": f"🗑️ User {data.email} and all related data deleted."}


# ─── Force-resend verification email (debug endpoint) ─────────────────────────
@router.get("/resend-verify")
def admin_resend_verify(
    email: str = Query(...),
    secret: str = Query(...),
    db: Session = Depends(get_db)
):
    import secrets as _secrets
    from datetime import datetime
    
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")
    
    target = db.query(User).filter(User.email == email.lower()).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target.is_verified:
        return {"status": "already_verified", "message": "User is already verified."}
    
    token = _secrets.token_urlsafe(32)
    target.email_verification_token = token
    target.email_verification_sent_at = datetime.utcnow()
    db.commit()
    
    from email_service import send_verification_email
    result = send_verification_email(target.email, token)
    return {
        "status": "sent" if result else "failed",
        "message": f"Email {'sent' if result else 'FAILED'} to {target.email}"
    }
