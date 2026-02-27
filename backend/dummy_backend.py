from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Dummy Target Backend")

@app.get("/")
def read_root():
    return {"message": "Hello from the Dummy Target Backend!"}

@app.get("/api/data")
def get_data():
    return {"data": "This is some dummy data from the backend", "status": "success"}

@app.post("/api/echo")
def echo_data(data: dict):
    return {"echo": data, "message": "Echoed successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
