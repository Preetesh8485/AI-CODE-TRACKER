from app.services.chroma_service import retrieve_knowledge


def main():
    queries = [
        "How does useEffect work in React?",
        "Explain database indexing",
        "What is process scheduling?",
        "How would you design a scalable chat application?"
    ]

    for query in queries:
        print("\n" + "=" * 80)
        print(f"QUERY: {query}")

        results = retrieve_knowledge(
            query=query,
            top_k=5,
            min_similarity=0.3
        )

        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result['topic']}")
            print(f"   Similarity: {result['similarity']}")
            print(f"   Difficulty: {result['difficulty']}")
            print(f"   Document: {result['document']}")


if __name__ == "__main__":
    main()