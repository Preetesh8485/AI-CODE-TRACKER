import glob
import json
import os
 
from app.services.chroma_service import add_knowledge, collection_size
 
KB_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "interview_knowledge")
 
 
def main():
    filepaths = sorted(glob.glob(os.path.join(KB_DIR, "*.json")))
 
    if not filepaths:
        print(f"No JSON files found in {os.path.abspath(KB_DIR)} -- nothing to load.")
        return
 
    total = 0
    for filepath in filepaths:
        with open(filepath, "r", encoding="utf-8") as f:
            units = json.load(f)
 
        count = add_knowledge(units)
        total += count
        print(f"  {os.path.basename(filepath):<22} loaded {count} concepts")
 
    print(f"\nDone. {total} concepts processed this run.")
    print(f"Total concepts now in the collection: {collection_size()}")
 
 
if __name__ == "__main__":
    main()