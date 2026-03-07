import httpx
from fastapi import APIRouter, Request, Response, Depends, HTTPException
from dependencies import get_proxy_user
from models import User

router = APIRouter()

@router.api_route("/proxy/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_route(request: Request, path: str, user: User = Depends(get_proxy_user)):
    target_url = user.target_backend_url
    if not target_url:
        raise HTTPException(status_code=400, detail="Target backend URL not configured. Set it in your dashboard settings.")
    
    target_url = target_url.rstrip("/")
    path = path.lstrip("/")
    query = request.url.query
    full_target_url = f"{target_url}/{path}{'?' + query if query else ''}"
    
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("x-api-key", None)
    
    body = await request.body()
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.request(
                method=request.method,
                url=full_target_url,
                headers=headers,
                content=body,
            )
            return Response(content=resp.content, status_code=resp.status_code, headers=dict(resp.headers))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Bad Gateway: Error communicating with target backend - {str(e)}")
