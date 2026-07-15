import json

from app.models.atsSchema import ATSReportSchema
from app.services.gemini_service import generate_ats
from app.utils.promptloader import load_prompt


prompt_template = load_prompt("ats_prompt.txt")


def analyze_ats(
    resume_data: dict,
    job_description: str,
) -> dict:

    if not resume_data:
        raise ValueError("Resume data is required.")

    if not job_description or not job_description.strip():
        raise ValueError("Job description is required.")

    last_error = None

    for attempt in range(3):
        try:
            # Send resume + JD to Gemini
            response = generate_ats(
                prompt=prompt_template,
                resume_data=resume_data,
                job_description=job_description,
            )

            # Convert Gemini JSON response string to Python dict
            data = json.loads(response)

            # Validate against ATS Pydantic schema
            validated = ATSReportSchema.model_validate(data)

            return validated.model_dump()

        except Exception as e:
            last_error = e

            print(f"\nATS Attempt {attempt + 1}/3 Failed")
            print(e)

    raise ValueError(
        f"ATS Analysis Failed\nLast Error: {last_error}"
    )