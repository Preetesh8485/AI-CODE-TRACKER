import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBEDDING_MODEL= "gemini-embedding-001"
DEFAULT_DIMENSIONALITY = 768
MAX_BATCH_SIZE = 100
def embed_text(text: str, output_dimensionality: int | None = DEFAULT_DIMENSIONALITY) -> list[float]:
    if not text or not text.strip():
        raise ValueError("Cannot embed empty text.")
    config = (
        types.EmbedContentConfig(output_dimensionality=output_dimensionality)
        if output_dimensionality
        else None
    )
    response = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=config,
    )
    return response.embeddings[0].values
def embed_batch( texts: list[str], output_dimensionality: int | None = DEFAULT_DIMENSIONALITY) -> list[list[float]]:
    if not texts:
        return []
 
    config = (
        types.EmbedContentConfig(output_dimensionality=output_dimensionality)
        if output_dimensionality
        else None
    )
 
    all_embeddings: list[list[float]] = []
    for i in range(0, len(texts), MAX_BATCH_SIZE):
        batch = texts[i : i + MAX_BATCH_SIZE]
        response = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=batch,
            config=config,
        )
        all_embeddings.extend([e.values for e in response.embeddings])
 
    return all_embeddings

def build_embedding_text(knowledge_unit: dict) -> str:
    parts = [knowledge_unit.get("topic", "")]
    parts.extend(knowledge_unit.get("concepts", []))
    return ". ".join(p for p in parts if p)