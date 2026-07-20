import json
import chromadb
from app.services.embedding_service import embed_text,embed_batch,build_embedding_text
_client = chromadb.PersistentClient(path="./chroma_store")
_collection = _client.get_or_create_collection(
    name="interview_knowledge",
    metadata={"hnsw:space": "cosine"},
)
_LIST_FIELDS = ["questionPatterns", "evaluationCriteria", "followUpConcepts"]
def add_knowledge(knowledge_units: list[dict]) -> int:
    if not knowledge_units:
        return 0
    ids = [_slugify(unit["topic"]) for unit in knowledge_units]
    existing = _collection.get(ids=ids)
    existing_ids = set(existing["ids"])
    new_units = [
        unit
        for unit, id_ in zip(knowledge_units, ids)
        if id_ not in existing_ids
    ]
    if not new_units:
        return 0
    new_ids = [_slugify(unit["topic"]) for unit in new_units]

    documents = [
        build_embedding_text(unit)
        for unit in new_units
    ]
    embeddings = embed_batch(documents)

    metadatas = []

    for unit in new_units:
        metadata = {
            "topic": unit["topic"],
            "difficulty": unit.get("difficulty", "medium"),
            "status": unit.get("status", "seed"),
        }

        for field in _LIST_FIELDS:
            metadata[field] = json.dumps(
                unit.get(field, [])
            )

        metadatas.append(metadata)

    _collection.add(
        ids=new_ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )

    return len(new_ids)
def retrieve_knowledge(query: str, top_k: int = 3, min_similarity: float = 0.5) -> list[dict]:
    if _collection.count() == 0:
        return []
 
    results = _collection.query(
        query_embeddings=[embed_text(query)],
        n_results=min(top_k, _collection.count()),
    )
 
    matches = []
    ids = results["ids"][0]
    for i in range(len(ids)):
        # Chroma's cosine space returns distance = 1 - cosine_similarity.
        distance = results["distances"][0][i]
        similarity = 1 - distance
        if similarity < min_similarity:
            continue
 
        metadata = results["metadatas"][0][i]
        match = {
            "topic": metadata["topic"],
            "difficulty": metadata["difficulty"],
            "status": metadata.get("status", "seed"),
            "document": results["documents"][0][i],
            "similarity": round(similarity, 4),
        }
        for field in _LIST_FIELDS:
            match[field] = json.loads(metadata.get(field, "[]"))
        matches.append(match)
    return matches

def check_duplicate(topic: str, similarity_threshold: float = 0.92) -> bool:
    matches = retrieve_knowledge(topic, top_k=1, min_similarity=similarity_threshold)
    return len(matches) > 0

def collection_size() -> int:
    return _collection.count()

def _slugify(topic: str) -> str:
    return topic.strip().lower().replace(" ", "-").replace("/", "-")