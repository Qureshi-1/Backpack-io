import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from database import init_db
import auth, user, payment, feedback, proxy

# 1. Log Python Version
print(f"✅ Starting Backport Gateway using Python version: {sys.version}")

# 2. Initialize Database (ensure /data context)
init_db()

app = FastAPI(title="Backport API Gateway")

# Allow CORS for configured Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
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
    return {"status": "ok"}

# 4. Include Routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(payment.router)
app.include_router(feedback.router)

# Proxy route MUST be included so it operates at /proxy/
app.include_router(proxy.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)