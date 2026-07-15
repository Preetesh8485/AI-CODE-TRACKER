from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import Optional
import tempfile
import os
import json
from pydantic import BaseModel
from app.agents.resume_agent import parse_resume
from app.agents.ats_agent import analyze_ats
from app.services.pdf_link_extractor import extract_pdf_text
app = FastAPI()
class ATSRequest(BaseModel):
    resume_data: dict
    job_description: str


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
@app.post("/analyze-ats")
async def analyze_ats_endpoint(
    resume_data: str = Form(...),
    job_description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    temp_path = None

    try:
        resume_dict = json.loads(resume_data)

        if file is not None:

            if file.content_type != "application/pdf":
                raise HTTPException(
                    status_code=400,
                    detail="Only PDF files are supported for JD upload."
                )

            suffix = os.path.splitext(file.filename)[1]

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=suffix
            ) as tmp:
                tmp.write(await file.read())
                temp_path = tmp.name

            # Extract the JD text from the PDF here
            job_description_text = extract_pdf_text(temp_path)

        elif job_description and job_description.strip():

            job_description_text = job_description

        else:
            raise HTTPException(
                status_code=400,
                detail="Provide either job_description text or a JD PDF."
            )

        result = analyze_ats(
            resume_data=resume_dict,
            job_description=job_description_text,
        )

        return {
            "success": True,
            "result": result
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)