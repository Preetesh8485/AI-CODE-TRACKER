from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ResumeRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {
        "message": "AI Service Running"
    }

@app.post("/parse")
def parse_resume(data: ResumeRequest):
    return {
        "received": data.text
    }