from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import Optional
import tempfile
import os

from app.agents.resume_agent import parse_resume

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AI Service Running"}


@app.post("/parse")
async def parse(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    temp_path = None

    try:
        if file is not None:
            suffix = os.path.splitext(file.filename)[1]

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=suffix
            ) as tmp:
                tmp.write(await file.read())
                temp_path = tmp.name

            result = parse_resume(
                file_path=temp_path,
                raw_text=None
            )
        elif raw_text and raw_text.strip():
            result = parse_resume(
                file_path=None,
                raw_text=raw_text
            )

        else:
            raise HTTPException(
                status_code=400,
                detail="Either a PDF file or raw_text must be provided."
            )

        return {
            "success": True,
            "result": result
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)