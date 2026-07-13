from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.agents.resume_agent import parse_resume

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Service Running"}

class ResumeRequest(BaseModel):
    text: str

@app.post("/parse")
def parse(data: ResumeRequest):
    try:
        return {"result": parse_resume(data.text)}
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))