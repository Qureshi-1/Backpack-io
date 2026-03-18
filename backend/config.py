import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backport.db")
SECRET_KEY = os.getenv("SECRET_KEY", "backport-secret-key-change-this")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://backport-io.vercel.app").strip().strip('"').strip("'").rstrip("/")
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", FRONTEND_URL)
CORS_ORIGINS = [o.strip().strip('"').strip("'").rstrip("/") for o in CORS_ORIGINS_STR.split(",") if o.strip()]

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@backport.dev")
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "backport-admin-secret-2026")
PORT = int(os.getenv("PORT", 8080))

# ─── Email via Resend ──────────────────────────────────────────────────────────
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev").strip()
APP_NAME = "Backport"
EMAIL_VERIFY_EXPIRE_HOURS = 24  # Verification token expires after 24 hours
