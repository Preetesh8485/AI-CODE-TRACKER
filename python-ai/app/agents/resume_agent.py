import json
import re

from app.models.schemas import ResumeSchema
from app.services.gemini_service import generate
from app.utils.promptloader import load_prompt

prompt_template = load_prompt("resume_prompt.txt")

_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def clean_response(text: str) -> str:
    return _FENCE_RE.sub("", text).strip()


def parse_resume(
    file_path: str | None = None,
    raw_text: str | None = None,
) -> dict:

    if not file_path and not raw_text:
        raise ValueError("Either file_path or raw_text must be provided.")

    prompt = prompt_template

    last_error = None

    for attempt in range(3):
        try:
            response = generate(
                prompt=prompt,
                file_path=file_path,
                raw_text=raw_text,
            )

            cleaned = clean_response(response)

            data = json.loads(cleaned)

            validated = ResumeSchema.model_validate(data)

            return validated.model_dump()

        except Exception as e:
            last_error = e

            print(f"\nAttempt {attempt + 1}/3 Failed")
            print(e)

    raise ValueError(
        f"Resume Parsing Failed\nLast Error: {last_error}"
    )