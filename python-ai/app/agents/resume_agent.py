import json
import re

from app.services.gemini_service import generate
from app.utils.promptloader import load_prompt
from app.models.schemas import ResumeSchema
prompt_template = load_prompt("resume_prompt.txt")
_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)

def parse_resume(raw_text: str) -> dict:

    prompt = f"""{prompt_template}

Resume:
{raw_text}
"""

    MAX_RETRIES = 3

    for attempt in range(MAX_RETRIES):

        raw_response = generate(prompt)

        cleaned = _FENCE_RE.sub("", raw_response).strip()

        try:
            data = json.loads(cleaned)

            validated = ResumeSchema.model_validate(data)

            return validated.model_dump()

        except Exception as e:

            print(f"Attempt {attempt + 1} failed:")

            print(e)

            print(cleaned[:500])   # print first 500 chars for debugging

    raise ValueError("Gemini failed to generate valid JSON after 3 attempts.")