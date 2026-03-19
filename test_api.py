import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from database import SessionLocal
from models import User, ApiKey
import requests

def test_live():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "sq77554@gmail.com").first()
    if not user:
        print("User sq77554@gmail.com not found!")
        return

    api_key = db.query(ApiKey).filter(ApiKey.user_id == user.id).first()
    if not api_key:
        print("No API Key found for this user! Creating one...")
        import secrets
        new_key_str = f"bk_live_{secrets.token_hex(16)}"
        api_key = ApiKey(user_id=user.id, key=new_key_str, name="Test Key")
        db.add(api_key)
        db.commit()

    print(f"Using API Key: {api_key.key}")
    
    # Let's test the proxy on Production (or localhost if it's running)
    target = "https://jsonplaceholder.typicode.com/todos/1"
    proxy_url = "http://localhost:8000/proxy/todos/1" 
    
    try:
        res = requests.get(
            proxy_url,
            headers={
                "X-API-Key": api_key.key,
                "X-Target-Url": "https://jsonplaceholder.typicode.com" # Just in case
            }
        )
        print(f"Proxy Response: {res.status_code}")
        print(res.json())
    except Exception as e:
        print(f"Error testing proxy: {e}")

if __name__ == "__main__":
    test_live()
