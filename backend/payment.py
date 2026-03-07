from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import razorpay
from models import User
from dependencies import get_current_user, get_db
from config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
import secrets

router = APIRouter(prefix="/api", tags=["billing"])

rzp_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class VerifyReq(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    mock: bool = False

@router.post("/create-order")
def create_order(user: User = Depends(get_current_user)):
    if user.plan == "pro":
        raise HTTPException(status_code=400, detail="Already on Pro plan")
    
    amount = 75000 # 750 INR in paise
    if rzp_client:
        try:
            order_data = {
                "amount": amount,
                "currency": "INR",
                "receipt": f"rcpt_{user.id}",
                "notes": {"user_id": str(user.id)}
            }
            order = rzp_client.order.create(data=order_data)
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": RAZORPAY_KEY_ID
            }
        except Exception as e:
            pass # Fallback to mock
            
    return {
        "order_id": f"mock_{secrets.token_hex(6)}",
        "amount": amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID or "mock_key",
        "mock": True
    }

@router.post("/verify-payment")
def verify_payment(req: VerifyReq, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.mock:
        user.plan = "pro"
        db.commit()
        return {"status": "success", "plan": "pro"}
        
    if not rzp_client:
        raise HTTPException(status_code=500, detail="Razorpay is not configured")
        
    try:
        rzp_client.utility.verify_payment_signature({
            "razorpay_order_id": req.razorpay_order_id,
            "razorpay_payment_id": req.razorpay_payment_id,
            "razorpay_signature": req.razorpay_signature
        })
        user.plan = "pro"
        db.commit()
        return {"status": "success", "plan": "pro"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
