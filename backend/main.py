import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
import auth, user, payment, feedback, proxy, admin
from config import CORS_ORIGINS, ADMIN_EMAIL

print(f"✅ Starting Backport Gateway | Python {sys.version}")

app = FastAPI(title="Backport API Gateway")

@app.on_event("startup")
async def startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized")
        
        # Auto-migrate new columns
        with engine.begin() as conn:
            from sqlalchemy import text
            # Migrating basic toggles
            for col, dev_val in [
                ("rate_limit_enabled", "true"), 
                ("caching_enabled", "false"), 
                ("idempotency_enabled", "true"), 
                ("waf_enabled", "false"), 
                ("api_key", "null")
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} BOOLEAN DEFAULT {dev_val}"))
                except Exception:
                    pass
            
            # Migrating Referral columns
            migration_cols = [
                ("referral_code", "VARCHAR"),
                ("referred_by_id", "INTEGER"),
                ("referrals_count", "INTEGER DEFAULT 0"),
                ("total_paid_referrals", "INTEGER DEFAULT 0"),
                ("pending_referrals_count", "INTEGER DEFAULT 0"),
                ("has_received_first_reward", "BOOLEAN DEFAULT false")
            ]
            for col, col_type in migration_cols:
                try:
                    # 'IF NOT EXISTS' is supported in PostgreSQL 9.6+
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col} {col_type}"))
                    print(f"✅ Migration: Column {col} ensures exists.")
                except Exception as e:
                    # Fallback for SQLite which doesn't support IF NOT EXISTS in ALTER TABLE
                    try:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
                    except Exception:
                        pass

        # Migrate API Keys to new table
        with SessionLocal() as db:
            from models import User, ApiKey
            users = db.query(User).all()
            for u in users:
                if u.api_key:
                    # Check if they already have keys in the new table
                    existing_key = db.query(ApiKey).filter(ApiKey.user_id == u.id).first()
                    if not existing_key:
                        new_key = ApiKey(user_id=u.id, key=u.api_key, name="Default Gateway")
                        db.add(new_key)
                        db.commit()
                        print(f"🔑 Migrated API Key for {u.email}")
            
            # Auto-set Admin — always run on startup
            admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
            if admin_user:
                admin_user.is_admin = True
                db.commit()
                print(f"👑 Admin privileges ensured for {ADMIN_EMAIL}")
    except Exception as e:
        print(f"⚠️  DB init warning: {e}")

# Standard FastAPI CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # We use Bearer tokens, not cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"error": "Internal server error", "detail": str(exc)})

# 3. Health Endpoint (Public)
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.1.5", "cors": "pure_brute_force"}

# 4. Include Routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(payment.router)
app.include_router(feedback.router)
app.include_router(admin.router)

# Proxy route MUST be included so it operates at /proxy/
app.include_router(proxy.router)

from starlette.middleware.base import BaseHTTPMiddleware

class PureCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            response = JSONResponse(content="OK")
        else:
            try:
                response = await call_next(request)
            except Exception as e:
                import traceback
                traceback.print_exc()
                response = JSONResponse(
                    status_code=500, 
                    content={"error": "Internal server error", "detail": str(e)}
                )
        
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "false"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,PATCH,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization,Content-Type,X-API-Key"
        return response

app.add_middleware(PureCORSMiddleware)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)