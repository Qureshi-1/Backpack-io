import urllib.request
import urllib.parse
import json
import uuid
import time

BASE_URL = "https://backport-io.onrender.com"

# 1. Sign up a fake user
dummy_email = f"dummy_{uuid.uuid4().hex[:6]}@backport.io"
password = "testpassword123!"

print(f"--- 1. Registering dummy user ({dummy_email}) ---")
signup_data = json.dumps({"email": dummy_email, "password": password}).encode('utf-8')
try:
    req = urllib.request.Request(f"{BASE_URL}/api/auth/signup", data=signup_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        print(f"Signup: {response.status}")
        print(response.read().decode())
except Exception as e:
    print(f"Signup error: {e}")
    if hasattr(e, 'read'): print(e.read().decode())

# 2. Login (Wait, signup creates unverified users! Let's check if my recent backend code change removed the verification requirement)
print("\n--- 2. Attempting Login ---")
login_data = json.dumps({"email": dummy_email, "password": password}).encode('utf-8')
token = None
try:
    req = urllib.request.Request(f"{BASE_URL}/api/auth/login", data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode())
        print(f"Login successful! Got Access Token.")
        token = res.get("access_token")
except Exception as e:
    print(f"Login blocked/deferred: {e}")
    if hasattr(e, 'read'): print(e.read().decode())

# If we have token, let's create an API Key and test proxy
if token:
    print("\n--- 3. Provisioning an API Key ---")
    key_val = None
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/user/keys", data=json.dumps({"name": "Test Key"}).encode('utf-8'),
                                     headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            key_val = res.get("key")
            print(f"Key created: {res}")
    except Exception as e:
        print(f"API Key error: {e}")
        if hasattr(e, 'read'): print(e.read().decode())

    if key_val:
        print("\n--- 4. Testing Proxy WAF / Rates using the new API Key ---")
        proxy_url = f"{BASE_URL}/proxy/posts/1" # We will proxy JSONPlaceholder
        target_url = "https://jsonplaceholder.typicode.com"
        
        # We will make 3 normal requests to see cache in action
        for i in range(1, 4):
            try:
                t0 = time.time()
                proxy_req = urllib.request.Request(
                    proxy_url,
                    headers={
                        "X-API-Key": key_val,
                        "X-Target-Url": target_url
                    }
                )
                with urllib.request.urlopen(proxy_req) as response:
                    print(f"Req {i} [{(time.time()-t0)*1000:.1f}ms]: {response.status} -> {response.read().decode()[:50]}...")
            except Exception as e:
                 print(f"Proxy error {i}: {e}")
                 if hasattr(e, 'read'): print(e.read().decode())
