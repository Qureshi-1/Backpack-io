import bcrypt
import secrets
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from models import User, ApiKey
from dependencies import get_db
from config import SECRET_KEY, ALGORITHM, TOKEN_EXPIRE_MINUTES, ADMIN_EMAIL, EMAIL_VERIFY_EXPIRE_HOURS

router = APIRouter(prefix="/api/auth", tags=["auth"])

class AuthReq(BaseModel):
    email: str
    password: str
    referral_code: str = ""

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


# ─── Signup ───────────────────────────────────────────────────────────────────
@router.post("/signup")
def signup(req: AuthReq, db: Session = Depends(get_db)):
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    if db.query(User).filter(User.email == req.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    referred_by = None
    if req.referral_code:
        referrer = db.query(User).filter(User.referral_code == req.referral_code).first()
        if referrer:
            referred_by = referrer.id
            referrer.referrals_count += 1

    # Generate email verification token
    verification_token = secrets.token_urlsafe(32)

    user = User(
        email=req.email.lower(),
        hashed_password=get_password_hash(req.password),
        is_admin=(req.email.lower() == ADMIN_EMAIL),
        referred_by_id=referred_by,
        is_verified=False,
        email_verification_token=verification_token,
        email_verification_sent_at=datetime.utcnow(),
    )
    # Admin account is auto-verified
    if user.is_admin:
        user.is_verified = True
        user.email_verification_token = None

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create default API key
    new_key = ApiKey(user_id=user.id, name="Default Gateway")
    db.add(new_key)
    db.commit()

    # Send verification email (non-blocking — don't fail signup if email fails)
    if not user.is_admin:
        try:
            from email_service import send_verification_email
            send_verification_email(user.email, verification_token)
        except Exception as e:
            print(f"⚠️  Email send failed (non-fatal): {e}")

    return {
        "message": "Account created. Please check your email to verify your account.",
        "email": user.email,
        "email_verification_required": not user.is_admin,
    }


# ─── Verify Email ─────────────────────────────────────────────────────────────
@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_verification_token == token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link.")

    # Check token age
    if user.email_verification_sent_at:
        age = datetime.utcnow() - user.email_verification_sent_at
        if age > timedelta(hours=EMAIL_VERIFY_EXPIRE_HOURS):
            raise HTTPException(status_code=400, detail="Verification link has expired. Please request a new one.")

    # Mark verified
    user.is_verified = True
    user.email_verification_token = None
    db.commit()
    db.refresh(user)

    # Send welcome email
    try:
        from email_service import send_welcome_email
        send_welcome_email(user.email)
    except Exception:
        pass

    # Return JWT so frontend can auto-login
    api_key = user.api_keys[0].key if user.api_keys else None
    token_jwt = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "message": "Email verified successfully! Welcome to Backport.",
        "token": token_jwt,
        "api_key": api_key,
        "email": user.email,
    }


# ─── Resend Verification Email ─────────────────────────────────────────────────
class ResendReq(BaseModel):
    email: str

@router.post("/resend-verification")
def resend_verification(req: ResendReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Don't reveal if email exists
        return {"message": "If that email exists, a verification link has been sent."}
    if user.is_verified:
        return {"message": "Email is already verified."}

    # Rate limit: 1 resend per 60 seconds
    if user.email_verification_sent_at:
        seconds_since = (datetime.utcnow() - user.email_verification_sent_at).total_seconds()
        if seconds_since < 60:
            raise HTTPException(
                status_code=429,
                detail=f"Please wait {int(60 - seconds_since)} seconds before requesting another email."
            )

    new_token = secrets.token_urlsafe(32)
    user.email_verification_token = new_token
    user.email_verification_sent_at = datetime.utcnow()
    db.commit()

    try:
        from email_service import send_verification_email
        send_verification_email(user.email, new_token)
    except Exception as e:
        print(f"⚠️  Resend email failed: {e}")

    return {"message": "If that email exists, a verification link has been sent."}


# ─── Login ────────────────────────────────────────────────────────────────────
@router.post("/login")
def login(req: AuthReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Block unverified users (except admin)
    if not user.is_verified and not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="EMAIL_NOT_VERIFIED"
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    api_key = user.api_keys[0].key if user.api_keys else None
    return {"token": token, "api_key": api_key, "email": user.email}
