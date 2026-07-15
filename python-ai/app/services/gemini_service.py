import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.models.schemas import ResumeSchema
from app.models.atsSchema import ATSReportSchema
import json
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate(
    prompt: str,
    file_path: str | None = None,
    raw_text: str | None = None,
):
    contents = []

    if file_path:
        uploaded_file = client.files.upload(file=file_path)
        contents.append(uploaded_file)

    elif raw_text:
        contents.append(raw_text)

    else:
        raise ValueError("Either file_path or raw_text must be provided.")

    contents.append(prompt)

    response = client.models.generate_content(
        model="gemini-3.5-flash",   # or your preferred Gemini model
        contents=contents,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ResumeSchema,
            temperature=0,
        ),
    )

    return response.text


def generate_ats(
    prompt: str,
    resume_data: dict,
    job_description: str,
):

    content = f"""
{prompt}

RESUME DATA:

{json.dumps(resume_data, indent=2)}

JOB DESCRIPTION:

{job_description}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=content,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ATSReportSchema,
            temperature=0,
        ),
    )

    return response.text